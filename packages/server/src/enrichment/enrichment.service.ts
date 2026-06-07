// EnrichmentService — turns a raw lead into an actionable one (File 08).
//
// WHY: this is the core value step. Per lead it: fetches the lead's OWN website,
// extracts a contact email + phone, pulls Google reviews and splits them into
// positive/negative themes, and writes a short, grounded "why reach out" hook.
//
// METERING (master-context §6): all paid work for one lead runs inside a single
// `withCreditGate(userId, 'enrichment', leadId, …)` unit. The paid steps (Places
// details, crawl, LLM) live inside `fn`; honest "not found" outcomes still commit
// (we did the work), but a catastrophic failure throws and the gate refunds
// (net-zero). HONESTY (§7): we never fabricate an email/phone/hook — "not found"
// is a surfaced result, not an error.
//
// CACHING (§ File 07): Place details are cached by place_id so re-enriching never
// re-calls (or re-charges) the Places details SKU for already-fetched data.
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { BillingService } from '../billing/billing.service';
import { InsufficientCreditsError } from '../billing/billing.errors';
import { CrawlService } from '../crawl/crawl.service';
import { LlmService } from '../llm/llm.service';
import { PlacesService, type PlaceDetails, type PlaceReview } from '../places/places.service';
import { CacheService } from '../cache/cache.service';
import { EnrichmentStatus } from '@extrovertai/shared';
import type { Json, Tables } from '@extrovertai/shared';
import { extractEmails, extractPhones, pickPhone, rankEmails } from './contact-extract';

/** Parsed reviews stored on `leads.reviews` (jsonb). Parsed ONCE, here. */
export interface ParsedReviews {
  positive: string[];
  negative: string[];
  count: number; // number of reviews analyzed
  source: 'google';
}

export type EnrichOutcome =
  | {
      status: 'complete';
      leadId: string;
      hasEmail: boolean;
      hasPhone: boolean;
      hasReviews: boolean;
      siteRead: boolean;
    }
  | { status: 'skipped'; leadId: string; reason: 'already_enriched' | 'not_found' }
  | { status: 'failed'; leadId: string; reason: 'out_of_credits' | 'error'; message: string };

const DETAILS_CACHE_TTL = 30 * 24 * 60 * 60; // 30 days — place data changes slowly
const CONTACT_PAGES = ['', 'contact', 'contact-us', 'about', 'about-us'];
const MAX_CONTACT_PAGES = 3; // homepage + up to 2 likely contact pages
const SITE_TEXT_FOR_LLM = 2000;
const REVIEW_TEXT_FOR_LLM = 400;

type LeadRow = Pick<
  Tables<'leads'>,
  'id' | 'name' | 'website' | 'phone' | 'place_id' | 'rating' | 'review_count' | 'enrichment_status'
>;

@Injectable()
export class EnrichmentService {
  private readonly logger = new Logger(EnrichmentService.name);

  constructor(
    private readonly supabase: SupabaseService,
    private readonly billing: BillingService,
    private readonly crawl: CrawlService,
    private readonly llm: LlmService,
    private readonly places: PlacesService,
    private readonly cache: CacheService,
  ) {}

  /**
   * Enrich one lead end-to-end. Metered as one `enrichment` unit. Idempotent:
   * a lead already `complete` is skipped (no re-charge). Throws nothing for the
   * normal/partial path — returns a typed outcome instead.
   */
  async enrichLead(userId: string, leadId: string): Promise<EnrichOutcome> {
    const lead = await this.loadLead(userId, leadId);
    if (!lead) return { status: 'skipped', leadId, reason: 'not_found' };
    if (lead.enrichment_status === EnrichmentStatus.Complete) {
      return { status: 'skipped', leadId, reason: 'already_enriched' };
    }

    await this.setStatus(leadId, userId, EnrichmentStatus.InProgress);

    try {
      const result = await this.billing.withCreditGate(userId, 'enrichment', leadId, () =>
        this.runEnrichment(lead),
      );
      await this.setStatus(leadId, userId, EnrichmentStatus.Complete);
      return { status: 'complete', leadId, ...result };
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        // Not the lead's fault — revert to pending so a top-up + retry works.
        await this.setStatus(leadId, userId, EnrichmentStatus.Pending);
        return {
          status: 'failed',
          leadId,
          reason: 'out_of_credits',
          message: 'Out of credits — top up to enrich this lead.',
        };
      }
      await this.setStatus(leadId, userId, EnrichmentStatus.Failed);
      this.logger.warn(`Enrichment failed for ${leadId} (refunded): ${(err as Error).message}`);
      return {
        status: 'failed',
        leadId,
        reason: 'error',
        message: 'Enrichment didn’t finish. Nothing was charged — try again.',
      };
    }
  }

  /**
   * The paid work. Wrapped by the credit gate. Each external step is individually
   * guarded so a single failure becomes an honest "not found" (partial result)
   * rather than throwing — only a truly unexpected error propagates (→ refund).
   */
  private async runEnrichment(lead: LeadRow): Promise<{
    hasEmail: boolean;
    hasPhone: boolean;
    hasReviews: boolean;
    siteRead: boolean;
  }> {
    const hasWebsite = Boolean(lead.website && lead.website.trim());

    // 1) Reviews (+ freshest contact info) from Place Details — cached by place_id.
    const details = await this.getDetailsCached(lead.place_id);

    // 2) Site fetch + contact extraction (skip cleanly if no website).
    const site = hasWebsite
      ? await this.readSiteForContacts(lead.website as string)
      : { text: '', siteRead: false, emails: [] as string[], phones: [] as string[] };

    const ranked = rankEmails(site.emails, lead.website);
    const phone = pickPhone(lead.phone ?? details.phone, site.phones);

    // 3) Reviews split + "why reach out" hook (one LLM call; deterministic fallback).
    const { reviews, hook } = await this.analyze({
      lead,
      hasWebsite,
      siteText: site.text,
      details,
    });

    // 4) Persist everything in one update.
    await this.supabase
      .getAdminClient()
      .from('leads')
      .update({
        email: ranked.best,
        phone,
        reviews: reviews as unknown as Json,
        hook,
      })
      .eq('id', lead.id);

    return {
      hasEmail: Boolean(ranked.best),
      hasPhone: Boolean(phone),
      hasReviews: reviews.count > 0,
      siteRead: site.siteRead,
    };
  }

  /** Place details with a global cache keyed by place_id (avoids re-charging Google). */
  private async getDetailsCached(placeId: string | null): Promise<PlaceDetails> {
    const empty: PlaceDetails = {
      status: 'ok',
      reviews: [],
      website: null,
      phone: null,
      rating: null,
      reviewCount: null,
    };
    if (!placeId) return empty;
    const key = `places:details:${placeId}`;
    const cached = await this.cache.getJson<PlaceDetails>(key);
    if (cached) return cached;

    const details = await this.places.getPlaceDetails(placeId);
    // Cache only good responses; transient errors/rate-limits should retry later.
    if (details.status === 'ok') await this.cache.setJson(key, details, DETAILS_CACHE_TTL);
    return details;
  }

  /** Crawl the homepage (then likely contact pages) until an email is found. */
  private async readSiteForContacts(
    website: string,
  ): Promise<{ text: string; siteRead: boolean; emails: string[]; phones: string[] }> {
    const base = this.crawl.normalizeUrl(website);
    if (!base) return { text: '', siteRead: false, emails: [], phones: [] };

    let homeText = '';
    let siteRead = false;
    const emails = new Set<string>();
    const phones = new Set<string>();
    let pagesTried = 0;

    for (const path of CONTACT_PAGES) {
      if (pagesTried >= MAX_CONTACT_PAGES) break;
      const url = this.joinUrl(base, path);
      if (!url) continue;
      pagesTried++;
      const res = await this.crawl.fetchSite(url);
      if (!res.ok) continue;
      siteRead = true;
      if (path === '') homeText = res.text;
      extractEmails(res.text).forEach((e) => emails.add(e));
      extractPhones(res.text).forEach((p) => phones.add(p));
      if (emails.size > 0) break; // found contact info — stop spending crawl calls
    }

    return { text: homeText, siteRead, emails: [...emails], phones: [...phones] };
  }

  /** One LLM call to split reviews and write the hook; deterministic fallback. */
  private async analyze(args: {
    lead: LeadRow;
    hasWebsite: boolean;
    siteText: string;
    details: PlaceDetails;
  }): Promise<{ reviews: ParsedReviews; hook: string }> {
    const { lead, hasWebsite, siteText, details } = args;
    const reviewTexts = details.reviews
      .map((r) => r.text)
      .filter((t) => t.trim())
      .slice(0, 5);
    const reviewCount = reviewTexts.length;

    // Nothing to ground an LLM call on AND no website → deterministic honest hook.
    if (reviewCount === 0 && !siteText.trim()) {
      return {
        reviews: { positive: [], negative: [], count: 0, source: 'google' },
        hook: this.fallbackHook(lead, hasWebsite),
      };
    }

    try {
      const parsed = await this.llm.extractJson<{
        positive?: unknown;
        negative?: unknown;
        hook?: unknown;
      }>({
        system:
          'You are a B2B sales research assistant. You ONLY use the facts provided. ' +
          'Never invent problems, praise, or details that are not in the input.',
        prompt: this.buildPrompt({ lead, hasWebsite, siteText, details, reviewTexts }),
        maxTokens: 600,
        temperature: 0.3,
      });
      const reviews: ParsedReviews = {
        positive: this.toStringList(parsed.positive),
        negative: this.toStringList(parsed.negative),
        count: reviewCount,
        source: 'google',
      };
      const hook =
        typeof parsed.hook === 'string' && parsed.hook.trim()
          ? parsed.hook.trim()
          : this.fallbackHook(lead, hasWebsite);
      return { reviews, hook };
    } catch (err) {
      // LLM rate-limited/unavailable: still deliver value (raw split + fallback hook).
      this.logger.warn(`Hook/reviews LLM failed for ${lead.id}: ${(err as Error).message}`);
      return {
        reviews: this.heuristicSplit(details.reviews, reviewCount),
        hook: this.fallbackHook(lead, hasWebsite),
      };
    }
  }

  private buildPrompt(args: {
    lead: LeadRow;
    hasWebsite: boolean;
    siteText: string;
    details: PlaceDetails;
    reviewTexts: string[];
  }): string {
    const { lead, hasWebsite, siteText, details, reviewTexts } = args;
    const rating = lead.rating ?? details.rating;
    const count = lead.review_count ?? details.reviewCount;
    const reviewsBlock = reviewTexts.length
      ? reviewTexts.map((t, i) => `Review ${i + 1}: ${t.slice(0, REVIEW_TEXT_FOR_LLM)}`).join('\n')
      : '(no review text available)';
    const siteBlock = siteText.trim()
      ? siteText.slice(0, SITE_TEXT_FOR_LLM)
      : hasWebsite
        ? '(website could not be read)'
        : '(this business has NO website)';

    return [
      `Business: ${lead.name ?? 'Unknown'}`,
      `Has website: ${hasWebsite ? 'yes' : 'no'}`,
      rating != null ? `Google rating: ${rating} from ${count ?? 0} reviews` : '',
      '',
      'Website text (may be empty):',
      siteBlock,
      '',
      'Recent Google reviews:',
      reviewsBlock,
      '',
      'Return JSON with exactly these keys:',
      '{',
      '  "positive": [short phrases of what customers praise, from the reviews only],',
      '  "negative": [short phrases of complaints/criticism, from the reviews only],',
      '  "hook": "1-2 sentences: the single best reason to reach out to this business and the angle to use"',
      '}',
      '',
      'Rules: Ground every word in the facts above. If there are no reviews, use empty arrays.',
      'If the business has no website, treat that as a sales signal in the hook (e.g. pitch a simple site).',
      'If nothing specific stands out, write an honest, neutral hook — do NOT invent problems.',
    ]
      .filter(Boolean)
      .join('\n');
  }

  /** A grounded hook without the LLM (no-data path or LLM failure). */
  private fallbackHook(lead: LeadRow, hasWebsite: boolean): string {
    const rating = lead.rating;
    const reviews = lead.review_count ?? 0;
    if (!hasWebsite) {
      if (rating != null && rating >= 4.3 && reviews >= 10) {
        return `Strong reviews (${rating}★ from ${reviews}) but no website — an easy opening to pitch a simple site or landing page.`;
      }
      return 'No website found — a clear opening to pitch a simple website or online presence.';
    }
    if (rating != null && rating < 4.0) {
      return `Rated ${rating}★ — there may be room to help improve their reputation or customer experience.`;
    }
    return 'Established local business — reach out to introduce your service and find a fit.';
  }

  /** Split reviews by star rating when the LLM is unavailable (still grounded). */
  private heuristicSplit(reviews: PlaceReview[], count: number): ParsedReviews {
    const positive: string[] = [];
    const negative: string[] = [];
    for (const r of reviews.slice(0, 5)) {
      if (!r.text.trim()) continue;
      const snippet = r.text.slice(0, 140).trim();
      if (r.rating != null && r.rating <= 3) negative.push(snippet);
      else positive.push(snippet);
    }
    return { positive, negative, count, source: 'google' };
  }

  private toStringList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.trim())
      .filter(Boolean)
      .slice(0, 6);
  }

  private async loadLead(userId: string, leadId: string): Promise<LeadRow | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('leads')
      .select('id,name,website,phone,place_id,rating,review_count,enrichment_status')
      .eq('id', leadId)
      .eq('user_id', userId)
      .maybeSingle();
    return (data as LeadRow) ?? null;
  }

  private async setStatus(
    leadId: string,
    userId: string,
    status: EnrichmentStatus,
  ): Promise<void> {
    const { error } = await this.supabase
      .getAdminClient()
      .from('leads')
      .update({ enrichment_status: status })
      .eq('id', leadId)
      .eq('user_id', userId);
    if (error) this.logger.warn(`Could not set status ${status} on ${leadId}: ${error.message}`);
  }

  private joinUrl(base: string, path: string): string | null {
    try {
      return path ? new URL(`/${path}`, base).toString() : base;
    } catch {
      return null;
    }
  }
}

// OnboardingService — the website-to-profile flow (master-context §5/§7).
//
// WHY: turns a URL into a prefilled, editable company profile + branding, and
// persists confirmed edits. Crawl + extract are grounded ("use only what's on the
// site; never invent"); branding is applied as accent-only on our neutral base
// with a contrast guard; every failure degrades to the manual path.
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CrawlService, LlmService, SupabaseService } from '@extrovertai/server';
import type { Tables } from '@extrovertai/shared';
import { resolveAccent } from './theme.util';
import type { SaveProfileDto } from './onboarding.dto';

type CompanyProfile = Tables<'company_profiles'>;

interface ExtractedProfile {
  services: string | null;
  about: string | null;
  value_prop: string | null;
  tone: string | null;
  proof_points: string[];
}

export interface CrawlOutcome {
  ok: boolean;
  error?: string;
  profile?: CompanyProfile;
  meta?: {
    accentDetected: boolean;
    accentFallback: boolean;
    crawlSource: string;
    extractionFailed: boolean;
  };
}

const MAX_CRAWL_CHARS = 6000;

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    private readonly crawl: CrawlService,
    private readonly llm: LlmService,
    private readonly supabase: SupabaseService,
  ) {}

  /** Crawl + extract + brand, persist a draft, return it for review. */
  async crawlAndExtract(userId: string, rawUrl: string): Promise<CrawlOutcome> {
    const url = this.crawl.normalizeUrl(rawUrl);
    if (!url) {
      return { ok: false, error: 'That doesn’t look like a valid website address.' };
    }

    const [site, branding] = await Promise.all([
      this.crawl.fetchSite(url),
      this.crawl.fetchBranding(url),
    ]);

    if (!site.ok) {
      return {
        ok: false,
        error:
          site.error ??
          'We couldn’t read that site. You can paste your details by hand instead.',
      };
    }

    let extracted: ExtractedProfile = {
      services: null,
      about: null,
      value_prop: null,
      tone: null,
      proof_points: [],
    };
    let extractionFailed = false;
    try {
      extracted = await this.extract(site.text);
    } catch (err) {
      extractionFailed = true;
      this.logger.warn(`Profile extraction failed: ${(err as Error).message}`);
    }

    const accent = resolveAccent(branding.themeColor);

    const profile = await this.upsert(userId, {
      website: url,
      raw_crawl: site.text,
      services: extracted.services,
      about: extracted.about,
      value_prop: extracted.value_prop,
      tone: extracted.tone,
      proof_points: extracted.proof_points,
      logo_url: branding.logoUrl,
      brand_color: accent.accent,
      theme_source: 'fetched',
    });

    return {
      ok: true,
      profile,
      meta: {
        accentDetected: accent.detected,
        accentFallback: accent.usedFallback,
        crawlSource: site.source,
        extractionFailed,
      },
    };
  }

  async getProfile(userId: string): Promise<CompanyProfile | null> {
    const { data } = await this.supabase
      .getAdminClient()
      .from('company_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    return data ?? null;
  }

  async saveProfile(userId: string, dto: SaveProfileDto): Promise<CompanyProfile> {
    return this.upsert(userId, {
      website: dto.website ?? null,
      services: dto.services ?? null,
      about: dto.about ?? null,
      value_prop: dto.value_prop ?? null,
      tone: dto.tone ?? null,
      proof_points: dto.proof_points ?? [],
      logo_url: dto.logo_url ?? null,
      brand_color: dto.brand_color ?? null,
      theme_source: dto.theme_source ?? 'official',
    });
  }

  // --- internals ---
  private async extract(text: string): Promise<ExtractedProfile> {
    const system =
      "You extract a company profile from the text of a company's OWN website. " +
      'Use ONLY information present in the text. If something is not stated, use null ' +
      '(or [] for proof_points). Never invent facts.';
    const prompt =
      `Website text:\n"""\n${text.slice(0, MAX_CRAWL_CHARS)}\n"""\n\n` +
      'Return JSON with exactly this shape:\n' +
      '{"services": string|null, "about": string|null, "value_prop": string|null, "tone": string|null, "proof_points": string[]}\n' +
      '- services: what they offer (1-3 sentences)\n' +
      '- about: who they are (1-3 sentences)\n' +
      '- value_prop: their main promise/benefit (1 sentence)\n' +
      '- tone: their writing tone in 2-4 words (e.g. "friendly and professional")\n' +
      '- proof_points: concrete proof (named clients, numbers, awards, guarantees) as short strings; [] if none.';

    const raw = await this.llm.extractJson<Partial<ExtractedProfile>>({ system, prompt });
    return {
      services: this.str(raw.services),
      about: this.str(raw.about),
      value_prop: this.str(raw.value_prop),
      tone: this.str(raw.tone),
      proof_points: Array.isArray(raw.proof_points)
        ? raw.proof_points.filter((p): p is string => typeof p === 'string').slice(0, 12)
        : [],
    };
  }

  private str(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private async upsert(
    userId: string,
    fields: Omit<Partial<CompanyProfile>, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
  ): Promise<CompanyProfile> {
    const admin = this.supabase.getAdminClient();
    const existing = await admin
      .from('company_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existing.data) {
      const { data, error } = await admin
        .from('company_profiles')
        .update(fields)
        .eq('id', existing.data.id)
        .select('*')
        .single();
      if (error || !data) throw new BadRequestException('Could not save your profile.');
      return data;
    }

    const { data, error } = await admin
      .from('company_profiles')
      .insert({ user_id: userId, ...fields })
      .select('*')
      .single();
    if (error || !data) throw new BadRequestException('Could not save your profile.');
    return data;
  }
}

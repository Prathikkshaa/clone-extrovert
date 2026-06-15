// LeadsService — Places search → leads, metered + cached + de-duplicated.
//
// METERING: a search is one paid action (CREDIT_COSTS.search) run through the
// File-06 credit gate. CACHING: identical repeat searches by the same user return
// from Redis (CacheService) WITHOUT a Places call or a charge. DEDUP: a user never
// gets the same place_id twice (unique index + a pre-insert check).
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  BillingService,
  CacheService,
  InsufficientCreditsError,
  PlacesService,
  SupabaseService,
  type PlaceResult,
  type PlacesFilters,
} from '@extrovertai/server';
import type { Json, Tables } from '@extrovertai/shared';

export type LeadCard = Pick<
  Tables<'leads'>,
  | 'id'
  | 'name'
  | 'website'
  | 'phone'
  | 'address'
  | 'rating'
  | 'review_count'
  | 'place_id'
  | 'status'
>;

/** A lead with its enrichment fields — the shape the File 08 enrich screen renders. */
export type EnrichedLeadCard = Pick<
  Tables<'leads'>,
  | 'id'
  | 'name'
  | 'website'
  | 'email'
  | 'phone'
  | 'address'
  | 'rating'
  | 'review_count'
  | 'reviews'
  | 'hook'
  | 'status'
  | 'enrichment_status'
>;

export type SearchOutcome =
  | {
      ok: true;
      cached: boolean;
      searchId: string;
      leads: LeadCard[];
      count: number;
      nextPageToken?: string;
    }
  | { ok: false; reason: 'out_of_credits' | 'busy' | 'error'; message: string };

const LEAD_CARD_COLUMNS = 'id,name,website,phone,address,rating,review_count,place_id,status';
const ENRICHED_LEAD_COLUMNS =
  'id,name,website,email,phone,address,rating,review_count,reviews,hook,status,enrichment_status';
const CACHE_TTL_SECONDS = 24 * 60 * 60;

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly places: PlacesService,
    private readonly billing: BillingService,
    private readonly cache: CacheService,
    private readonly supabase: SupabaseService,
  ) {}

  async runSearch(
    userId: string,
    input: { industry: string; location: string; filters?: PlacesFilters; pageToken?: string },
  ): Promise<SearchOutcome> {
    if (!this.places.isConfigured()) {
      return { ok: false, reason: 'error', message: 'Lead search isn’t set up on this server yet.' };
    }
    const admin = this.supabase.getAdminClient();
    const filters = input.filters ?? {};

    // Record the search query.
    const searchRow = await admin
      .from('searches')
      .insert({
        user_id: userId,
        industry: input.industry,
        location: input.location,
        filters: filters as unknown as Json,
      })
      .select('id')
      .single();
    if (searchRow.error || !searchRow.data) {
      return { ok: false, reason: 'error', message: 'Could not start the search.' };
    }
    const searchId = searchRow.data.id;

    const cacheKey = this.cacheKey(userId, input);
    let page = await this.cache.getJson<{ results: PlaceResult[]; nextPageToken?: string }>(cacheKey);
    const cached = page !== null;

    if (!cached) {
      try {
        page = await this.billing.withCreditGate(userId, 'search', searchId, async () => {
          const r = await this.places.search({
            industry: input.industry,
            location: input.location,
            filters,
            pageToken: input.pageToken,
          });
          if (r.status === 'rate_limited') throw new BusyError();
          if (r.status === 'error' || r.status === 'not_configured') {
            throw new Error(r.error ?? 'Places search failed.');
          }
          // 'ok' or 'zero_results' (empty) — both count as a search.
          return { results: r.results, nextPageToken: r.nextPageToken };
        });
      } catch (err) {
        if (err instanceof InsufficientCreditsError) {
          return {
            ok: false,
            reason: 'out_of_credits',
            message: 'You’re out of credits. Top up to keep searching.',
          };
        }
        if (err instanceof BusyError) {
          return {
            ok: false,
            reason: 'busy',
            message: 'Search is busy right now — please try again shortly. Nothing was charged.',
          };
        }
        this.logger.warn(`Search failed (refunded): ${(err as Error).message}`);
        return {
          ok: false,
          reason: 'error',
          message: 'Something went wrong searching. Nothing was charged.',
        };
      }
      await this.cache.setJson(cacheKey, page ?? { results: [] }, CACHE_TTL_SECONDS);
    }

    const leads = await this.persistLeads(userId, searchId, page?.results ?? []);
    return {
      ok: true,
      cached,
      searchId,
      leads,
      count: leads.length,
      nextPageToken: page?.nextPageToken,
    };
  }

  async getLists(userId: string): Promise<Pick<Tables<'lists'>, 'id' | 'name' | 'created_at'>[]> {
    const { data, error } = await this.supabase
      .getAdminClient()
      .from('lists')
      .select('id, name, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw new BadRequestException('Could not load your lists.');
    return data ?? [];
  }

  /** Leads in a list, with enrichment fields, scoped to the user (File 08 screen). */
  async getListLeads(userId: string, listId: string): Promise<EnrichedLeadCard[]> {
    const admin = this.supabase.getAdminClient();
    const list = await admin
      .from('lists')
      .select('id')
      .eq('id', listId)
      .eq('user_id', userId)
      .maybeSingle();
    if (!list.data) throw new NotFoundException('List not found.');

    const links = await admin.from('lead_list').select('lead_id').eq('list_id', listId);
    const leadIds = (links.data ?? []).map((r) => r.lead_id);
    if (leadIds.length === 0) return [];

    const { data, error } = await admin
      .from('leads')
      .select(ENRICHED_LEAD_COLUMNS)
      .eq('user_id', userId)
      .in('id', leadIds)
      .order('created_at', { ascending: false });
    if (error) throw new BadRequestException('Could not load the list’s leads.');
    return (data as EnrichedLeadCard[]) ?? [];
  }

  /** Save leads into a list (new or existing). Both scoped to the user. */
  async saveToList(
    userId: string,
    input: { listId?: string; listName?: string; leadIds: string[] },
  ): Promise<{ listId: string; linked: number }> {
    const admin = this.supabase.getAdminClient();

    let listId = input.listId;
    if (listId) {
      const found = await admin
        .from('lists')
        .select('id')
        .eq('id', listId)
        .eq('user_id', userId)
        .maybeSingle();
      if (!found.data) throw new NotFoundException('List not found.');
    } else {
      if (!input.listName?.trim()) throw new BadRequestException('Provide a list name.');
      const created = await admin
        .from('lists')
        .insert({ user_id: userId, name: input.listName.trim() })
        .select('id')
        .single();
      if (created.error || !created.data) throw new BadRequestException('Could not create the list.');
      listId = created.data.id;
    }

    // Only link leads that actually belong to the user (defense in depth).
    const owned = await admin
      .from('leads')
      .select('id')
      .eq('user_id', userId)
      .in('id', input.leadIds);
    const ownedIds = new Set((owned.data ?? []).map((r) => r.id));

    const existing = await admin
      .from('lead_list')
      .select('lead_id')
      .eq('list_id', listId)
      .in('lead_id', input.leadIds);
    const alreadyLinked = new Set((existing.data ?? []).map((r) => r.lead_id));

    const toLink = input.leadIds
      .filter((id) => ownedIds.has(id) && !alreadyLinked.has(id))
      .map((lead_id) => ({ list_id: listId as string, lead_id }));

    if (toLink.length) {
      const { error } = await admin.from('lead_list').insert(toLink);
      if (error) throw new BadRequestException('Could not save leads to the list.');
    }
    return { listId, linked: toLink.length };
  }

  // --- internals ---
  private async persistLeads(
    userId: string,
    searchId: string,
    results: PlaceResult[],
  ): Promise<LeadCard[]> {
    if (results.length === 0) return [];
    const admin = this.supabase.getAdminClient();
    const placeIds = results.map((r) => r.placeId);

    const existing = await admin
      .from('leads')
      .select('place_id')
      .eq('user_id', userId)
      .in('place_id', placeIds);
    const have = new Set((existing.data ?? []).map((r) => r.place_id));

    const toInsert = results
      .filter((r) => !have.has(r.placeId))
      .map((r) => ({
        user_id: userId,
        search_id: searchId,
        place_id: r.placeId,
        name: r.name,
        website: r.website,
        phone: r.phone,
        address: r.address,
        rating: r.rating,
        review_count: r.reviewCount,
        status: 'new' as const,
        enrichment_status: 'pending' as const,
      }));

    if (toInsert.length) {
      const { error } = await admin.from('leads').insert(toInsert);
      if (error) this.logger.warn(`Lead insert partial failure: ${error.message}`);
    }

    const all = await admin
      .from('leads')
      .select(LEAD_CARD_COLUMNS)
      .eq('user_id', userId)
      .in('place_id', placeIds)
      .order('created_at', { ascending: false });
    return (all.data as LeadCard[]) ?? [];
  }

  private cacheKey(
    userId: string,
    input: { industry: string; location: string; filters?: PlacesFilters; pageToken?: string },
  ): string {
    const norm = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, ' ');
    const f = input.filters ?? {};
    const page = input.pageToken ? `|p:${input.pageToken}` : '';
    return `places:${userId}:${norm(input.industry)}|${norm(input.location)}|${JSON.stringify(f)}${page}`;
  }
}

class BusyError extends Error {
  constructor() {
    super('Places API busy');
    this.name = 'BusyError';
  }
}

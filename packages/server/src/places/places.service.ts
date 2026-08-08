// PlacesService — Google Places API (New) text search (master-context §2: Places
// only, no scraping).
//
// WHY: one reusable provider for lead discovery. The New API returns name,
// rating, review count, website, and phone INLINE via a single field-masked call —
// no separate per-place detail lookups (the old API's cost trap). We still cache
// at the search layer (CacheService) to avoid re-charging/re-calling on repeats.
//
// Buying-signal filters (no-website, low-rating/low-reviews) are applied
// CLIENT-SIDE because Places text search has no equivalent query params.
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface PlacesFilters {
  noWebsite?: boolean; // legacy alias for website === 'none'
  website?: 'any' | 'has' | 'none';
  minRating?: number; // keep businesses at/above this rating
  maxRating?: number; // keep businesses at/below this rating (improvement opportunity)
  minReviews?: number; // keep businesses at/above this review count
  maxReviews?: number; // keep businesses at/below this review count
}

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string | null;
  rating: number | null;
  reviewCount: number | null;
  website: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
}

export type PlacesStatus = 'ok' | 'zero_results' | 'rate_limited' | 'error' | 'not_configured';

export interface PlacesSearchResult {
  status: PlacesStatus;
  results: PlaceResult[];
  /** Token to fetch the next page of results (undefined when there are no more). */
  nextPageToken?: string;
  error?: string;
}

/** A single Google review (subset of the Places "review" object we care about). */
export interface PlaceReview {
  rating: number | null;
  text: string;
  author: string | null;
  when: string | null; // e.g. "2 months ago"
}

export interface PlaceDetails {
  status: 'ok' | 'rate_limited' | 'error' | 'not_configured';
  reviews: PlaceReview[];
  website: string | null;
  phone: string | null;
  rating: number | null;
  reviewCount: number | null;
  error?: string;
}

const ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const DETAILS_ENDPOINT = 'https://places.googleapis.com/v1/places';
// Reviews + freshest contact fields. Place Details (New) returns up to 5 reviews
// inline; this is the only field set File 08 enrichment needs from the details SKU.
const DETAILS_FIELD_MASK = [
  'id',
  'reviews',
  'websiteUri',
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'rating',
  'userRatingCount',
].join(',');
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.rating',
  'places.userRatingCount',
  'places.websiteUri',
  'places.nationalPhoneNumber',
  'places.location',
  'nextPageToken',
].join(',');

@Injectable()
export class PlacesService {
  private readonly logger = new Logger(PlacesService.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('GOOGLE_PLACES_API_KEY'));
  }

  async search(params: {
    industry: string;
    location: string;
    filters?: PlacesFilters;
    maxResults?: number;
    /** Page token from a previous result to fetch the next page (≤60 total). */
    pageToken?: string;
  }): Promise<PlacesSearchResult> {
    const apiKey = this.config.get<string>('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return { status: 'not_configured', results: [], error: 'Places API is not configured.' };
    }

    const textQuery = `${params.industry} in ${params.location}`.trim();
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': FIELD_MASK,
        },
        body: JSON.stringify({
          textQuery,
          maxResultCount: Math.min(params.maxResults ?? 20, 20),
          ...(params.pageToken ? { pageToken: params.pageToken } : {}),
        }),
        signal: AbortSignal.timeout(20000),
      });

      if (res.status === 429) {
        return { status: 'rate_limited', results: [], error: 'Places API rate-limited.' };
      }

      const json = (await res.json()) as {
        places?: RawPlace[];
        nextPageToken?: string;
        error?: { status?: string; message?: string };
      };

      if (!res.ok || json.error) {
        const status = json.error?.status;
        if (status === 'RESOURCE_EXHAUSTED') {
          return { status: 'rate_limited', results: [], error: 'Places API rate-limited.' };
        }
        return {
          status: 'error',
          results: [],
          error: json.error?.message ?? `Places returned ${res.status}.`,
        };
      }

      const all = (json.places ?? []).map((p) => this.toResult(p));
      const filtered = this.applyFilters(all, params.filters);
      return {
        status: filtered.length ? 'ok' : 'zero_results',
        results: filtered,
        nextPageToken: json.nextPageToken,
      };
    } catch (err) {
      this.logger.warn(`Places search failed: ${(err as Error).message}`);
      return { status: 'error', results: [], error: (err as Error).message };
    }
  }

  /**
   * Fetch reviews + freshest contact info for one place (Place Details New).
   * This is a PAID call (details/reviews SKU) — callers MUST meter it via the
   * credit gate and SHOULD cache the result by place_id (File 08 does both).
   */
  async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    const empty: PlaceDetails = {
      status: 'ok',
      reviews: [],
      website: null,
      phone: null,
      rating: null,
      reviewCount: null,
    };
    const apiKey = this.config.get<string>('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return { ...empty, status: 'not_configured', error: 'Places API is not configured.' };
    }
    try {
      const res = await fetch(`${DETAILS_ENDPOINT}/${encodeURIComponent(placeId)}`, {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': DETAILS_FIELD_MASK,
        },
        signal: AbortSignal.timeout(20000),
      });

      if (res.status === 429) {
        return { ...empty, status: 'rate_limited', error: 'Places API rate-limited.' };
      }

      const json = (await res.json()) as RawPlaceDetails & {
        error?: { status?: string; message?: string };
      };

      if (!res.ok || json.error) {
        if (json.error?.status === 'RESOURCE_EXHAUSTED') {
          return { ...empty, status: 'rate_limited', error: 'Places API rate-limited.' };
        }
        return {
          ...empty,
          status: 'error',
          error: json.error?.message ?? `Places details returned ${res.status}.`,
        };
      }

      return {
        status: 'ok',
        reviews: (json.reviews ?? []).map((r) => this.toReview(r)),
        website: json.websiteUri ?? null,
        phone: json.nationalPhoneNumber ?? json.internationalPhoneNumber ?? null,
        rating: typeof json.rating === 'number' ? json.rating : null,
        reviewCount: typeof json.userRatingCount === 'number' ? json.userRatingCount : null,
      };
    } catch (err) {
      this.logger.warn(`Places details failed: ${(err as Error).message}`);
      return { ...empty, status: 'error', error: (err as Error).message };
    }
  }

  private toReview(r: RawReview): PlaceReview {
    const text = (r.text?.text ?? r.originalText?.text ?? '').trim();
    return {
      rating: typeof r.rating === 'number' ? r.rating : null,
      text,
      author: r.authorAttribution?.displayName ?? null,
      when: r.relativePublishTimeDescription ?? null,
    };
  }

  private toResult(p: RawPlace): PlaceResult {
    return {
      placeId: p.id,
      name: p.displayName?.text ?? '(unnamed)',
      address: p.formattedAddress ?? null,
      rating: typeof p.rating === 'number' ? p.rating : null,
      reviewCount: typeof p.userRatingCount === 'number' ? p.userRatingCount : null,
      website: p.websiteUri ?? null,
      phone: p.nationalPhoneNumber ?? null,
      lat: p.location?.latitude ?? null,
      lng: p.location?.longitude ?? null,
    };
  }

  private applyFilters(results: PlaceResult[], filters?: PlacesFilters): PlaceResult[] {
    if (!filters) return results;
    const website = filters.website ?? (filters.noWebsite ? 'none' : 'any');
    return results.filter((r) => {
      // Website availability.
      if (website === 'none' && r.website) return false;
      if (website === 'has' && !r.website) return false;
      // Rating range (skip businesses with no rating only when a bound is set).
      if (typeof filters.minRating === 'number') {
        if (r.rating === null || r.rating < filters.minRating) return false;
      }
      if (typeof filters.maxRating === 'number') {
        if (r.rating !== null && r.rating > filters.maxRating) return false;
      }
      // Review-count range.
      if (typeof filters.minReviews === 'number') {
        if ((r.reviewCount ?? 0) < filters.minReviews) return false;
      }
      if (typeof filters.maxReviews === 'number') {
        if (r.reviewCount !== null && r.reviewCount > filters.maxReviews) return false;
      }
      return true;
    });
  }
}

interface RawPlace {
  id: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  nationalPhoneNumber?: string;
  location?: { latitude?: number; longitude?: number };
}

interface RawReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string };
}

interface RawPlaceDetails {
  reviews?: RawReview[];
  websiteUri?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
}

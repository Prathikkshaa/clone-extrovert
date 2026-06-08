// CacheService — small Redis-backed JSON cache with TTL.
// WHY: lets paid lookups (e.g. Places search results, File 07) be cached so an
// identical repeat does not re-call the external API or re-charge credits. Fully
// guarded: with no REDIS_URL the cache is disabled (every get is a miss), so
// callers behave correctly without Redis.
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly client: Redis | null;

  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL');
    if (url) {
      this.client = new Redis(url, { maxRetriesPerRequest: null, lazyConnect: false });
      this.client.on('error', (err) => this.logger.warn(`Redis cache error: ${err.message}`));
    } else {
      this.client = null;
      this.logger.warn('REDIS_URL not set — cache disabled (every lookup is a miss).');
    }
  }

  enabled(): boolean {
    return this.client !== null;
  }

  async getJson<T>(key: string): Promise<T | null> {
    if (!this.client) return null;
    try {
      const value = await this.client.get(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch (err) {
      this.logger.warn(`Cache get failed (${key}): ${(err as Error).message}`);
      return null;
    }
  }

  async setJson(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (err) {
      this.logger.warn(`Cache set failed (${key}): ${(err as Error).message}`);
    }
  }

  /** Atomically increment a counter, setting a TTL on first increment. Returns the
   *  new value (0 when Redis is unavailable — callers treat that as "no limit"). */
  async incr(key: string, ttlSeconds: number): Promise<number> {
    if (!this.client) return 0;
    try {
      const n = await this.client.incr(key);
      if (n === 1) await this.client.expire(key, ttlSeconds);
      return n;
    } catch (err) {
      this.logger.warn(`Cache incr failed (${key}): ${(err as Error).message}`);
      return 0;
    }
  }

  /** Read an integer counter (0 if absent / Redis unavailable). */
  async getInt(key: string): Promise<number> {
    if (!this.client) return 0;
    try {
      const v = await this.client.get(key);
      return v ? parseInt(v, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client?.quit();
  }
}

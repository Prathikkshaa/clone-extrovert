// redis.util — parse a redis(s):// URL into BullMQ/ioredis connection options.
//
// WHY: both the API (queue producer) and the worker (queue consumer) need the same
// connection shape. Defining it once here keeps the two in sync. Passing options
// (not a shared client) lets BullMQ use its own bundled ioredis, avoiding
// cross-copy instance/type conflicts (see File 06 notes).

export interface RedisConnectionOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  tls?: Record<string, unknown>;
  maxRetriesPerRequest: null;
}

/** Build BullMQ connection options from a redis(s):// URL. */
export function buildRedisConnection(redisUrl: string): RedisConnectionOptions {
  const u = new URL(redisUrl);
  return {
    host: u.hostname,
    port: Number(u.port || 6379),
    username: u.username ? decodeURIComponent(u.username) : undefined,
    password: u.password ? decodeURIComponent(u.password) : undefined,
    tls: u.protocol === 'rediss:' ? {} : undefined,
    maxRetriesPerRequest: null, // required by BullMQ blocking connections
  };
}

/**
 * Next.js config — ExtrovertAI marketing site.
 *
 * RSC-first, static-generation-friendly. `transpilePackages` lets Next compile the
 * monorepo's `@extrovertai/shared` (CommonJS) source cleanly. No experimental flags;
 * we lean on App Router defaults (static by default when a route has no dynamic data).
 */
import path from 'node:path';

// Security headers applied to every route. Not a direct ranking factor, but the
// expected production baseline for a marketing site (and a crawl/trust signal).
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@extrovertai/shared'],
  // Monorepo root: this app is installed from the repo root (one lockfile there).
  // Pinning the tracing root silences the multi-lockfile warning and keeps Next
  // from tracing the wrong workspace root into the serverless output.
  outputFileTracingRoot: path.join(import.meta.dirname, '../../'),
  // Images: below-the-fold assets lazy-load by default via next/image (wired in M02+).
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;

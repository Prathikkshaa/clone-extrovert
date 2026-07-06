/**
 * Next.js config — ExtrovertAI marketing site.
 *
 * RSC-first, static-generation-friendly. `transpilePackages` lets Next compile the
 * monorepo's `@extrovertai/shared` (CommonJS) source cleanly. No experimental flags;
 * we lean on App Router defaults (static by default when a route has no dynamic data).
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@extrovertai/shared'],
  // Images: below-the-fold assets lazy-load by default via next/image (wired in M02+).
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

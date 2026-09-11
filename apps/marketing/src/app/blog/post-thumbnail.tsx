import type { BlogPost } from './posts';

/**
 * Deterministic themed SVG thumbnail per post. Category-tinted, slug-hashed
 * geometry. Serves two audit findings at once:
 *   - Image SEO: content images with real title/desc metadata for crawlers.
 *   - Accessibility: inline SVG carries <title> and <desc>, so screen readers
 *     announce it as a labeled figure.
 *
 * Rendered inline (no HTTP request, no CLS). Kept small enough to inline in
 * card grids without hurting LCP.
 */

const CATEGORY_ACCENT: Record<string, { bg: string; ink: string; accent: string; accentStrong: string }> = {
  'Buying signals':      { bg: '#F0F5F4', ink: '#0B2422', accent: '#0F766E', accentStrong: '#0B5D56' },
  'Local prospecting':   { bg: '#EFF4F3', ink: '#0B2422', accent: '#0F766E', accentStrong: '#0B5D56' },
  Prospecting:           { bg: '#F0F4F3', ink: '#0B2422', accent: '#0B5D56', accentStrong: '#083F3B' },
  Verticals:             { bg: '#F1F3F2', ink: '#26312F', accent: '#5F7A78', accentStrong: '#3E5251' },
  'Cold email':          { bg: '#EFF3F2', ink: '#0B2422', accent: '#0B5D56', accentStrong: '#083F3B' },
  Deliverability:        { bg: '#F1F3F2', ink: '#26312F', accent: '#5F7A78', accentStrong: '#3E5251' },
  Compliance:            { bg: '#F1F3F2', ink: '#26312F', accent: '#5F7A78', accentStrong: '#3E5251' },
  'AI SDR':              { bg: '#EFF3F2', ink: '#0B2422', accent: '#0B5D56', accentStrong: '#083F3B' },
  Comparison:            { bg: '#F0F5F4', ink: '#0B2422', accent: '#0F766E', accentStrong: '#0B5D56' },
};

const DEFAULT_THEME = CATEGORY_ACCENT['Buying signals'];

// Small, stable hash so different slugs yield distinct geometry.
function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type Props = { post: BlogPost; className?: string; sizes?: string; ariaHidden?: boolean };

export function PostThumbnail({ post, className, ariaHidden }: Props) {
  const theme = CATEGORY_ACCENT[post.category] ?? DEFAULT_THEME;
  const h = hashSlug(post.slug);
  // Deterministic parameters. All bounded so no card looks broken.
  const angle = (h % 360);
  const cx = 30 + (h % 40);           // 30..70
  const cy = 30 + ((h >> 3) % 40);    // 30..70
  const circleR = 22 + ((h >> 5) % 18);// 22..40
  const barsCount = 3 + (h % 4);      // 3..6
  const geomKind = h % 4;             // 0..3 -> different geometries

  const title = `${post.category} — ${post.title}`;
  const desc = post.excerpt ?? post.description ?? `${post.category} playbook on ${post.title.toLowerCase()}.`;

  return (
    <svg
      viewBox="0 0 200 120"
      role={ariaHidden ? 'presentation' : 'img'}
      aria-hidden={ariaHidden}
      {...(!ariaHidden ? { 'aria-labelledby': `thumb-${post.slug}-t thumb-${post.slug}-d` } : {})}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {!ariaHidden ? (
        <>
          <title id={`thumb-${post.slug}-t`}>{title}</title>
          <desc id={`thumb-${post.slug}-d`}>{desc}</desc>
        </>
      ) : null}
      <rect width="200" height="120" fill={theme.bg} />
      {geomKind === 0 ? (
        // Concentric arcs
        <g stroke={theme.accent} strokeWidth="1" fill="none" opacity="0.7">
          {[0.4, 0.6, 0.8, 1].map((s) => (
            <circle key={s} cx={cx * 2} cy={cy * 1.2} r={circleR * s} />
          ))}
        </g>
      ) : geomKind === 1 ? (
        // Signal bars
        <g fill={theme.accent} opacity="0.8">
          {Array.from({ length: barsCount }).map((_, i) => {
            const bw = 10;
            const gap = 6;
            const total = barsCount * bw + (barsCount - 1) * gap;
            const startX = (200 - total) / 2;
            const bh = 20 + ((h >> (i + 1)) % 60);
            return (
              <rect
                key={i}
                x={startX + i * (bw + gap)}
                y={110 - bh}
                width={bw}
                height={bh}
                rx="2"
              />
            );
          })}
        </g>
      ) : geomKind === 2 ? (
        // Radial burst (rotated ticks)
        <g stroke={theme.accent} strokeWidth="1.5" opacity="0.8" transform={`rotate(${angle % 30} 100 60)`}>
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI * 2) / 12;
            const x1 = 100 + Math.cos(a) * 20;
            const y1 = 60 + Math.sin(a) * 20;
            const x2 = 100 + Math.cos(a) * 42;
            const y2 = 60 + Math.sin(a) * 42;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeLinecap="round" />;
          })}
          <circle cx="100" cy="60" r="10" fill={theme.accent} opacity="0.9" />
        </g>
      ) : (
        // Grid + emphasis dot
        <g>
          <g stroke={theme.accent} strokeWidth="0.5" opacity="0.35">
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1="20" x2="180" y1={20 + i * 20} y2={20 + i * 20} />
            ))}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} y1="20" y2="100" x1={20 + i * 20} x2={20 + i * 20} />
            ))}
          </g>
          <circle
            cx={20 + ((h >> 2) % 8) * 20}
            cy={20 + ((h >> 6) % 4) * 20}
            r="5"
            fill={theme.accentStrong}
          />
          <circle
            cx={20 + ((h >> 10) % 8) * 20}
            cy={20 + ((h >> 14) % 4) * 20}
            r="3"
            fill={theme.accent}
          />
        </g>
      )}
      {/* Category ribbon */}
      <text
        x="12"
        y="112"
        fontFamily="'IBM Plex Mono', ui-monospace, monospace"
        fontSize="7"
        letterSpacing="1.2"
        fill={theme.accentStrong}
        opacity="0.85"
      >
        {post.category.toUpperCase()}
      </text>
    </svg>
  );
}

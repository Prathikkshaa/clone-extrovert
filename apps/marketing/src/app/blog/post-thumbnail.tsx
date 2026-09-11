import type { BlogPost } from './posts';

/**
 * Content-aware SVG thumbnail per post. Reads `category` (and lightly, `tags`)
 * to pick a mockup template and populate real labels — badge stacks for
 * deliverability, email mockup for cold email, side-by-side for comparison,
 * defect list for verticals, signal ladder for buying signals, capability
 * matrix for AI SDR, anti-features grid for positioning.
 *
 * Inline SVG — no HTTP request, real <title>/<desc> for image SEO + a11y.
 * Deterministic slug-hash chooses ONE emphasized item per template so no
 * two posts read identical.
 */

type Props = { post: BlogPost; className?: string; ariaHidden?: boolean };

const THEMES: Record<string, { bg: string; ink: string; muted: string; accent: string; accentStrong: string; card: string; line: string }> = {
  primary: { bg: '#F0F5F4', ink: '#0B2422', muted: '#5B6D6B', accent: '#0F766E', accentStrong: '#0B5D56', card: '#FFFFFF', line: '#D6E1DF' },
  secondary: { bg: '#F1F3F2', ink: '#1E2A28', muted: '#5F7A78', accent: '#5F7A78', accentStrong: '#3E5251', card: '#FFFFFF', line: '#D8DEDD' },
  bold: { bg: '#EAF2F1', ink: '#0B2422', muted: '#4E625F', accent: '#0B5D56', accentStrong: '#083F3B', card: '#FFFFFF', line: '#CADAD8' },
};

const CATEGORY_THEME: Record<string, keyof typeof THEMES> = {
  'Buying signals': 'primary',
  'Local prospecting': 'primary',
  Prospecting: 'primary',
  Verticals: 'secondary',
  'Cold email': 'bold',
  Deliverability: 'secondary',
  Compliance: 'secondary',
  'AI SDR': 'bold',
  Comparison: 'primary',
  Positioning: 'bold',
};

function hashSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i += 1) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pickCategory(post: BlogPost): 'deliverability' | 'coldEmail' | 'comparison' | 'verticals' | 'signals' | 'aiSdr' | 'positioning' | 'prospecting' {
  const c = post.category;
  if (c === 'Deliverability' || c === 'Compliance') return 'deliverability';
  if (c === 'Cold email') return 'coldEmail';
  if (c === 'Comparison') return 'comparison';
  if (c === 'Verticals') return 'verticals';
  if (c === 'Buying signals') return 'signals';
  if (c === 'AI SDR') return 'aiSdr';
  if (c === 'Positioning') return 'positioning';
  return 'prospecting';
}

/* ─────── Sub-templates (each returns SVG children within a 240x144 viewBox) ─────── */

function BadgeStack({ theme, hash, tags }: { theme: typeof THEMES['primary']; hash: number; tags: string[] }) {
  // Deliverability / Compliance — stack of protocol badges + a "sent" pill.
  const badges = ['SPF', 'DKIM', 'DMARC', 'TLS'];
  if (tags.some((t) => /can-spam|gdpr|legal/i.test(t))) badges.splice(0, 4, 'CAN-SPAM', 'GDPR', 'CCPA');
  const emphasize = hash % badges.length;
  return (
    <>
      <rect x="18" y="20" width="140" height="104" rx="8" fill={theme.card} stroke={theme.line} strokeWidth="1" />
      {badges.slice(0, 4).map((b, i) => (
        <g key={b}>
          <rect
            x="30"
            y={32 + i * 22}
            width="116"
            height="16"
            rx="4"
            fill={i === emphasize ? theme.accent : theme.card}
            stroke={theme.line}
          />
          <text
            x="40"
            y={44 + i * 22}
            fontFamily="'IBM Plex Mono', ui-monospace, monospace"
            fontSize="8"
            fill={i === emphasize ? '#FFFFFF' : theme.ink}
          >
            {b}
          </text>
          <circle cx="140" cy={40 + i * 22} r="2.5" fill={i === emphasize ? '#FFFFFF' : theme.accent} />
        </g>
      ))}
      <rect x="176" y="46" width="50" height="20" rx="10" fill={theme.accentStrong} />
      <text x="184" y="59" fontFamily="'IBM Plex Sans', system-ui" fontSize="8" fontWeight="600" fill="#FFFFFF">
        Delivered
      </text>
      <text x="176" y="86" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="6" fill={theme.muted}>
        200/day cap
      </text>
      <text x="176" y="98" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="6" fill={theme.muted}>
        &lt; 0.3% spam
      </text>
    </>
  );
}

function EmailMockup({ theme, hash }: { theme: typeof THEMES['primary']; hash: number }) {
  // Cold email — envelope-shaped mockup with subject/body/CTA.
  const openers = [
    'Noticed your LCP is 4.2s on mobile',
    'Saw the permit filed on Congress St',
    'Your GBP is missing an emergency line',
    'You rank #3, competitor #1 has schema',
  ];
  const subject = openers[hash % openers.length];
  return (
    <>
      <rect x="20" y="16" width="200" height="112" rx="6" fill={theme.card} stroke={theme.line} />
      <rect x="20" y="16" width="200" height="18" fill={theme.accent} rx="6" />
      <rect x="20" y="28" width="200" height="6" fill={theme.accent} />
      <text x="28" y="28" fontFamily="'IBM Plex Sans', system-ui" fontSize="8" fontWeight="600" fill="#FFFFFF">
        Draft · from your inbox
      </text>
      <text x="30" y="52" fontFamily="'IBM Plex Sans', system-ui" fontSize="9" fontWeight="600" fill={theme.ink}>
        {subject.length > 34 ? subject.slice(0, 32) + '…' : subject}
      </text>
      <rect x="30" y="60" width="180" height="4" rx="2" fill={theme.line} />
      <rect x="30" y="70" width="150" height="4" rx="2" fill={theme.line} />
      <rect x="30" y="80" width="170" height="4" rx="2" fill={theme.line} />
      <rect x="30" y="90" width="90" height="4" rx="2" fill={theme.line} />
      <rect x="30" y="106" width="70" height="16" rx="4" fill={theme.accent} />
      <text x="42" y="117" fontFamily="'IBM Plex Sans', system-ui" fontSize="8" fontWeight="600" fill="#FFFFFF">
        15-min chat?
      </text>
    </>
  );
}

function CompareSideBySide({ theme, hash, post }: { theme: typeof THEMES['primary']; hash: number; post: BlogPost }) {
  // Comparison — two columns with the compared entities.
  const t = post.title.toLowerCase();
  const leftRight =
    t.includes('clay') ? ['Milo', 'Clay'] :
    t.includes('apollo') ? ['Milo', 'Apollo'] :
    t.includes('database') ? ['Signals', 'Databases'] :
    t.includes('scraping') ? ['Places API', 'Scraping'] :
    t.includes('manual') ? ['Manual', 'Automated'] :
    ['Milo', 'Alternative'];
  return (
    <>
      <rect x="20" y="20" width="90" height="104" rx="8" fill={theme.accent} />
      <text x="30" y="40" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="7" fill="rgba(255,255,255,0.8)">
        RECOMMENDED
      </text>
      <text x="30" y="58" fontFamily="'IBM Plex Sans', system-ui" fontSize="14" fontWeight="600" fill="#FFFFFF">
        {leftRight[0]}
      </text>
      {['Signal-first', 'PAYG credits', 'Own inbox'].map((row, i) => (
        <g key={row}>
          <circle cx="30" cy={78 + i * 14} r="2" fill="#FFFFFF" opacity="0.9" />
          <text x="36" y={81 + i * 14} fontFamily="'IBM Plex Sans', system-ui" fontSize="8" fill="rgba(255,255,255,0.9)">
            {row}
          </text>
        </g>
      ))}
      <rect x="118" y="20" width="102" height="104" rx="8" fill={theme.card} stroke={theme.line} />
      <text x="128" y="40" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="7" fill={theme.muted}>
        ALTERNATIVE
      </text>
      <text x="128" y="58" fontFamily="'IBM Plex Sans', system-ui" fontSize="14" fontWeight="600" fill={theme.ink}>
        {leftRight[1]}
      </text>
      {['Database-first', 'Per seat', 'BYO sender'].map((row, i) => (
        <g key={row}>
          <circle cx="128" cy={78 + i * 14} r="2" fill={theme.muted} />
          <text x="134" y={81 + i * 14} fontFamily="'IBM Plex Sans', system-ui" fontSize="8" fill={theme.ink}>
            {row}
          </text>
        </g>
      ))}
    </>
  );
}

function DefectList({ theme, hash, post }: { theme: typeof THEMES['primary']; hash: number; post: BlogPost }) {
  // Verticals — bulleted defect rows the operator can act on.
  const t = post.title.toLowerCase();
  const defects =
    t.includes('roof') ? ['No storm-response page', 'Weak GBP reviews', 'No financing partner'] :
    t.includes('hvac') ? ['Missing 25C credit page', 'No emergency line', 'Permit velocity high'] :
    t.includes('plumb') ? ['No burst-pipe page', 'Slow LCP', 'Service area gaps'] :
    t.includes('dental') ? ['New hygienist hired', 'GBP photos stale', 'No booking widget'] :
    t.includes('legal') ? ['Avvo rating drift', 'Practice-area page 404', 'County docket spike'] :
    t.includes('med spa') || t.includes('med-spa') ? ['New device installed', 'Yelp category drift', 'Pre-summer window'] :
    t.includes('vet') ? ['DVM board hire', '24hr ER > 30 min', 'Review velocity drop'] :
    t.includes('seo') ? ['LCP 4.2s mobile', 'Missing schema', 'Thin content page'] :
    t.includes('web design') ? ['SSL missing', 'Facebook-only', 'One-page site'] :
    ['No website', 'Weak reviews', 'Missing schema'];
  const emphasize = hash % defects.length;
  return (
    <>
      <rect x="18" y="20" width="204" height="104" rx="8" fill={theme.card} stroke={theme.line} />
      <text x="28" y="36" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="7" fill={theme.muted}>
        DEFECTS FOUND
      </text>
      {defects.map((d, i) => (
        <g key={d}>
          <rect x="28" y={44 + i * 22} width="184" height="16" rx="4" fill={i === emphasize ? theme.accent : 'transparent'} />
          <circle cx="36" cy={52 + i * 22} r="3" fill={i === emphasize ? '#FFFFFF' : theme.accent} />
          <text
            x="44"
            y={56 + i * 22}
            fontFamily="'IBM Plex Sans', system-ui"
            fontSize="9"
            fill={i === emphasize ? '#FFFFFF' : theme.ink}
            fontWeight={i === emphasize ? '600' : '400'}
          >
            {d}
          </text>
        </g>
      ))}
    </>
  );
}

function SignalLadder({ theme, hash, post }: { theme: typeof THEMES['primary']; hash: number; post: BlogPost }) {
  // Buying signals / Local prospecting / Prospecting — signal cards with a scored top row.
  const t = post.title.toLowerCase();
  const rows =
    t.includes('local') || t.includes('map') ? ['New location opened', 'Permit filed', 'Weak reviews', 'No website'] :
    t.includes('taxonomy') ? ['Fit  3/3', 'Timing  2/3', 'Reach  3/3', '= 8/9'] :
    t.includes('high-intent') || t.includes('rubric') ? ['Score 9/9', 'Score 7/9', 'Score 5/9', 'Score 3/9'] :
    ['Hiring signal', 'Storm event', 'Weak reviews', 'No website'];
  const emphasize = 0; // top row always emphasized
  return (
    <>
      {rows.map((r, i) => (
        <g key={r}>
          <rect
            x="24"
            y={22 + i * 26}
            width={200 - i * 12}
            height="20"
            rx="4"
            fill={i === emphasize ? theme.accent : theme.card}
            stroke={i === emphasize ? theme.accentStrong : theme.line}
          />
          <text
            x="34"
            y={35 + i * 26}
            fontFamily="'IBM Plex Sans', system-ui"
            fontSize="9"
            fontWeight={i === emphasize ? '600' : '400'}
            fill={i === emphasize ? '#FFFFFF' : theme.ink}
          >
            {r}
          </text>
        </g>
      ))}
    </>
  );
}

function CapabilityMatrix({ theme, hash }: { theme: typeof THEMES['primary']; hash: number }) {
  // AI SDR — 2x2 capability matrix.
  const cells = [
    { label: 'Prospecting', mark: 'yes' },
    { label: 'Draft first line', mark: 'yes' },
    { label: 'Reply triage', mark: 'partial' },
    { label: 'Discovery call', mark: 'no' },
  ];
  return (
    <>
      {cells.map((c, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 24 + col * 100;
        const y = 24 + row * 50;
        const bg = c.mark === 'yes' ? theme.accent : c.mark === 'partial' ? theme.card : theme.card;
        const border = c.mark === 'yes' ? theme.accentStrong : theme.line;
        const fg = c.mark === 'yes' ? '#FFFFFF' : theme.ink;
        return (
          <g key={i}>
            <rect x={x} y={y} width="96" height="46" rx="6" fill={bg} stroke={border} />
            <text x={x + 8} y={y + 18} fontFamily="'IBM Plex Sans', system-ui" fontSize="9" fontWeight="600" fill={fg}>
              {c.label}
            </text>
            <text x={x + 8} y={y + 34} fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="7" fill={c.mark === 'yes' ? 'rgba(255,255,255,0.9)' : theme.muted}>
              {c.mark === 'yes' ? '✓  Reliable' : c.mark === 'partial' ? '~  Human review' : '✗  Not yet'}
            </text>
          </g>
        );
      })}
    </>
  );
}

function AntiFeatures({ theme, hash }: { theme: typeof THEMES['primary']; hash: number }) {
  // Positioning — "what Milo does not do" grid.
  const items = ['Contact DB', 'LinkedIn scrape', 'CRM sync', 'Cold call'];
  return (
    <>
      <text x="24" y="30" fontFamily="'IBM Plex Mono', ui-monospace, monospace" fontSize="7" fill={theme.muted}>
        NOT SHIPPING
      </text>
      {items.map((it, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = 24 + col * 100;
        const y = 40 + row * 40;
        return (
          <g key={it}>
            <rect x={x} y={y} width="96" height="32" rx="6" fill={theme.card} stroke={theme.line} strokeDasharray="3 2" />
            <line x1={x + 10} y1={y + 10} x2={x + 86} y2={y + 22} stroke={theme.muted} strokeWidth="1" />
            <text x={x + 10} y={y + 20} fontFamily="'IBM Plex Sans', system-ui" fontSize="9" fill={theme.muted} textDecoration="line-through">
              {it}
            </text>
          </g>
        );
      })}
    </>
  );
}

/* ─────── Main component ─────── */

export function PostThumbnail({ post, className, ariaHidden }: Props) {
  const themeKey = CATEGORY_THEME[post.category] ?? 'primary';
  const theme = THEMES[themeKey];
  const h = hashSlug(post.slug);
  const kind = pickCategory(post);

  const title = `${post.category} — ${post.title}`;
  const desc = post.excerpt ?? post.description ?? `${post.category} playbook on ${post.title.toLowerCase()}.`;
  const titleId = `t-${post.slug}`;
  const descId = `d-${post.slug}`;

  return (
    <svg
      viewBox="0 0 240 144"
      role={ariaHidden ? 'presentation' : 'img'}
      aria-hidden={ariaHidden}
      {...(!ariaHidden ? { 'aria-labelledby': `${titleId} ${descId}` } : {})}
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      {!ariaHidden ? (
        <>
          <title id={titleId}>{title}</title>
          <desc id={descId}>{desc}</desc>
        </>
      ) : null}
      <rect width="240" height="144" fill={theme.bg} />
      {kind === 'deliverability' ? <BadgeStack theme={theme} hash={h} tags={post.tags ?? []} /> :
       kind === 'coldEmail' ? <EmailMockup theme={theme} hash={h} /> :
       kind === 'comparison' ? <CompareSideBySide theme={theme} hash={h} post={post} /> :
       kind === 'verticals' ? <DefectList theme={theme} hash={h} post={post} /> :
       kind === 'aiSdr' ? <CapabilityMatrix theme={theme} hash={h} /> :
       kind === 'positioning' ? <AntiFeatures theme={theme} hash={h} /> :
       <SignalLadder theme={theme} hash={h} post={post} />}
      <text
        x="14"
        y="136"
        fontFamily="'IBM Plex Mono', ui-monospace, monospace"
        fontSize="7"
        letterSpacing="1"
        fill={theme.accentStrong}
        opacity="0.85"
      >
        {post.category.toUpperCase()}
      </text>
    </svg>
  );
}

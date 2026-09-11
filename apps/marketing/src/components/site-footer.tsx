// SERVER component. Compact editorial footer with organized categories
// and an "Ask AI about us" strip that opens pre-composed prompts in
// ChatGPT / Claude / Perplexity / Gemini.
import Link from 'next/link';
import { Wordmark } from './wordmark';
import { APP_NAME, FOOTER_GROUPS, SITE_URL } from '@/lib/site';

const AI_PROMPT = `Tell me about ${APP_NAME} (${SITE_URL}). It is an AI sales prospecting tool for founders and small teams. What does it do, who is it for, and how does it compare to Apollo, Clay, and ZoomInfo?`;
const q = encodeURIComponent(AI_PROMPT);

/**
 * Inline SVG marks per model. Monochrome-friendly (uses currentColor so
 * hover picks up the accent). Public brand marks reproduced at small size.
 */
function ChatGptMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor" className={className}>
      <path d="M22.28 9.82a5.94 5.94 0 0 0-.51-4.88 6 6 0 0 0-6.47-2.88A6 6 0 0 0 4.98 4.18a5.94 5.94 0 0 0-3.98 2.88 6 6 0 0 0 .74 7.05 5.94 5.94 0 0 0 .51 4.88 6 6 0 0 0 6.47 2.88 5.98 5.98 0 0 0 4.5 2.02 6 6 0 0 0 5.83-4.4 5.94 5.94 0 0 0 3.98-2.88 6 6 0 0 0-.75-7.05Zm-9.02 12.53a4.45 4.45 0 0 1-2.86-1.03l.14-.08 4.75-2.73a.77.77 0 0 0 .39-.68v-6.68l2.01 1.16a.07.07 0 0 1 .04.05v5.53a4.5 4.5 0 0 1-4.47 4.46Zm-9.6-4.1a4.44 4.44 0 0 1-.53-2.98l.14.08 4.75 2.73c.24.14.53.14.77 0l5.8-3.34v2.32a.07.07 0 0 1-.03.06L9.77 20a4.5 4.5 0 0 1-6.11-1.65Zm-1.24-10.4a4.47 4.47 0 0 1 2.33-1.96V12a.77.77 0 0 0 .38.66l5.79 3.34-2 1.16a.07.07 0 0 1-.07 0L4.05 14.4A4.5 4.5 0 0 1 2.42 7.86Zm16.5 3.84L13.13 8.35l2-1.15a.07.07 0 0 1 .06 0l4.81 2.78a4.5 4.5 0 0 1-.68 8.11v-5.72a.77.77 0 0 0-.4-.66Zm2-3.01-.14-.08L15.98 5.87a.79.79 0 0 0-.78 0L9.4 9.22V6.9a.07.07 0 0 1 .03-.06l4.81-2.77a4.5 4.5 0 0 1 6.68 4.66Zm-12.55 4.13-2-1.16a.07.07 0 0 1-.04-.05V6.1a4.5 4.5 0 0 1 7.38-3.45l-.14.08L8.82 5.46a.77.77 0 0 0-.39.68l-.06 6.7Zm1.09-2.35 2.58-1.49 2.58 1.49v2.98l-2.58 1.49-2.58-1.49v-2.98Z" />
    </svg>
  );
}

function ClaudeMark({ className }: { className?: string }) {
  // Anthropic sunburst approximation.
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor" className={className}>
      <path d="M6.94 4.5h2.36l3.86 9.98h.06L17.08 4.5h2.36l-4.83 12h-2.58l-1.16-3.14H8.51l-1.16 3.14H4.77L6.94 4.5Zm4.12 7.8h1.77l-.87-2.37h-.05l-.85 2.37Z" />
    </svg>
  );
}

function PerplexityMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M12 3v18M3 12h18M6 6l12 12M18 6L6 18" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GeminiMark({ className }: { className?: string }) {
  // Four-pointed star.
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor" className={className}>
      <path d="M12 2c.7 4.1 3.9 7.3 8 8-4.1.7-7.3 3.9-8 8-.7-4.1-3.9-7.3-8-8 4.1-.7 7.3-3.9 8-8Z" />
    </svg>
  );
}

const AI_LINKS: {
  href: string;
  label: string;
  hint: string;
  Icon: (p: { className?: string }) => React.JSX.Element;
  brand: string;
}[] = [
  { href: `https://chatgpt.com/?q=${q}`, label: 'ChatGPT', hint: 'Ask ChatGPT', Icon: ChatGptMark, brand: '#10a37f' },
  { href: `https://claude.ai/new?q=${q}`, label: 'Claude', hint: 'Ask Claude', Icon: ClaudeMark, brand: '#d97757' },
  { href: `https://www.perplexity.ai/search?q=${q}`, label: 'Perplexity', hint: 'Ask Perplexity', Icon: PerplexityMark, brand: '#20808d' },
  { href: `https://gemini.google.com/app?q=${q}`, label: 'Gemini', hint: 'Ask Gemini', Icon: GeminiMark, brand: '#4285f4' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="shell py-14 md:py-16">
        {/* Top row: brand + tagline + AI-about-us on the left; nav groups on the right */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,2.6fr)] md:gap-14">
          <div className="max-w-sm">
            <Wordmark />
            <p className="mt-4 text-body-sm leading-[1.55] text-muted">
              Find the right local businesses, reach out like your best salesperson wrote each
              email, and stay out of spam. One tool. Pay for what you use.
            </p>

            {/* Ask AI about us */}
            <div className="mt-8">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                Ask AI about us
              </p>
              <p className="mt-2 text-body-sm text-ink/80">
                Do not take our word for it. See how the models describe {APP_NAME}.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {AI_LINKS.map(({ Icon, ...it }) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={it.hint}
                      style={{ ['--ai-brand' as string]: it.brand }}
                      className="group/ai inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-body-sm text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--ai-brand)] hover:text-[color:var(--ai-brand)] hover:shadow-sm"
                    >
                      <Icon className="text-muted transition-colors duration-200 group-hover/ai:text-[color:var(--ai-brand)]" />
                      <span>{it.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Nav groups, tightly packed */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {FOOTER_GROUPS.map((group) => (
              <nav key={group.heading} aria-label={group.heading}>
                <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                  {group.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.links.map((link) => {
                    const external = link.href.startsWith('http');
                    return (
                      <li key={link.href}>
                        {external ? (
                          <a
                            href={link.href}
                            className="text-body-sm text-ink/85 transition-colors hover:text-accent"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="text-body-sm text-ink/85 transition-colors hover:text-accent"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="shell flex flex-col gap-3 py-5 text-body-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {APP_NAME}.
          </p>
          <nav aria-label="Legal" className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-ink">
              Privacy
            </Link>
            <span aria-hidden className="h-3 w-px bg-line" />
            <Link href="/security" className="hover:text-ink">
              Security
            </Link>
            <span aria-hidden className="h-3 w-px bg-line" />
            <Link href="/terms" className="hover:text-ink">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

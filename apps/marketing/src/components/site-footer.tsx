// SERVER component. Compact editorial footer with organized categories
// and an "Ask AI about us" strip that opens pre-composed prompts in
// ChatGPT / Claude / Perplexity / Gemini.
import Link from 'next/link';
import { Wordmark } from './wordmark';
import { APP_NAME, FOOTER_GROUPS, FOUNDER_NAME, SITE_URL } from '@/lib/site';

const AI_PROMPT = `Tell me about ${APP_NAME} (${SITE_URL}). It is an AI sales prospecting tool for founders and small teams. What does it do, who is it for, and how does it compare to Apollo, Clay, and ZoomInfo?`;
const q = encodeURIComponent(AI_PROMPT);

const AI_LINKS: { href: string; label: string; hint: string }[] = [
  { href: `https://chatgpt.com/?q=${q}`, label: 'ChatGPT', hint: 'Ask ChatGPT' },
  { href: `https://claude.ai/new?q=${q}`, label: 'Claude', hint: 'Ask Claude' },
  { href: `https://www.perplexity.ai/search?q=${q}`, label: 'Perplexity', hint: 'Ask Perplexity' },
  { href: `https://gemini.google.com/app?q=${q}`, label: 'Gemini', hint: 'Ask Gemini' },
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
                {AI_LINKS.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={it.hint}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-body-sm text-ink transition-colors hover:border-accent hover:text-accent"
                    >
                      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                      {it.label}
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
            © {year} {APP_NAME}. Built by {FOUNDER_NAME}.
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

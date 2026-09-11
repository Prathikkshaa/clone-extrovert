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
// Brand SVG paths sourced from Simple Icons (CC0). All marks use currentColor
// so the hover state can swap to the brand tint via CSS.
function ChatGptMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor" className={className}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729Zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944Zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464ZM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872Zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667Zm2.0107-3.0231-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66ZM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813Zm1.0976-2.3654 2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function ClaudeMark({ className }: { className?: string }) {
  // Claude sunburst: 10 tapered rays radiating from a small core, matching
  // Anthropic's product mark.
  return (
    <svg viewBox="0 0 100 100" width="18" height="18" aria-hidden fill="currentColor" className={className}>
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse
          key={i}
          cx="50"
          cy="18"
          rx="5"
          ry="32"
          transform={`rotate(${i * 36} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="9" />
    </svg>
  );
}

function PerplexityMark({ className }: { className?: string }) {
  // Perplexity compass: four kite blades meeting at a central square, with the
  // cardinal + diagonal spokes running through the middle.
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      strokeLinecap="round"
      className={className}
    >
      {/* Top blade */}
      <path d="M12 2 L16 8 L12 12 L8 8 Z" />
      {/* Right blade */}
      <path d="M22 12 L16 16 L12 12 L16 8 Z" />
      {/* Bottom blade */}
      <path d="M12 22 L8 16 L12 12 L16 16 Z" />
      {/* Left blade */}
      <path d="M2 12 L8 8 L12 12 L8 16 Z" />
      {/* Central square */}
      <path d="M8 8 L16 8 L16 16 L8 16 Z" />
    </svg>
  );
}

function GeminiMark({ className }: { className?: string }) {
  // Gemini four-point sparkle (Simple Icons: googlegemini).
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="currentColor" className={className}>
      <path d="M12 24A14.304 14.304 0 0 0 0 12 14.304 14.304 0 0 0 12 0a14.305 14.305 0 0 0 12 12 14.305 14.305 0 0 0-12 12" />
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
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {AI_LINKS.map(({ Icon, ...it }) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={it.hint}
                      title={it.hint}
                      style={{ ['--ai-brand' as string]: it.brand }}
                      className="group/ai inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-muted transition-all duration-200 ease-soft hover:-translate-y-1 hover:border-[color:var(--ai-brand)] hover:bg-canvas hover:text-[color:var(--ai-brand)] hover:shadow-[0_6px_18px_-8px_rgba(0,0,0,0.18)]"
                    >
                      <Icon />
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

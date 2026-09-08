'use client';
// CLIENT ISLAND (M00 §4): the header condenses on scroll and owns the mobile menu
// (open/close state + scroll listener) - genuine interactivity. Kept minimal; all
// content/links come from server-side config (lib/site.ts).

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wordmark } from './wordmark';
import { CtaButton } from './cta-button';
import { NAV_LINKS, SIGNUP_URL } from '@/lib/site';

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Track scroll (for the hairline border) and whether the header currently
    // overlaps a `.on-dark` section - if so, the nav flips to light so it stays
    // readable, without ever painting a solid bar.
    const probe = 40; // ~vertical center of the header row (must land inside a
    // dark hero that starts flush under the sticky header)
    const update = () => {
      setScrolled(window.scrollY > 8);
      let dark = false;
      document.querySelectorAll('.on-dark').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) dark = true;
      });
      setOnDark(dark);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ease-soft',
        // A thin glass layer, tuned to the surface underneath. Over a `.on-dark`
        // section it is ALWAYS translucent glass (blur + faint white highlight +
        // soft elevation) so the nav never dissolves into the teal hero, yet the
        // background stays clearly perceptible (kept well below opaque). Over light
        // it is transparent at the top (already good) and light frosted once
        // scrolled. `supports-[backdrop-filter]` bumps opacity a touch where blur
        // is unavailable so text stays crisp. rgba is explicit (token alpha renders
        // transparent on this variable).
        onDark
          ? 'border-white/12 bg-[rgba(16,24,22,0.42)] shadow-[0_10px_30px_-22px_rgba(0,0,0,0.7)] backdrop-blur-md supports-[backdrop-filter]:bg-[rgba(16,24,22,0.34)]'
          : scrolled
            ? 'border-line bg-[rgba(245,245,241,0.72)] shadow-[0_10px_30px_-24px_rgba(26,26,24,0.22)] backdrop-blur-lg'
            : 'border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="shell flex items-center justify-between py-4">
        <Wordmark onDark={onDark} />

        {/* Right group: primary nav + CTA clustered on the right */}
        <div className="hidden items-center gap-8 md:flex">
          {/* Desktop nav */}
          <nav aria-label="Primary" className="flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={[
                    'text-body-sm transition-colors duration-200',
                    onDark
                      ? active
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                      : active
                        ? 'text-accent'
                        : 'text-muted hover:text-ink',
                  ].join(' ')}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Subtle divider between wayfinding links and the action */}
          <span
            className={['h-5 w-px transition-colors duration-300', onDark ? 'bg-white/25' : 'bg-line'].join(' ')}
            aria-hidden
          />

          <CtaButton href={SIGNUP_URL}>Start free</CtaButton>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className={[
            'inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-300 md:hidden',
            onDark ? 'text-white' : 'text-ink',
          ].join(' ')}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="relative block h-4 w-5" aria-hidden>
            <span
              className={[
                'absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ease-soft',
                menuOpen ? 'top-1.5 rotate-45' : 'top-0.5',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-opacity duration-200',
                menuOpen ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
            />
            <span
              className={[
                'absolute left-0 h-0.5 w-5 bg-current transition-all duration-300 ease-soft',
                menuOpen ? 'top-1.5 -rotate-45' : 'top-2.5',
              ].join(' ')}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-line bg-canvas md:hidden"
      >
        <nav aria-label="Mobile" className="shell flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'rounded-md px-2 py-3 text-body transition-colors',
                pathname === link.href ? 'bg-accent-soft text-accent' : 'text-ink hover:bg-accent-soft/60',
              ].join(' ')}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3">
            <CtaButton href={SIGNUP_URL} className="w-full">
              Start free
            </CtaButton>
          </div>
        </nav>
      </div>
    </header>
  );
}

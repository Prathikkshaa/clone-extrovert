'use client';
// CLIENT ISLAND — the ONE constrained depth/parallax touch (M00 §6). It wraps the
// server-rendered product panel (passed as children, so the visual paints without
// waiting on JS) and adds a subtle pointer-driven tilt + layered-depth parallax on
// desktop pointer devices ONLY.
//
// Hard constraints honored:
//  - Disabled on touch/coarse pointers and narrow viewports (mobile) → no tilt.
//  - Disabled under prefers-reduced-motion.
//  - Never blocks paint (children render server-side; this only adds transforms).
//  - Fully isolated + removable: delete this wrapper and render <ProductPanel/>
//    directly and nothing else breaks.
import { useRef, useEffect, type ReactNode } from 'react';

export function HeroVisual({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const wide = window.matchMedia('(min-width: 768px)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || !wide || reduced) return; // mobile / touch / reduced-motion → static

    const panel = wrap.querySelector<HTMLElement>('[data-parallax-panel]');
    const glow = wrap.querySelector<HTMLElement>('[data-parallax-glow]');
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (panel) {
          panel.style.transform = `perspective(1100px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateZ(0)`;
        }
        if (glow) {
          // Layered depth: the accent glow drifts opposite the tilt.
          glow.style.transform = `translate3d(${-px * 24}px, ${-py * 24}px, 0)`;
        }
      });
    };

    const reset = () => {
      cancelAnimationFrame(raf);
      if (panel) panel.style.transform = 'perspective(1100px) rotateY(0) rotateX(0)';
      if (glow) glow.style.transform = 'translate3d(0,0,0)';
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', reset);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative">
      {/* Layered accent glow behind the panel — quiet depth, not a floating blob. */}
      <div
        data-parallax-glow
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-accent-soft/70 blur-2xl transition-transform duration-300 ease-soft"
      />
      <div
        data-parallax-panel
        className="transition-transform duration-300 ease-soft will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}

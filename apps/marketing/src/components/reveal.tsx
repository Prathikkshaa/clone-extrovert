'use client';
// CLIENT ISLAND (M00 §4/§6): reveal needs GSAP + ScrollTrigger + the DOM, so it
// must run on the client. It is the ONE reusable scroll-reveal primitive every
// later section (M02/M03) composes - keep the client surface here, not in sections.

import { useRef, useEffect, type ElementType, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  /** Render element (default div). Use `ul`, `section`, etc. where semantic. */
  as?: ElementType;
  /** Stagger delay for this item within a group, in seconds. */
  delay?: number;
  /** Travel distance in px (subtle by default). */
  y?: number;
  className?: string;
};

/**
 * Fades + translates its children in as they enter the viewport - fast, subtle,
 * staggerable (M00 §6: reveals, not scroll-jacking; 150–400ms). Honors
 * `prefers-reduced-motion` (content shows immediately, no transform). The initial
 * hidden state is set in CSS (`.reveal-init`) so there is no flash before hydration
 * AND reduced-motion users never see a hidden element.
 */
export function Reveal({ children, as, delay = 0, y = 16, className }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const Tag = (as ?? 'div') as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.remove('reveal-init');
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
        onStart: () => el.classList.remove('reveal-init'),
      });
      // Seed the from-state to match .reveal-init so GSAP animates cleanly.
      gsap.set(el, { y });
    });

    return () => ctx.revert();
  }, [delay, y]);

  return (
    <Tag ref={ref} className={['reveal-init', className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
}

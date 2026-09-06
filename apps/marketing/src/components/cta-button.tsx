// SERVER component - a plain styled link, no interactivity. The single primary
// action ("Start free") + a quiet secondary variant (M00 §11). Token-driven; the
// accent does real work here and (almost) nowhere else.
import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium ' +
  'transition-colors duration-200 ease-soft focus-visible:outline-none ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const sizes = {
  sm: 'h-9 px-3.5 text-body-sm',
  md: 'h-11 px-5 text-body',
  lg: 'h-12 px-7 text-body-lg',
} as const;

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-strong',
  secondary: 'border border-line bg-surface text-ink hover:border-accent hover:text-accent',
  ghost: 'text-ink/80 hover:text-accent',
};

export function CtaButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: keyof typeof sizes;
  className?: string;
}) {
  const cls = [base, sizes[size], variants[variant], className].filter(Boolean).join(' ');
  // External (product app) links + mailto get a plain anchor; internal use Next Link.
  const isExternal = /^(https?:|mailto:)/.test(href);
  if (isExternal) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

// The friction-reducing line under primary CTAs, rendered on two lines. The copy
// stays single-sourced in CTA_MICROCOPY (lib/site.ts); we split on the middot so
// there's still one place to edit the words.
import { CTA_MICROCOPY } from '@/lib/site';

const LINES = CTA_MICROCOPY.split(' · ');

export function CtaMicrocopy({ className }: { className?: string }) {
  return (
    <p className={['text-body-sm leading-snug text-muted', className].filter(Boolean).join(' ')}>
      {LINES.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

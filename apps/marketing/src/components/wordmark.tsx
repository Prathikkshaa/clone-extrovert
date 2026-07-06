// SERVER component — the wordmark. Name comes from APP_NAME (shared), never
// hardcoded (M00 §4). A restrained mark: the name in the heading face with a
// single accent dot doing quiet brand work — no logo image needed yet.
import Link from 'next/link';
import { APP_NAME } from '@/lib/site';

export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${APP_NAME} home`}
      className={['group inline-flex items-baseline gap-0.5', className].filter(Boolean).join(' ')}
    >
      <span className="font-heading text-[1.15rem] font-medium tracking-tight text-ink">
        {APP_NAME}
      </span>
      <span
        aria-hidden
        className="mb-0.5 h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-200 ease-soft group-hover:scale-125"
      />
    </Link>
  );
}

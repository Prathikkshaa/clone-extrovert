// SERVER component - the founder's note. The trust anchor while there are no users
// yet (M00 §7): a genuine, understated, human message - NOT fake testimonials.
// Beneath it, a clearly-labeled + empty slot for real proof (testimonials/results/
// logos) to drop in later. NO invented quotes, counts, or logos anywhere.
//
// Copy is DIRECTION - the founder finalizes the words + name (see FOUNDER_NAME).
import { Reveal } from '@/components/reveal';
import { FOUNDER_NAME } from '@/lib/site';

export function FounderNote() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="shell py-section-y">
        <Reveal className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">Why I built this</p>
          <div className="mt-4 space-y-4 text-body-lg text-ink/90">
            <p>
              I had this exact problem - an empty pipeline and no time - and every tool I tried
              was overpriced, spammy, or five subscriptions wired together. So I built the one I
              wanted: find the right businesses, write like me, send without landing in spam.
            </p>
            <p>
              It&rsquo;s early, and I&rsquo;m building it in the open. If something&rsquo;s off, tell me - I
              read every message.
            </p>
          </div>
          <p className="mt-5 text-body font-medium text-ink">- {FOUNDER_NAME}</p>

          {/* Real-proof slot - intentionally EMPTY + labeled. Fill when it exists. */}
          {/* SWAP-SLOT(M00 §7): testimonials / results / logos go here once real.
              Do not add fabricated proof. */}
        </Reveal>
      </div>
    </section>
  );
}

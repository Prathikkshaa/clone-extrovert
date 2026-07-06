// SERVER component — the founder's note. The trust anchor while there are no users
// yet (M00 §7): a genuine, understated, human message — NOT fake testimonials.
// Real photo is a labeled placeholder. Beneath it, a clearly-labeled + empty slot
// for real proof (testimonials/results/logos) to drop in later. NO invented
// quotes, counts, or logos anywhere.
//
// Copy is DIRECTION — the founder finalizes the words + name (see FOUNDER_NAME).
import { Reveal } from '@/components/reveal';
import { FOUNDER_NAME } from '@/lib/site';

export function FounderNote() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="shell grid gap-10 py-section-y md:grid-cols-[auto_1fr] md:gap-14">
        {/* Photo placeholder — clearly labeled (M00 §13). Swap for a real photo. */}
        <Reveal className="shrink-0">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-line bg-canvas text-center text-[0.72rem] leading-tight text-muted md:h-36 md:w-36">
            Founder
            <br />
            photo
          </div>
        </Reveal>

        <Reveal delay={0.05} className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">Why I built this</p>
          <div className="mt-4 space-y-4 text-body-lg text-ink/90">
            <p>
              I had this exact problem: an empty pipeline and no time to do outreach the right
              way. The tools I tried were either overpriced, spat out obvious spam, or needed
              five subscriptions and a weekend to wire together.
            </p>
            <p>
              So I built the thing I wanted — one place to find the right businesses, write
              outreach that actually sounds like me, and send it without landing in spam. It&rsquo;s
              early, and I&rsquo;m building it in the open. If you try it and something&rsquo;s off, tell
              me — I read every message.
            </p>
          </div>
          <p className="mt-5 text-body font-medium text-ink">— {FOUNDER_NAME}</p>

          {/* Real-proof slot — intentionally EMPTY + labeled. Fill when it exists. */}
          {/* SWAP-SLOT(M00 §7): testimonials / results / logos go here once real.
              Do not add fabricated proof. */}
        </Reveal>
      </div>
    </section>
  );
}

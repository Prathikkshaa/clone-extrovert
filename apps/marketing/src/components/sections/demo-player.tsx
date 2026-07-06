'use client';
// CLIENT ISLAND — the demo video player. Implements autoplay-silent-video
// correctly (M00 §4/§13): muted + loop + autoPlay + playsInline, a poster for
// instant paint, preload="none" so it never blocks LCP. Degrades gracefully:
//  - Under prefers-reduced-motion → no autoplay; shows the static fallback panel.
//  - If the video source is missing/unplayable → onError swaps to the fallback.
// Either way the on-screen captions carry the meaning (the video is silent).
import { useEffect, useRef, useState } from 'react';
import { ProductPanel } from '@/components/product-panel';

const CAPTIONS = ['Type a city', 'Leads appear', 'The email writes itself', 'A meeting books'];

export function DemoPlayer({ videoSrc, poster }: { videoSrc: string; poster: string }) {
  // Start in fallback until we confirm motion is allowed — avoids a flash of an
  // autoplaying video for reduced-motion users (decided on the client after mount).
  const [useVideo, setUseVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setUseVideo(!reduced);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
      <div className="relative aspect-video w-full">
        {useVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={poster}
            muted
            loop
            autoPlay
            playsInline
            preload="none"
            aria-label="Silent product demo: searching a city, leads appearing, an email drafting itself, and a meeting booking"
            onError={() => setUseVideo(false)}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          // Static fallback — the poster image + a representative product panel so
          // the section never looks empty when video can't/shouldn't play.
          <div className="absolute inset-0 flex items-center justify-center bg-[#17201f] p-6">
            <ProductPanel className="max-w-md" />
          </div>
        )}

        {/* Caption strip — carries the meaning since the video is silent. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/55 to-transparent p-4">
          {CAPTIONS.map((c, i) => (
            <span
              key={c}
              className="rounded-full bg-white/10 px-3 py-1 text-body-sm text-white backdrop-blur-sm"
            >
              <span className="mr-1.5 text-white/60">{i + 1}</span>
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

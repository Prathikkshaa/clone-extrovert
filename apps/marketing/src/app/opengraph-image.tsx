// OG / social image — generated at build via next/og (a real 1200×630 PNG, not a
// placeholder file). Applies to every route (root convention) and Twitter falls
// back to it via the summary_large_image card. On-brand: warm canvas, ink, the
// single teal accent + wordmark dot. (M04 §1)
//
// NOTE: this is the on-brand system-generated OG. Swap for a richer designed image
// only if desired (swap-list) — it is NOT a launch blocker.
import { ImageResponse } from 'next/og';
import { APP_NAME, SITE_DESCRIPTION } from '@/lib/site';

export const alt = `${APP_NAME} — book more meetings without learning to sell`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#fafaf8',
          color: '#1a1a18',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 600 }}>
          {APP_NAME}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundColor: '#0f766e',
              marginLeft: 6,
              marginTop: 18,
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 980 }}>
            Find the right businesses, email them like a pro, and book meetings.
          </div>
          <div style={{ fontSize: 30, color: '#6b6b66', marginTop: 28, maxWidth: 900 }}>
            {SITE_DESCRIPTION}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 26, color: '#0f766e', fontWeight: 600 }}>
          Start free · No card needed
        </div>
      </div>
    ),
    { ...size },
  );
}

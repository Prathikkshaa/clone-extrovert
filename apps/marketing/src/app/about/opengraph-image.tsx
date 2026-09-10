import { ImageResponse } from 'next/og';
import { APP_NAME } from '@/lib/site';

export const alt = `About ${APP_NAME}`;
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
          <div style={{ marginLeft: 24, color: '#6b6b66', fontSize: 26, fontWeight: 500 }}>
            About
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 1000 }}>
            Small teams need clients, not another sales stack.
          </div>
          <div style={{ fontSize: 28, color: '#6b6b66', marginTop: 28, maxWidth: 900 }}>
            Built by a small team in India. One honest tool, pay-as-you-go.
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

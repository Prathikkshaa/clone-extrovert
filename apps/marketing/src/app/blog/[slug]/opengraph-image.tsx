import { ImageResponse } from 'next/og';
import { APP_NAME } from '@/lib/site';
import { BLOG_POSTS, getPost } from '../posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const alt = 'Milo blog post';

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

const CATEGORY_ACCENT: Record<string, string> = {
  'Buying signals': '#0F766E',
  'Local prospecting': '#0F766E',
  Prospecting: '#0B5D56',
  Verticals: '#5F7A78',
  'Cold email': '#0B5D56',
  Deliverability: '#5F7A78',
  Compliance: '#5F7A78',
  'AI SDR': '#0B5D56',
  Comparison: '#0F766E',
};

export default async function BlogOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? 'Milo blog';
  const category = post?.category ?? 'Blog';
  const accent = CATEGORY_ACCENT[category] ?? '#0F766E';

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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 40, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            {APP_NAME}
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 9999,
                backgroundColor: accent,
                marginLeft: 6,
                marginTop: 18,
              }}
            />
          </div>
          <div
            style={{
              marginLeft: 24,
              color: '#6b6b66',
              fontSize: 24,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {category}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: title.length > 90 ? 52 : 64,
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: 1040,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 24,
            color: accent,
            fontWeight: 600,
          }}
        >
          {APP_NAME}.com/blog
        </div>
      </div>
    ),
    { ...size },
  );
}

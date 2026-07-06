# Demo asset placeholders (swap before launch — M00 §13)

The demo centerpiece expects two assets that DO NOT ship yet (placeholders in use):

- `product-demo.mp4` — the autoplay **silent, looping** product walkthrough
  (type a city → leads appear → email writes itself → meeting books). ~15–25s,
  small file, H.264/MP4 (add a `.webm` too for smaller size if desired).
- `poster.svg` — **present as a placeholder**; replace with a real first-frame
  poster (`poster.jpg`/`.webp`) when the video exists, and update the `poster`
  prop in `src/components/sections/demo.tsx`.

Until `product-demo.mp4` exists, `DemoPlayer` gracefully shows the poster +
a static product panel fallback + on-screen captions (nothing looks broken).
Drop the real file in at this path and it plays automatically.

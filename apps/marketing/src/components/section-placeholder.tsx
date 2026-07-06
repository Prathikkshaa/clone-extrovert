// SERVER component — a clearly-labeled slot for content arriving in a later
// marketing file (M02/M03). Keeps the structure navigable + verifiable now while
// never shipping fake content. Styled with the shell so the empty page still
// reads as intentional (M01 goal).
import { Reveal } from './reveal';

export function SectionPlaceholder({
  file,
  title,
  note,
}: {
  file: string;
  title: string;
  note?: string;
}) {
  return (
    <Reveal
      as="section"
      className="shell my-10 rounded-lg border border-dashed border-line bg-surface/40 px-6 py-12"
    >
      <p className="text-eyebrow uppercase text-accent">Coming in {file}</p>
      <h2 className="mt-3 text-heading-lg text-ink">{title}</h2>
      {note ? <p className="mt-3 max-w-prose text-body text-muted">{note}</p> : null}
    </Reveal>
  );
}

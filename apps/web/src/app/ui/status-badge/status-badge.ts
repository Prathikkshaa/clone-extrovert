// ui-status-badge — the pill for lead/message/health states (File 16 §7).
// WHY: state pills were drawn ad-hoc per screen with inconsistent colour mapping.
// This maps every known status to ONE semantic tone (green positive / amber
// pending / red error / neutral default) and renders a sentence-case label. Pass
// any status string; unknown values fall back to neutral with a tidied label.
import { Component, computed, input } from '@angular/core';

type Tone = 'positive' | 'warning' | 'danger' | 'neutral';

@Component({
  selector: 'ui-status-badge',
  template: `<span [class]="classes()">{{ label() }}</span>`,
  host: { class: 'inline-flex' },
})
export class StatusBadge {
  /** A lead/message/health status, e.g. 'replied', 'queued', 'bounced'. */
  readonly status = input.required<string>();
  /** Optional label override; otherwise the status is tidied to sentence case. */
  readonly text = input<string | null>(null);

  private static readonly TONES: Record<string, Tone> = {
    // Positive / healthy
    replied: 'positive',
    meeting: 'positive',
    won: 'positive',
    positive: 'positive',
    sent: 'positive',
    complete: 'positive',
    booked: 'positive',
    connected: 'positive',
    healthy: 'positive',
    // Pending / in-flight / warning
    contacted: 'warning',
    queued: 'warning',
    pending: 'warning',
    in_progress: 'warning',
    warming: 'warning',
    warmup: 'warning',
    out_of_office: 'warning',
    auto_reply: 'warning',
    neutral: 'warning',
    // Error / negative / stopped
    bounced: 'danger',
    lost: 'danger',
    stopped: 'danger',
    negative: 'danger',
    failed: 'danger',
    suppressed: 'danger',
    not_interested: 'danger',
    reauth_required: 'danger',
    unsubscribe: 'danger',
    // Neutral / default
    new: 'neutral',
    draft: 'neutral',
  };

  private static readonly TONE_CLASSES: Record<Tone, string> = {
    positive: 'bg-positive-soft text-positive',
    warning: 'bg-warning-soft text-warning',
    danger: 'bg-danger-soft text-danger',
    neutral: 'bg-canvas text-muted border border-line',
  };

  protected readonly label = computed(() => {
    if (this.text()) return this.text();
    const raw = this.status().replace(/_/g, ' ').trim();
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  });

  protected readonly classes = computed(() => {
    const tone = StatusBadge.TONES[this.status().toLowerCase()] ?? 'neutral';
    return (
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ' +
      StatusBadge.TONE_CLASSES[tone]
    );
  });
}

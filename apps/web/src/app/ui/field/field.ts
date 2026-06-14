// ui-field — label + control + hint/error wrapper (File 16 §7).
// WHY: form rows had inconsistent label sizing and error placement. This wraps a
// projected control (input/textarea/select — style them with the .ui-input /
// .ui-textarea / .ui-select classes) with a label, an optional hint, and an
// error that replaces the hint and is announced (role=alert). Pass `for` to tie
// the label to the control id.
import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-field',
  template: `
    <label [attr.for]="for()" class="block text-sm font-medium text-ink">
      {{ label() }}
    </label>
    <div class="mt-1.5">
      <ng-content />
    </div>
    @if (error()) {
      <p class="mt-1.5 text-sm text-danger" role="alert">{{ error() }}</p>
    } @else if (hint()) {
      <p class="mt-1.5 text-sm text-muted">{{ hint() }}</p>
    }
  `,
  host: { class: 'block' },
})
export class Field {
  readonly label = input.required<string>();
  readonly hint = input<string | null>(null);
  readonly error = input<string | null>(null);
  /** id of the control this label points at. */
  readonly for = input<string | null>(null);
}

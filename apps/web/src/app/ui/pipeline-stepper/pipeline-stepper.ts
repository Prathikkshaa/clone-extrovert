// pipeline-stepper — the Find → Enrich → Write → Send progress bar (File 16 §2).
// WHY: the four workflow screens are one ordered pipeline, but nothing showed
// where a step sat in that flow. This renders the 4 steps with the current one
// highlighted, completed steps checked, and each step linking to its screen — so
// a beginner always sees the path and can jump along it. Shown on the workflow
// screens (Phase 4) and on Home.
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

export type PipelineStep = 'find' | 'enrich' | 'write' | 'send';

interface StepDef {
  key: PipelineStep;
  label: string;
  link: string;
}

@Component({
  selector: 'pipeline-stepper',
  imports: [RouterLink, Icon],
  template: `
    <ol class="flex items-center">
      @for (step of steps; track step.key; let i = $index; let last = $last) {
        <li class="flex items-center" [class.flex-1]="!last">
          <a
            [routerLink]="step.link"
            class="flex items-center gap-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            [attr.aria-current]="stateOf(i) === 'current' ? 'step' : null"
          >
            <span [class]="circleClass(stateOf(i))">
              @if (stateOf(i) === 'done') {
                <ui-icon name="check" [size]="14" />
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span [class]="labelClass(stateOf(i))">{{ step.label }}</span>
          </a>
          @if (!last) {
            <span class="mx-3 h-px flex-1" [class]="connectorClass(i)"></span>
          }
        </li>
      }
    </ol>
  `,
  host: { class: 'block' },
})
export class PipelineStepper {
  /** The active stage. Earlier stages render as done, later as to-do. */
  readonly current = input.required<PipelineStep>();

  protected readonly steps: StepDef[] = [
    { key: 'find', label: 'Find', link: '/search' },
    { key: 'enrich', label: 'Enrich', link: '/enrich' },
    { key: 'write', label: 'Write', link: '/draft' },
    { key: 'send', label: 'Send', link: '/send' },
  ];

  private readonly currentIndex = computed(() =>
    this.steps.findIndex((s) => s.key === this.current()),
  );

  protected stateOf(i: number): 'done' | 'current' | 'todo' {
    const c = this.currentIndex();
    if (i < c) return 'done';
    if (i === c) return 'current';
    return 'todo';
  }

  protected circleClass(state: 'done' | 'current' | 'todo'): string {
    const base =
      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors duration-200 ';
    switch (state) {
      case 'done':
        return base + 'bg-accent text-white';
      case 'current':
        return base + 'bg-accent text-white ring-2 ring-accent-soft';
      default:
        return base + 'border border-line text-muted';
    }
  }

  protected labelClass(state: 'done' | 'current' | 'todo'): string {
    const base = 'text-sm transition-colors duration-200 ';
    return state === 'todo'
      ? base + 'text-muted'
      : base + 'font-medium text-ink';
  }

  protected connectorClass(i: number): string {
    return i < this.currentIndex() ? 'bg-accent' : 'bg-line';
  }
}

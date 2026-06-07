// Billing error types.
// WHY: callers (the credit gate, API handlers) need to distinguish "out of
// credits" from other failures so the UI can prompt a top-up instead of showing
// a generic error.
import type { CreditAction } from '@extrovertai/shared';

export class InsufficientCreditsError extends Error {
  constructor(
    readonly userId: string,
    readonly action: CreditAction,
    readonly cost: number,
  ) {
    super(`Insufficient credits for "${action}" (needs ${cost}).`);
    this.name = 'InsufficientCreditsError';
  }
}

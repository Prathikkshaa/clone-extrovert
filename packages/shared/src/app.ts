// APP_NAME — the single source of truth for the product name.
// WHY: the name is a placeholder that may be rebranded later, so UI strings,
// emails, and API responses must read it from here, never hardcode "ExtrovertAI".
// Reads APP_NAME from the environment when available (Node apps), and falls back
// to the default in browser bundles where `process` is undefined.

const DEFAULT_APP_NAME = 'ExtrovertAI';

function resolveAppName(): string {
  if (typeof process !== 'undefined' && process.env && process.env['APP_NAME']) {
    return process.env['APP_NAME'] as string;
  }
  return DEFAULT_APP_NAME;
}

export const APP_NAME: string = resolveAppName();

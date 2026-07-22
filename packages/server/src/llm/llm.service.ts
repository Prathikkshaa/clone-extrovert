// LlmService — single abstraction over the LLM (OpenRouter today).
//
// WHY: all model calls go through here so swapping providers/models is a one-value
// change (master-context §2). Used for profile extraction (File 05) and drafting
// (File 09). `extractJson` is hardened for reasoning models that wrap their answer
// in prose/chain-of-thought: it scans for a balanced JSON block and retries once.
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CompleteOptions {
  system?: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const TIMEOUT_MS = 90000;
// Transient upstream failures (esp. 429 rate-limits on free models) are retried
// with backoff before we give up on a model and fall through to the next one.
const MAX_ATTEMPTS_PER_MODEL = 3;
const RETRY_BASE_MS = 700;

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly config: ConfigService) {}

  /**
   * Raw completion → assistant message text. Resilient by design: for each model
   * it retries transient failures (429 rate-limit / 5xx) with backoff, and if a
   * model stays unavailable it falls through to the next model in the chain
   * (LLM_MODEL, then the comma-separated LLM_MODEL_FALLBACKS). This is what stops a
   * single rate-limited free model from silently producing empty profiles/hooks.
   */
  async complete(options: CompleteOptions): Promise<string> {
    const apiKey = this.config.get<string>('OPENROUTER_API_KEY');
    const models = this.modelChain();
    if (!apiKey || models.length === 0) {
      throw new Error('OPENROUTER_API_KEY and LLM_MODEL must be set to use the LLM.');
    }

    const messages = [
      ...(options.system ? [{ role: 'system', content: options.system }] : []),
      { role: 'user', content: options.prompt },
    ];

    let lastError = 'LLM request failed.';
    for (const model of models) {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt++) {
        try {
          const { content, status, error } = await this.callOnce(apiKey, model, messages, options);
          if (content !== null && !error) {
            if (model !== models[0]) {
              this.logger.log(`LLM served by fallback model "${model}".`);
            }
            return content;
          }
          lastError = error ?? `LLM request failed (${status}).`;
          // Retry only transient conditions (rate-limit / server errors); on a
          // hard error (e.g. 404 model not found, 401) move straight to the next model.
          if (!this.isTransient(status) || attempt === MAX_ATTEMPTS_PER_MODEL) break;
          this.logger.warn(
            `Model "${model}" ${status} (attempt ${attempt}/${MAX_ATTEMPTS_PER_MODEL}) — retrying: ${lastError}`,
          );
          await this.delay(RETRY_BASE_MS * attempt);
        } catch (err) {
          // Network/timeout — treat as transient and retry, else next model.
          lastError = (err as Error).message;
          if (attempt === MAX_ATTEMPTS_PER_MODEL) break;
          await this.delay(RETRY_BASE_MS * attempt);
        }
      }
      if (models.length > 1) this.logger.warn(`Model "${model}" unavailable — trying next.`);
    }
    throw new Error(lastError);
  }

  /** A single OpenRouter call. Returns the text (or null) plus status/error so the
   *  caller can decide whether to retry or fall through. Never throws on HTTP. */
  private async callOnce(
    apiKey: string,
    model: string,
    messages: { role: string; content: string }[],
    options: CompleteOptions,
  ): Promise<{ content: string | null; status: number; error?: string }> {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://extrovertai.local',
        'X-Title': 'ExtrovertAI',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: options.maxTokens ?? 1024,
        temperature: options.temperature ?? 0.2,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };
    if (!res.ok || json.error) {
      return { content: null, status: res.status, error: json.error?.message };
    }
    const content = json.choices?.[0]?.message?.content ?? '';
    // A 200 with empty content (some models stream reasoning elsewhere) is a soft
    // failure worth falling through on.
    return { content: content.trim() ? content : null, status: res.status };
  }

  /** Primary model + optional comma-separated fallbacks (LLM_MODEL_FALLBACKS). */
  private modelChain(): string[] {
    const primary = (this.config.get<string>('LLM_MODEL') ?? '').trim();
    const fallbacks = (this.config.get<string>('LLM_MODEL_FALLBACKS') ?? '')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    return [...(primary ? [primary] : []), ...fallbacks].filter(
      (m, i, arr) => arr.indexOf(m) === i,
    );
  }

  private isTransient(status: number): boolean {
    return status === 429 || status === 408 || status >= 500;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /** Completion constrained to JSON, parsed into T. Retries once on parse failure. */
  async extractJson<T>(options: CompleteOptions): Promise<T> {
    const system = `${options.system ? options.system + '\n' : ''}Respond with ONLY valid JSON — no prose, no markdown code fences.`;

    let content = await this.complete({
      ...options,
      system,
      temperature: 0,
      maxTokens: options.maxTokens ?? 4000,
    });
    let parsed = this.tryParse<T>(content);

    if (parsed === null) {
      content = await this.complete({
        ...options,
        system: `${system}\nYour previous reply was not valid JSON. Output ONLY the JSON value.`,
        temperature: 0,
        maxTokens: options.maxTokens ?? 4000,
      });
      parsed = this.tryParse<T>(content);
    }

    if (parsed === null) {
      this.logger.warn('LLM did not return parseable JSON after retry.');
      throw new Error('The model did not return valid JSON.');
    }
    return parsed;
  }

  private tryParse<T>(text: string): T | null {
    const block = this.extractJsonBlock(text);
    if (!block) return null;
    try {
      return JSON.parse(block) as T;
    } catch {
      return null;
    }
  }

  /** Extract the first balanced {…} or […] block, ignoring surrounding prose/fences. */
  private extractJsonBlock(text: string): string | null {
    let t = text.trim();
    const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) t = fence[1].trim();

    const start = t.search(/[{[]/);
    if (start < 0) return null;
    const open = t[start];
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    let inString = false;
    let escaped = false;
    for (let i = start; i < t.length; i++) {
      const ch = t[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === '\\') escaped = true;
        else if (ch === '"') inString = false;
      } else if (ch === '"') {
        inString = true;
      } else if (ch === open) {
        depth++;
      } else if (ch === close) {
        depth--;
        if (depth === 0) return t.slice(start, i + 1);
      }
    }
    return null;
  }
}

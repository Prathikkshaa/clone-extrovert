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

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly config: ConfigService) {}

  /** Raw completion → assistant message text. */
  async complete(options: CompleteOptions): Promise<string> {
    const apiKey = this.config.get<string>('OPENROUTER_API_KEY');
    const model = this.config.get<string>('LLM_MODEL');
    if (!apiKey || !model) {
      throw new Error('OPENROUTER_API_KEY and LLM_MODEL must be set to use the LLM.');
    }

    const messages = [
      ...(options.system ? [{ role: 'system', content: options.system }] : []),
      { role: 'user', content: options.prompt },
    ];

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
      throw new Error(json.error?.message ?? `LLM request failed (${res.status}).`);
    }
    return json.choices?.[0]?.message?.content ?? '';
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

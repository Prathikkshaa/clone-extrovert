// CryptoService — authenticated symmetric encryption for secrets at rest.
//
// WHY: OAuth mailbox tokens must NEVER be stored as plaintext. This service uses
// AES-256-GCM (authenticated encryption) keyed by TOKEN_ENCRYPTION_KEY. The DB
// holds only ciphertext; tokens are decrypted in-memory only when needed
// (refresh/send/read). The ciphertext is self-describing: `v1:<base64(iv|tag|ct)>`.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_BYTES = 12; // 96-bit nonce (recommended for GCM)
const TAG_BYTES = 16;
const VERSION = 'v1';

@Injectable()
export class CryptoService {
  private readonly key: Buffer;

  constructor(config: ConfigService) {
    const raw = config.get<string>('TOKEN_ENCRYPTION_KEY');
    if (!raw) {
      throw new Error('TOKEN_ENCRYPTION_KEY must be set to encrypt mailbox tokens.');
    }
    const key = Buffer.from(raw, 'base64');
    if (key.length !== 32) {
      throw new Error(
        'TOKEN_ENCRYPTION_KEY must be base64 of 32 random bytes (e.g. `openssl rand -base64 32`).',
      );
    }
    this.key = key;
  }

  /** Encrypts a UTF-8 string. Returns `v1:<base64(iv|tag|ciphertext)>`. */
  encrypt(plaintext: string): string {
    const iv = randomBytes(IV_BYTES);
    const cipher = createCipheriv(ALGORITHM, this.key, iv);
    const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${VERSION}:${Buffer.concat([iv, tag, ciphertext]).toString('base64')}`;
  }

  /** Decrypts a value produced by encrypt(). Throws if tampered or malformed. */
  decrypt(payload: string): string {
    const [version, b64] = payload.split(':');
    if (version !== VERSION || !b64) {
      throw new Error('Unrecognized ciphertext format.');
    }
    const buffer = Buffer.from(b64, 'base64');
    const iv = buffer.subarray(0, IV_BYTES);
    const tag = buffer.subarray(IV_BYTES, IV_BYTES + TAG_BYTES);
    const ciphertext = buffer.subarray(IV_BYTES + TAG_BYTES);
    const decipher = createDecipheriv(ALGORITHM, this.key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  }
}

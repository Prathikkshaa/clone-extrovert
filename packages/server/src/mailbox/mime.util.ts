// mime.util — build a minimal RFC 822 message for Gmail's `raw` send field.
// WHY: Gmail's users.messages.send takes a base64url-encoded MIME message. We send
// plain-text bodies (File 11 adds the HTML + compliance footer). UTF-8 is carried
// via base64 transfer-encoding so non-ASCII subjects/bodies survive intact. We set
// our own Message-ID (Gmail preserves a supplied one) so follow-ups can thread.
import { randomUUID } from 'node:crypto';
import type { OutboundEmail } from './mailbox.types';

export function buildMimeMessage(email: OutboundEmail): { raw: string; rfcMessageId: string } {
  const domain = (email.fromEmail.split('@')[1] ?? 'mail.local').trim() || 'mail.local';
  const rfcMessageId = `<${randomUUID()}@${domain}>`;

  const headers = [
    `From: ${email.fromEmail}`,
    `To: ${email.to}`,
    `Subject: ${encodeHeader(email.subject)}`,
    `Message-ID: ${rfcMessageId}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
  ];
  if (email.inReplyToRfcId) {
    headers.push(`In-Reply-To: ${email.inReplyToRfcId}`);
    headers.push(`References: ${email.inReplyToRfcId}`);
  }

  const body = wrap76(Buffer.from(email.body ?? '', 'utf8').toString('base64'));
  const mime = `${headers.join('\r\n')}\r\n\r\n${body}`;
  return { raw: Buffer.from(mime, 'utf8').toString('base64url'), rfcMessageId };
}

/** RFC 2047-encode a header value only if it contains non-ASCII characters. */
function encodeHeader(value: string): string {
  // eslint-disable-next-line no-control-regex
  if (/^[\x00-\x7F]*$/.test(value)) return value;
  return `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;
}

/** Wrap base64 into 76-char lines (RFC 2045). */
function wrap76(b64: string): string {
  return (b64.match(/.{1,76}/g) ?? []).join('\r\n');
}

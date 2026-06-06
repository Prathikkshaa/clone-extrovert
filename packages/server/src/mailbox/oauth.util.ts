// Small OAuth helpers shared by the Gmail/Outlook providers.
// WHY: both providers POST form-encoded token requests and read identity from an
// id_token; keep that logic in one place. Uses the global fetch (Node 18+).

/** POSTs application/x-www-form-urlencoded and returns the parsed JSON body. */
export async function postForm(
  url: string,
  params: Record<string, string>,
): Promise<Record<string, unknown>> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params).toString(),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const detail = json['error_description'] ?? json['error'] ?? res.statusText;
    throw new Error(`OAuth token request failed (${res.status}): ${String(detail)}`);
  }
  return json;
}

/** Reads a string claim from an unverified JWT payload (e.g. id_token `email`).
 *  Safe because the token comes directly from the provider over TLS. */
export function decodeJwtClaim(jwt: string, claim: string): string | undefined {
  const payload = jwt.split('.')[1];
  if (!payload) return undefined;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<
      string,
      unknown
    >;
    const value = decoded[claim];
    return typeof value === 'string' ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Normalizes an OAuth `expires_in` (seconds) into an ISO expiry timestamp. */
export function expiresInToIso(expiresIn: unknown): string | null {
  return typeof expiresIn === 'number'
    ? new Date(Date.now() + expiresIn * 1000).toISOString()
    : null;
}

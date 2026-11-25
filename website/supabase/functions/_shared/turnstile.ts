export interface TurnstileVerificationOptions {
  token: string;
  secret: string;
  expectedHostnames: readonly string[];
  expectedAction: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

export type TurnstileVerificationResult =
  | { ok: true; hostname: string; action: string }
  | {
      ok: false;
      reason:
        | 'missing-token'
        | 'invalid-token'
        | 'hostname-mismatch'
        | 'action-mismatch'
        | 'service-error';
    };

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(
  options: TurnstileVerificationOptions,
): Promise<TurnstileVerificationResult> {
  const token = options.token.trim();
  const hostnames = options.expectedHostnames
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
  if (!token || token.length > 2048) return { ok: false, reason: 'missing-token' };
  if (!options.secret || hostnames.length === 0 || !options.expectedAction) {
    return { ok: false, reason: 'service-error' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 5000);
  try {
    const response = await (options.fetcher ?? fetch)(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: options.secret, response: token }),
      signal: controller.signal,
    });
    if (!response.ok) return { ok: false, reason: 'service-error' };
    const body: unknown = await response.json();
    if (!isRecord(body) || body['success'] !== true) return { ok: false, reason: 'invalid-token' };

    const hostname = typeof body['hostname'] === 'string' ? body['hostname'].toLowerCase() : '';
    const action = typeof body['action'] === 'string' ? body['action'] : '';
    if (!hostnames.includes(hostname)) return { ok: false, reason: 'hostname-mismatch' };
    if (action !== options.expectedAction) return { ok: false, reason: 'action-mismatch' };
    return { ok: true, hostname, action };
  } catch {
    return { ok: false, reason: 'service-error' };
  } finally {
    clearTimeout(timeout);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

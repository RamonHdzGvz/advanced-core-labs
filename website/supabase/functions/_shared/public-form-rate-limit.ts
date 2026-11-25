export interface PublicFormRateLimitConfig {
  supabaseUrl: string;
  serviceRoleKey: string;
  hashSecret: string;
  fetcher?: typeof fetch;
}

export interface PublicFormRateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

/** Calls the private, atomic Postgres limiter without ever storing the raw client IP. */
export function createPublicFormRateLimiter(config: PublicFormRateLimitConfig) {
  return async function consumeRateLimit(
    action: string,
    clientIp: string,
    maxRequests: number,
    windowSeconds: number,
  ): Promise<PublicFormRateLimitResult> {
    const url = config.supabaseUrl.replace(/\/$/, '');
    if (!url || !config.serviceRoleKey || config.hashSecret.length < 32)
      throw new Error('Rate limiter is not configured.');
    const ipHash = await hmacSha256(config.hashSecret, clientIp);
    const response = await (config.fetcher ?? fetch)(
      `${url}/rest/v1/rpc/consume_public_form_rate_limit`,
      {
        method: 'POST',
        headers: {
          apikey: config.serviceRoleKey,
          authorization: `Bearer ${config.serviceRoleKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          p_action: action,
          p_ip_hash: ipHash,
          p_max_requests: maxRequests,
          p_window_seconds: windowSeconds,
        }),
      },
    );
    if (!response.ok) throw new Error('Rate limiter is unavailable.');
    const result: unknown = await response.json();
    const row = Array.isArray(result) ? result[0] : result;
    if (!isRecord(row) || typeof row['allowed'] !== 'boolean')
      throw new Error('Rate limiter returned invalid data.');
    return {
      allowed: row['allowed'],
      retryAfterSeconds:
        typeof row['retry_after_seconds'] === 'number'
          ? Math.max(1, row['retry_after_seconds'])
          : windowSeconds,
    };
  };
}

async function hmacSha256(secret: string, value: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

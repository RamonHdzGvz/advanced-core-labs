import { verifyTurnstileToken, type TurnstileVerificationResult } from './turnstile.ts';

declare const Deno: { env: { get(name: string): string | undefined } };

export interface PublicFormProtectionConfig {
  action: string;
  expectedHostnames: readonly string[];
  maxRequests: number;
  windowSeconds: number;
  maxBodyBytes?: number;
  honeypotField?: string;
  validatePayload: (payload: Record<string, unknown>) => boolean;
}

export interface PublicFormProtectionDependencies {
  consumeRateLimit: (
    action: string,
    ip: string,
    maxRequests: number,
    windowSeconds: number,
  ) => Promise<{ allowed: boolean; retryAfterSeconds: number }>;
  verifyToken?: (
    token: string,
    action: string,
    expectedHostnames: readonly string[],
  ) => Promise<TurnstileVerificationResult>;
  handle: (payload: Record<string, unknown>) => Promise<Response>;
}

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

export function getTrustedClientIp(request: Request): string | null {
  // Supabase Edge Functions run behind the platform proxy. Never accept an IP from the body or a custom header.
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim();
  return ip && ip.length <= 64 ? ip : null;
}

export async function handleProtectedPublicForm(
  request: Request,
  config: PublicFormProtectionConfig,
  dependencies: PublicFormProtectionDependencies,
): Promise<Response> {
  if (request.method !== 'POST')
    return json({ error: 'Method not allowed.' }, 405, { allow: 'POST' });

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > (config.maxBodyBytes ?? 32_768)) {
    return json({ error: 'Request is too large.' }, 413);
  }

  let body: unknown;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > (config.maxBodyBytes ?? 32_768)) {
      return json({ error: 'Request is too large.' }, 413);
    }
    body = JSON.parse(text);
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }
  if (!isRecord(body)) return json({ error: 'Invalid request body.' }, 400);

  const honeypotField = config.honeypotField ?? 'age';
  const honeypotValue = body[honeypotField];
  if (
    honeypotValue !== undefined &&
    honeypotValue !== null &&
    String(honeypotValue).trim() !== ''
  ) {
    return json({ error: 'Request rejected.' }, 400);
  }

  const token = body['turnstileToken'];
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) {
    return json({ error: 'Complete the anti-spam verification.' }, 400);
  }

  const payload = { ...body };
  delete payload['turnstileToken'];
  delete payload[honeypotField];
  if (!config.validatePayload(payload)) return json({ error: 'Invalid form data.' }, 400);

  const ip = getTrustedClientIp(request);
  if (!ip) return json({ error: 'Unable to verify request origin.' }, 503);

  let limit: { allowed: boolean; retryAfterSeconds: number };
  try {
    limit = await dependencies.consumeRateLimit(
      config.action,
      ip,
      config.maxRequests,
      config.windowSeconds,
    );
  } catch {
    return json({ error: 'Form service is temporarily unavailable.' }, 503);
  }
  if (!limit.allowed) {
    return json({ error: 'Too many requests. Please try again later.' }, 429, {
      'retry-after': String(Math.max(1, limit.retryAfterSeconds)),
    });
  }

  const verify = dependencies.verifyToken ?? defaultVerify;
  let verification: TurnstileVerificationResult;
  try {
    verification = await verify(token, config.action, config.expectedHostnames);
  } catch {
    return json({ error: 'Anti-spam verification is temporarily unavailable.' }, 503);
  }
  if (!verification.ok)
    return json({ error: 'Anti-spam verification failed. Please try again.' }, 403);

  // Keep every side effect (email, database writes, uploads) behind all protection checks.
  return dependencies.handle(payload);
}

async function defaultVerify(
  token: string,
  action: string,
  expectedHostnames: readonly string[],
): Promise<TurnstileVerificationResult> {
  const secret = Deno.env.get('CLOUDFLARE_TURNSTILE_SECRET_KEY') ?? '';
  return verifyTurnstileToken({
    token,
    secret,
    expectedHostnames,
    expectedAction: action,
  });
}

function json(
  body: Record<string, unknown>,
  status: number,
  extraHeaders: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

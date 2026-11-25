import { describe, expect, it, vi } from 'vitest';
import { handleProtectedPublicForm } from '../../../../supabase/functions/_shared/public-form-protection';
import { verifyTurnstileToken } from '../../../../supabase/functions/_shared/turnstile';
import {
  applyPublicFormCorsHeaders,
  createPublicFormCorsHeaders,
  rejectDisallowedOrigin,
} from '../../../../supabase/functions/_shared/public-form-cors';

const config = {
  action: 'contact',
  expectedHostnames: ['example.com'],
  maxRequests: 5,
  windowSeconds: 600,
  validatePayload: (payload: Record<string, unknown>) =>
    typeof payload['email'] === 'string' && payload['email'].includes('@'),
};

function request(
  body: Record<string, unknown>,
  headers: Record<string, string> = { 'x-forwarded-for': '203.0.113.8' },
) {
  return new Request('https://edge.example.com/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

function dependencies(overrides: Record<string, unknown> = {}) {
  return {
    consumeRateLimit: vi.fn().mockResolvedValue({ allowed: true, retryAfterSeconds: 1 }),
    verifyToken: vi
      .fn()
      .mockResolvedValue({ ok: true, hostname: 'example.com', action: 'contact' }),
    handle: vi.fn().mockResolvedValue(Response.json({ sent: true })),
    ...overrides,
  };
}

describe('public form server protection', () => {
  it('rejects a filled honeypot before rate limiting, verification, or side effects', async () => {
    const deps = dependencies();
    const response = await handleProtectedPublicForm(
      request({ email: 'a@example.com', age: 'bot', turnstileToken: 'x' }),
      config,
      deps,
    );
    expect(response.status).toBe(400);
    expect(deps.consumeRateLimit).not.toHaveBeenCalled();
    expect(deps.verifyToken).not.toHaveBeenCalled();
    expect(deps.handle).not.toHaveBeenCalled();
  });

  it('rejects invalid payloads before protection services or side effects', async () => {
    const deps = dependencies();
    const response = await handleProtectedPublicForm(
      request({ email: 'invalid', turnstileToken: 'x' }),
      config,
      deps,
    );
    expect(response.status).toBe(400);
    expect(deps.consumeRateLimit).not.toHaveBeenCalled();
    expect(deps.handle).not.toHaveBeenCalled();
  });

  it('fails closed when the persistent limiter is unavailable', async () => {
    const deps = dependencies({
      consumeRateLimit: vi.fn().mockRejectedValue(new Error('offline')),
    });
    const response = await handleProtectedPublicForm(
      request({ email: 'a@example.com', turnstileToken: 'x' }),
      config,
      deps,
    );
    expect(response.status).toBe(503);
    expect(deps.verifyToken).not.toHaveBeenCalled();
    expect(deps.handle).not.toHaveBeenCalled();
  });

  it('rejects rate-limited requests before Turnstile or side effects', async () => {
    const deps = dependencies({
      consumeRateLimit: vi.fn().mockResolvedValue({ allowed: false, retryAfterSeconds: 30 }),
    });
    const response = await handleProtectedPublicForm(
      request({ email: 'a@example.com', turnstileToken: 'x' }),
      config,
      deps,
    );
    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('30');
    expect(deps.verifyToken).not.toHaveBeenCalled();
    expect(deps.handle).not.toHaveBeenCalled();
  });

  it('does not invoke the handler when Turnstile verification fails', async () => {
    const deps = dependencies({
      verifyToken: vi.fn().mockResolvedValue({ ok: false, reason: 'invalid-token' }),
    });
    const response = await handleProtectedPublicForm(
      request({ email: 'a@example.com', turnstileToken: 'x' }),
      config,
      deps,
    );
    expect(response.status).toBe(403);
    expect(deps.handle).not.toHaveBeenCalled();
  });

  it('runs the handler only after checks and strips the token and honeypot', async () => {
    const deps = dependencies();
    const response = await handleProtectedPublicForm(
      request({
        email: 'a@example.com',
        age: '',
        turnstileToken: 'one-time-token',
        message: 'hello',
      }),
      config,
      deps,
    );
    expect(response.status).toBe(200);
    expect(deps.consumeRateLimit).toHaveBeenCalledWith('contact', '203.0.113.8', 5, 600);
    expect(deps.verifyToken).toHaveBeenCalledWith('one-time-token', 'contact', ['example.com']);
    expect(deps.handle).toHaveBeenCalledWith({ email: 'a@example.com', message: 'hello' });
  });

  it('fails closed when the trusted proxy IP is missing', async () => {
    const deps = dependencies();
    const response = await handleProtectedPublicForm(
      request({ email: 'a@example.com', turnstileToken: 'x' }, {}),
      config,
      deps,
    );
    expect(response.status).toBe(503);
    expect(deps.consumeRateLimit).not.toHaveBeenCalled();
    expect(deps.handle).not.toHaveBeenCalled();
  });
});

describe('Cloudflare Turnstile Siteverify adapter', () => {
  const options = {
    token: 'token',
    secret: 'server-secret',
    expectedHostnames: ['example.com'],
    expectedAction: 'contact',
  };

  it('accepts a success only when hostname and action match', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValue(
        Response.json({ success: true, hostname: 'example.com', action: 'contact' }),
      );
    await expect(verifyTurnstileToken({ ...options, fetcher })).resolves.toEqual({
      ok: true,
      hostname: 'example.com',
      action: 'contact',
    });
    expect(fetcher).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it.each([
    [{ success: true, hostname: 'evil.example', action: 'contact' }, 'hostname-mismatch'],
    [{ success: true, hostname: 'example.com', action: 'login' }, 'action-mismatch'],
    [{ success: false, 'error-codes': ['timeout-or-duplicate'] }, 'invalid-token'],
  ] as const)('rejects invalid Siteverify result %#', async (body, reason) => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(body));
    await expect(verifyTurnstileToken({ ...options, fetcher })).resolves.toEqual({
      ok: false,
      reason,
    });
  });

  it('fails closed on a network error', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('network failure'));
    await expect(verifyTurnstileToken({ ...options, fetcher })).resolves.toEqual({
      ok: false,
      reason: 'service-error',
    });
  });
});

describe('public form CORS policy', () => {
  const allowedOrigins = ['https://example.com'];

  it('echoes only an explicitly allowed origin', () => {
    const request = new Request('https://edge.example.com', {
      headers: { origin: 'https://example.com' },
    });
    expect(
      createPublicFormCorsHeaders(request, allowedOrigins).get('access-control-allow-origin'),
    ).toBe('https://example.com');
    expect(rejectDisallowedOrigin(request, allowedOrigins)).toBeNull();
  });

  it('rejects a disallowed origin without returning a permissive CORS header', () => {
    const request = new Request('https://edge.example.com', {
      headers: { origin: 'https://attacker.test' },
    });
    const rejection = rejectDisallowedOrigin(request, allowedOrigins);
    expect(rejection?.status).toBe(403);
    expect(
      createPublicFormCorsHeaders(request, allowedOrigins).get('access-control-allow-origin'),
    ).toBeNull();
  });

  it('adds the allowlisted CORS headers to the response', async () => {
    const request = new Request('https://edge.example.com', {
      headers: { origin: 'https://example.com' },
    });
    const response = applyPublicFormCorsHeaders(
      Response.json({ ok: true }),
      createPublicFormCorsHeaders(request, allowedOrigins),
    );
    expect(response.headers.get('access-control-allow-origin')).toBe('https://example.com');
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});

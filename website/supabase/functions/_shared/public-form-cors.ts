export function createPublicFormCorsHeaders(
  request: Request,
  allowedOrigins: readonly string[],
): Headers {
  const headers = new Headers({
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'authorization, apikey, content-type, x-client-info',
    'access-control-max-age': '86400',
    vary: 'Origin',
  });
  const origin = request.headers.get('origin');
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('access-control-allow-origin', origin);
  }
  return headers;
}

export function rejectDisallowedOrigin(
  request: Request,
  allowedOrigins: readonly string[],
): Response | null {
  const origin = request.headers.get('origin');
  return origin && !allowedOrigins.includes(origin)
    ? Response.json({ error: 'Origin not allowed.' }, { status: 403 })
    : null;
}

export function applyPublicFormCorsHeaders(response: Response, corsHeaders: Headers): Response {
  const headers = new Headers(response.headers);
  corsHeaders.forEach((value, name) => headers.set(name, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

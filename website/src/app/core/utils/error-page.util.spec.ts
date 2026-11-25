import { describe, expect, it } from 'vitest';
import { resolveErrorPage } from '@core/utils/error-page.util';

describe('resolveErrorPage', () => {
  it('returns usable content for every supported status code', () => {
    const supportedCodes = [400, 401, 403, 404, 408, 409, 429, 500, 502, 503, 504];

    for (const code of supportedCodes) {
      const errorPage = resolveErrorPage(String(code));

      expect(errorPage.code).toBe(code);
      expect(errorPage.title.trim()).not.toBe('');
      expect(errorPage.description.trim()).not.toBe('');
      expect(errorPage.actionLabel.trim()).not.toBe('');
      expect(errorPage.actionUrl).toBe('/');
    }
  });

  it.each([null, '', 'abc', '399', '600'])('uses the 404 page for invalid code %s', (code) => {
    const errorPage = resolveErrorPage(code);

    expect(errorPage.code).toBe(404);
    expect(errorPage.title).toBe('Página no encontrada');
  });

  it('uses generic copy for an unlisted HTTP status while preserving its code', () => {
    const errorPage = resolveErrorPage('418');

    expect(errorPage).toEqual({
      code: 418,
      title: 'Ocurrió un error',
      description: 'No fue posible completar la solicitud. Inténtalo de nuevo más tarde.',
      actionLabel: 'Volver al inicio',
      actionUrl: '/',
    });
  });

  it('applies subdomain defaults and code-specific overrides', () => {
    const errorPage = resolveErrorPage('401', {
      homeLabel: 'Volver a Home',
      messages: {
        401: {
          title: 'Inicia sesión para continuar',
          actionLabel: 'Iniciar sesión',
          actionUrl: '/login',
        },
      },
    });

    expect(errorPage).toMatchObject({
      code: 401,
      title: 'Inicia sesión para continuar',
      actionLabel: 'Iniciar sesión',
      actionUrl: '/login',
    });

    const notFoundPage = resolveErrorPage('404', { homeLabel: 'Volver a la galería' });
    expect(notFoundPage.actionLabel).toBe('Volver a la galería');
  });
});

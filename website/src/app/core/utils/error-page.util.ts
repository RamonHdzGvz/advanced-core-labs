import type { ErrorPageContent, ErrorPageRouteConfig } from '@core/models/error-page.model';

const errorCatalog: Record<number, Omit<ErrorPageContent, 'code'>> = {
  400: {
    title: 'Solicitud incorrecta',
    description: 'La solicitud no pudo procesarse porque contiene datos incorrectos.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  401: {
    title: 'Necesitas iniciar sesión',
    description: 'Inicia sesión para continuar con esta solicitud.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  403: {
    title: 'Acceso denegado',
    description: 'Tu cuenta no tiene permiso para acceder a este contenido.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  404: {
    title: 'Página no encontrada',
    description: 'La dirección que buscas no existe o ya no está disponible.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  408: {
    title: 'La solicitud tardó demasiado',
    description: 'No recibimos respuesta a tiempo. Inténtalo de nuevo.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  409: {
    title: 'No se pudo completar la solicitud',
    description: 'El recurso cambió y existe un conflicto con esta operación.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  429: {
    title: 'Demasiadas solicitudes',
    description: 'Has realizado demasiadas solicitudes. Espera un momento e inténtalo de nuevo.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  500: {
    title: 'Error interno',
    description: 'Ocurrió un problema inesperado. Inténtalo de nuevo más tarde.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  502: {
    title: 'Respuesta inválida del servidor',
    description: 'El servicio recibió una respuesta inesperada. Inténtalo de nuevo más tarde.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  503: {
    title: 'Servicio no disponible',
    description: 'El servicio está temporalmente fuera de línea. Inténtalo más tarde.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
  504: {
    title: 'Tiempo de espera agotado',
    description: 'El servicio tardó demasiado en responder. Inténtalo de nuevo más tarde.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  },
};

export function resolveErrorPage(
  value: string | null,
  config: ErrorPageRouteConfig = {},
): ErrorPageContent {
  const parsedCode = Number(value);
  const code =
    Number.isInteger(parsedCode) && parsedCode >= 400 && parsedCode <= 599 ? parsedCode : 404;
  const defaults = errorCatalog[code] ?? {
    title: 'Ocurrió un error',
    description: 'No fue posible completar la solicitud. Inténtalo de nuevo más tarde.',
    actionLabel: 'Volver al inicio',
    actionUrl: '/',
  };

  return {
    code,
    ...defaults,
    actionLabel: config.homeLabel ?? defaults.actionLabel,
    actionUrl: config.homeUrl ?? defaults.actionUrl,
    ...config.messages?.[code],
  };
}

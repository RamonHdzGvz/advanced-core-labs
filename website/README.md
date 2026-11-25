# AdvancedCoreLabs Website

Sitio público de AdvancedCoreLabs construido sobre el boilerplate Angular + Tailwind del equipo. La Fase 1 presenta la empresa, sus tres servicios y el proceso de trabajo en una landing page responsive.

## Documentos de referencia

- `../PRD-AdvancedCoreLabs-Fase-1.md`: alcance, contenido y requisitos del sitio.
- `../DESIGN.md`: identidad de marca, colores, tipografía, logo y reglas de interfaz.
- `../logo/logo-classic.png`: isotipo oficial usado junto al wordmark de texto `AdvancedCoreLabs`.

La carpeta `test-branch/` contiene una versión anterior y no forma parte de esta implementación.

## Requisitos

Usa Node.js `24.17.0` y npm `11.13.0`, fijados por `.nvmrc` y `package.json`.

```powershell
nvm use 24.17.0
npm ci
npm start
```

El servidor local acepta hosts `*.localhost`. La miniapp pública `www` es la ruta predeterminada.

## Comandos

```powershell
npm run build
npm run lint
npm run format:check
npm test -- --watch=false
```

## Contenido de la Fase 1

- Hero con propuesta de valor y CTA.
- Filosofía de AdvancedCoreLabs.
- Landing Pages, Directorio Empresarial y Micro Apps.
- Proceso de trabajo en cuatro pasos.
- Formulario de contacto con validación de cliente.
- Footer con navegación de la landing.

El nombre “Directorio Empresarial” continúa marcado como provisional en el PRD. No se publican precios, correos, teléfonos, redes sociales ni datos legales sin confirmación.

## Integración pendiente

El formulario valida los datos en el navegador, pero no los envía. Antes de habilitar el envío deben definirse el endpoint, el backend, el servicio de correo y los destinatarios. La interfaz no muestra éxito ni borra los datos sin confirmación del servidor. Antes de recibir datos reales también se deben configurar protección anti-spam, rate limiting y el aviso de privacidad oficial.

El dominio y el hosting de producción todavía requieren confirmación. No se configura canonical ni analítica hasta definir esos datos.

## Arquitectura

- `src/app/core/`: routing, servicios, configuración y utilidades compartidas del boilerplate.
- `src/app/shared/`: componentes ACL reutilizables.
- `src/app/subdomains/www/pages/home/`: landing del sitio.
- `public/acl-mark.png`: isotipo oficial para navbar, footer y favicon.

La paleta utiliza un único esquema fijo según `DESIGN.md`; el sitio no muestra selector de tema.

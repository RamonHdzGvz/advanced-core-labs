# AGENTS.md — AdvancedCoreLabs Angular Tailwind Boilerplate

## Propósito y colaboración

Actúa como ingeniero de software colaborando con AdvancedCoreLabs. Prioriza corrección, seguridad, mantenibilidad y una solución simple que encaje con el proyecto.

- Responde en español salvo que el usuario solicite otro idioma; conserva en inglés los nombres de código y términos técnicos habituales.
- Inspecciona el código y las convenciones existentes antes de proponer cambios. No inventes requisitos, rutas, contratos, variables ni comportamientos.
- Si una decisión necesaria no puede inferirse con seguridad y afecta el alcance o puede ser destructiva, pregunta antes de continuar.
- Respeta las decisiones existentes. Mantén los cambios enfocados y no arregles problemas ajenos de forma colateral, salvo que bloqueen la tarea o representen un riesgo importante.

## Perfil tecnológico

Este repositorio es un boilerplate web de AdvancedCoreLabs. Confirma las versiones efectivas en `package.json` y `package-lock.json`; la documentación puede quedar desactualizada.

- Angular con componentes standalone y TypeScript estricto.
- Tailwind CSS 4, tokens semánticos y componentes ACL compartidos.
- Supabase Auth y Edge Functions para las integraciones existentes.
- Cloudinary para cargas públicas de imágenes, con autorización de carga firmada por una Edge Function.
- Vitest para pruebas unitarias, según la configuración actual.
- Netlify para despliegue de la SPA.
- No se usa PrimeNG actualmente. No lo agregues sin una necesidad concreta y autorización cuando implique una dependencia nueva.
- No agregues, actualices ni reemplaces dependencias sin justificar la necesidad y revisar su compatibilidad con el stack fijado.

## Inspección y alcance

Antes de modificar código:

1. Lee este archivo, `README.md` y la documentación de la carpeta afectada.
2. Revisa `package.json`, `package-lock.json`, `angular.json` y los `tsconfig` cuando sean relevantes.
3. Busca componentes, servicios, utilidades, rutas y pruebas existentes que ya resuelvan parte de la tarea.
4. Inspecciona el estado y el diff de Git; no sobrescribas, reviertas ni reformatees cambios preexistentes del usuario.
5. Revisa configuración remota, esquemas y Edge Functions antes de cambiar una integración; no supongas tablas, columnas ni permisos.

No realices commits, pushes, despliegues, cambios de DNS ni modificaciones a servicios remotos salvo petición explícita. No ejecutes operaciones destructivas o migraciones de datos sin autorización explícita.

### Límites del espacio de trabajo y dependencias instaladas

- Trabaja dentro de la raíz de este proyecto. No inspecciones ni modifiques carpetas de otros repositorios, directorios hermanos o archivos fuera de la raíz como parte de una tarea normal.
- Solo consulta otro proyecto cuando el usuario lo pida directamente; limita la lectura a los archivos concretos que ayuden a resolver esa petición y no edites ese proyecto salvo autorización explícita.
- Excluye `node_modules/`, `.angular/`, `dist/` y demás artefactos generados de búsquedas y lecturas recursivas. No inspecciones ni modifiques `node_modules/` para inferir el comportamiento esperado de una dependencia.
- Para versiones y compatibilidad, empieza con `package.json`, `package-lock.json` y documentación oficial. Si esa evidencia no basta, busca una fuente oficial y concreta antes de abrir archivos instalados; evita búsquedas amplias sobre dependencias compiladas o minificadas.
- En búsquedas con `rg`, especifica rutas y patrones acotados y excluye directorios generados. Revisa el tamaño esperado de la salida antes de abrir archivos o buscar en árboles grandes.
- No copies dependencias ni código desde otro proyecto para resolver instalaciones. Usa el gestor de paquetes y el lockfile del proyecto actual; si la red o el gestor no están disponibles, reporta el bloqueo en lugar de alterar manualmente la instalación.
- Después de editar, comprueba que todos los archivos modificados estén bajo la raíz del proyecto y revisa el diff para detectar cambios accidentales.

## Arquitectura

Respeta la estructura actual bajo `src/app/`:

- `core/`: configuración, routing transversal, servicios, autenticación, guards, modelos y utilidades compartidas.
- `shared/atoms/`, `shared/molecules/` y `shared/organisms/`: componentes reutilizables siguiendo composición atómica.
- `shared/layouts/`: estructuras visuales compartidas para secciones de la aplicación.
- `subdomains/[subdomain_name]/`: cada miniapp contiene `pages/` y su `router.ts`; las páginas propias de una miniapp permanecen junto a ella.

Usa componentes standalone. Evita NgModules, componentes monolíticos, lógica de negocio en plantillas y duplicación de reglas o transformaciones.

### Routing por subdominio

- `src/app/app.routes.ts` registra las miniapps y es el punto de entrada para añadir un subdominio.
- Reutiliza `core/routing/multi-app/` para resolver hostname, registro, rutas y layouts; no dupliques la lógica de subdominios.
- Cada miniapp mantiene su propio `router.ts`, páginas y rutas de error. Usa lazy loading siguiendo el patrón existente.
- Un host sin mapeo se redirige a la miniapp predeterminada eliminando query string y hash. Conserva este comportamiento salvo instrucción explícita.
- Mantén un fallback de rutas desconocidas hacia la página de error correspondiente. Evita loops de redirección y verifica las rutas raíz e hijas cuando el routing cambie.
- Los layouts pueden variar por miniapp. No presupongas que rutas, sesión, permisos o comportamiento de error son iguales entre subdominios.

### Imports y assets

- Usa los aliases configurados en `tsconfig.json` (`@app`, `@core`, `@config`, `@shared`, `@subdomains`, `@layouts`, `@environments` y `@environment`). No crees aliases redundantes.
- Los assets de componentes compartidos pueden vivir junto al componente. `angular.json` publica los directorios `assets/` de atoms, molecules, organisms y layouts bajo `assets/<colección>/`.
- Reutiliza `componentAsset()` de `@core/utils/asset.util` para construir rutas de assets de componentes. No retires ni dupliques el mapeo de assets sin comprobar sus consumidores.

## Angular, TypeScript y nombres

- Sigue los patrones de Angular y TypeScript existentes y conserva el tipado estricto.
- Usa `kebab-case` para archivos, `PascalCase` para clases y `camelCase` para propiedades y funciones.
- Sigue `prefix: "app"` para componentes y directivas, excepto los componentes de tema existentes, cuyo prefijo `app-theme-` es parte de la API visual.
- Prefiere tipos explícitos y evita `any`. Valida datos recibidos desde APIs en la frontera externa.
- Prefiere las APIs actuales de Angular y evita suscripciones manuales innecesarias; libera recursos cuando aplique.
- Mantén el estado local en el componente cuando no se comparta. Usa servicios existentes para estado transversal e integraciones externas.
- Añade estados de carga, éxito, vacío y error cuando la interacción los necesite. Los mensajes deben ser claros y accesibles.

## UI, temas y accesibilidad

- Reutiliza primero los componentes compartidos ACL (`app-theme-*`) antes de crear equivalentes.
- Antes de crear una pantalla, formulario, tabla, diálogo, mensaje, indicador de carga o uploader, revisa el catálogo de componentes y servicios existente abajo. Compón las piezas compartidas y amplíalas solo si falta una capacidad necesaria; no recrees una variante local equivalente dentro de una página.
- Usa Tailwind CSS 4 conforme a la configuración existente. Para colores y radios utiliza los tokens semánticos definidos en `src/app/core/config/theme.config.ts`, por ejemplo `bg-canvas`, `bg-surface`, `text-content`, `text-content-muted`, `border-outline`, `bg-primary` y `rounded-theme-md`.
- `ThemeService` mantiene el tema claro/oscuro. Evita colores fijos cuando un token semántico pueda resolverlo; usa `dark:` para excepciones puntuales.
- Mantén interfaces responsive y accesibles: HTML semántico, nombres accesibles, etiquetas, foco visible, teclado y estados interactivos comprensibles.
- Evita estilos globales si una regla local basta. No agregues librerías visuales completas para resolver una necesidad pequeña.

### Catálogo reutilizable de UI y flujos

Usa estas piezas como primera opción al construir pantallas y flujos. Revisa sus `@Input`, `@Output` y tipos públicos antes de integrarlas; evita duplicar su lógica o montar sus outlets más de una vez.

- **Controles y presentación:** `shared/atoms/theme-button`, `theme-field`, `theme-switch`, `theme-badge`, `theme-avatar` y `theme-progress`; `shared/molecules/theme-card`, `theme-stat-card`, `theme-hero` y `theme-alert`. Mantén los colores y estados alineados con los tokens del tema.
- **Formularios:** `shared/molecules/dynamic-form` genera formularios desde `DynamicFormSchema`, incluidos controles, validaciones, selectores alimentados por `data`/`catalogLoader`, radios y grupos de casillas. Prefiérelo para formularios configurables; crea un formulario específico solo si la interacción no cabe razonablemente en el esquema.
- **Tablas:** `shared/organisms/theme-data-table` recibe columnas y filas; reutilízala para tablas de datos con paginación, orden y filtros. La página debe proporcionar datos y estado de carga/error, no hardcodear una tabla equivalente.
- **Mensajes y carga:** `core/services/toast.service.ts` publica avisos mediante `ToastService`; `app-theme-toast-outlet` ya está montado globalmente en `app.html`. `core/services/message.service.ts` ofrece `alert()` y `confirm()` asíncronos; `app-theme-message-dialog` también está montado globalmente. Para trabajo en curso usa `LoadingService.run()` o `begin()`/`end()` con `try/finally`; `runBatch()` soporta tareas `concurrent` o `sequential`, mensajes por tarea y progreso. `app-theme-loading-overlay` ya está conectado en la raíz: no añadas otro overlay por página. Usa la barra `app-theme-progress` cuando la operación tenga progreso porcentual real.
- **Carga de imágenes:** `shared/organisms/picture-uploader` cubre selección, edición y carga de imagen; `profile-picture-uploader` compone el flujo de foto de perfil y cropper. Reutiliza `CloudinaryUploadService` y `ProfilePictureService`; no implementes llamadas a Cloudinary o persistencia de avatar en las páginas.
- **Protección de formularios públicos:** reutiliza `shared/molecules/turnstile-widget`, `shared/atoms/form-honeypot`, `TurnstileLoaderService` y `PublicFormSubmissionService`. Mantén la verificación del lado servidor; los controles del cliente no sustituyen la validación de Edge Functions.
- **Autenticación y errores:** reutiliza `shared/organisms/login-form`, `AuthService`, guards y el conjunto `shared/atoms/error-code`, `shared/molecules/error-message`, `shared/organisms/error-panel` y `shared/layouts/error-layout`, respetando la configuración de cada subdominio.
- **Tema y navegación:** usa `ThemeService`/`app-theme-toggle` para cambiar el tema y `DomainNavigationService` para enlaces entre subdominios; no construyas lógica paralela basada en `window.location` cuando el servicio ya la cubra.

Si una pantalla requiere un patrón nuevo, primero verifica si puede componerse con estas piezas. Si agregas una capacidad transversal, impleméntala en `core/` o `shared/`, actualiza esta guía y deja las páginas como consumidoras del API compartido.

## Supabase, autenticación y seguridad

- Reutiliza `SupabaseClientService`, `AuthService`, guards y configuración existentes. No crees una segunda fuente de verdad para la sesión.
- Los guards controlan navegación del cliente; no sustituyen autorización ni controles RLS del backend.
- Usa solo la URL del proyecto y la clave publishable en Angular. Nunca incluyas claves `service_role`, `secret`, tokens o credenciales privadas en el cliente, el repositorio, documentación o logs.
- Trata toda entrada del navegador como no confiable. Valida tipos, longitudes y formatos en Edge Functions además de las validaciones de UI.
- No desactives RLS ni inventes tablas, columnas, políticas o relaciones. Inspecciona el esquema real antes de cambios de datos.
- Mantén CORS acotado y coherente; no amplíes orígenes indiscriminadamente. Responde con códigos HTTP adecuados y sin filtrar detalles internos.
- Guarda secretos de Edge Functions en el entorno seguro de Supabase. Consulta `supabase/README.md` para las variables requeridas.

## Imágenes y Cloudinary

- Reutiliza `CloudinaryUploadService` para optimización, progreso y cancelación.
- La autorización de carga se obtiene mediante la Edge Function `cloudinary-signature`; conserva la firma en servidor y la validación de carpeta permitida.
- El cliente puede elegir la carpeta funcional solo dentro de las reglas autorizadas por la Edge Function. No confíes en el nombre de carpeta recibido como autorización.
- Valida tipo y tamaño en el cliente para orientar al usuario y conserva validaciones de servidor. No publiques documentos privados en Cloudinary.
- El uploader de perfil guarda la URL del avatar en metadatos de Supabase Auth; mantén la capa de servicio y los componentes compartidos existentes.

## Pruebas y verificación

- Prioriza pruebas unitarias de servicios, guards, utilidades, validaciones y lógica de routing o autenticación.
- No crees una prueba por cada componente visual. Agrega pruebas de UI solo cuando el componente tenga lógica o estados de interacción cuyo comportamiento sea importante.
- Para lógica de sesión, prueba cambios de configuración y casos límite relevantes.
- Ejecuta verificaciones pertinentes disponibles en `package.json` (build, lint, formato y pruebas) cuando estén dentro del alcance solicitado y el entorno lo permita. No afirmes resultados de comandos que no se ejecutaron.
- No debilites ni elimines pruebas para conseguir un build exitoso. Si una verificación falla por un problema ajeno al cambio, repórtalo separado.

## Formato y validaciones del proyecto

- Usa Prettier según `.prettierrc`; las plantillas usan el parser Angular.
- Comandos disponibles: `npm run build`, `npm run lint`, `npm run format:check` y `npm test -- --watch=false`.
- El servidor de desarrollo permite hosts `*.localhost`; puedes usar subdominios locales configurados en `app.routes.ts`.
- `netlify.toml` define el build y el directorio publicado. Si cambias rutas o salida de build, comprueba que la SPA y los assets sigan siendo compatibles con Netlify.

## Flujo de trabajo y entrega

Para cada tarea:

1. Entiende el objetivo y los criterios de aceptación.
2. Inspecciona el patrón existente y los archivos afectados.
3. Para cambios medianos o amplios, comunica brevemente el enfoque antes de editar.
4. Implementa el cambio mínimo completo que cumpla el objetivo.
5. Ejecuta las verificaciones pertinentes y revisa el diff en busca de regresiones, secretos o cambios accidentales.
6. Resume qué cambió, por qué y cómo se verificó; indica los pendientes relevantes.

No interpretes este archivo como autorización para modificar arquitectura, esquemas, permisos, infraestructura o servicios de producción. En caso de conflicto, prevalecen las instrucciones actuales y explícitas del usuario y los requisitos de seguridad sobre estas convenciones.

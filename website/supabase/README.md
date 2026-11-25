# Configuración de Supabase

Esta carpeta contiene las Edge Functions y los módulos compartidos del proyecto. Antes de desplegar las funciones en cada proyecto remoto de Supabase, configura los secretos que necesita cada una.

## Variables requeridas

| Variable                     | Función                | Tipo                     | Descripción                                                                                                                                                           |
| ---------------------------- | ---------------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLOUDINARY_API_SECRET`      | `cloudinary-signature` | Secreto                  | API Secret de la cuenta de Cloudinary. Solo se usa en la Edge Function; nunca debe incluirse en Angular.                                                              |
| `CLOUDINARY_API_KEY`         | `cloudinary-signature` | Secreto de función       | API Key de Cloudinary que se devuelve al cliente para completar la carga firmada. No es el API Secret.                                                                |
| `CLOUDINARY_CLOUD_NAME`      | `cloudinary-signature` | Configuración de función | Nombre del cloud de Cloudinary.                                                                                                                                       |
| `CLOUDINARY_ALLOWED_FOLDERS` | `cloudinary-signature` | Configuración de función | Lista separada por comas de las carpetas que Angular puede solicitar para obtener una firma. Cada nombre debe coincidir exactamente con el valor enviado por Angular. |

`supabase-ping` no requiere variables de entorno.

## Protección reutilizable para formularios públicos

El boilerplate incluye piezas reutilizables para proteger futuras funciones de envío con Cloudflare Turnstile. No hay todavía un endpoint público de formulario: la galería de Tailwind es solo una muestra visual. Por ello, ninguna pantalla se anuncia como protegida y no se inventa un flujo de contacto, tabla o envío de correo.

### Variables por proyecto

| Variable                                  | Dónde                              | Descripción                                                                                                                            |
| ----------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `turnstileSiteKey`                        | `src/environments/environment*.ts` | Site Key pública de Turnstile. Desarrollo usa la clave oficial de prueba; producción conserva la clave del environment principal.      |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY`         | Secreto de la Edge Function        | Secret Key para Siteverify. Nunca se expone al cliente.                                                                                |
| `CLOUDFLARE_TURNSTILE_EXPECTED_HOSTNAMES` | Configuración de la Edge Function  | Hostnames exactos separados por coma, por ejemplo `example.com,www.example.com`. No incluir protocolo ni ruta.                         |
| `PUBLIC_FORM_ALLOWED_ORIGINS`             | Configuración de la Edge Function  | Orígenes exactos separados por coma, incluyendo protocolo y puerto cuando aplique. CORS no reemplaza Turnstile ni los demás controles. |
| `PUBLIC_FORM_RATE_LIMIT_HASH_SECRET`      | Secreto de la Edge Function        | Secreto aleatorio dedicado para HMAC-SHA256 de la IP. No reutilizar la clave de Turnstile ni las claves de Supabase.                   |

Cada función pública debe definir sus propios límites de acción, por ejemplo 5 envíos por 10 minutos por IP y acción. El límite se configura al invocar `handleProtectedPublicForm`; la base SQL acepta hasta 500 solicitudes y ventanas de hasta 24 horas. Los contadores se guardan en Postgres con un `UPSERT` atómico. Solo se persiste un HMAC de la IP; filas inactivas se limpian en lotes.

`ng serve` usa `environment.development.ts` mediante `fileReplacements` y carga la Site Key oficial de prueba, que funciona con `localhost` y no requiere registrar el hostname. El build de producción usa `environment.ts` y conserva la Site Key real. La Secret Key de prueba está en `supabase/functions/.env.example`; copia ese archivo como `supabase/functions/.env` para el stack local. `.env` está excluido de Git. Nunca pongas una Secret Key en un environment de Angular.

### Preparación de una futura Edge Function

1. Crea la migración con `supabase migration new public_form_rate_limit` y coloca el contenido de [`sql/public-form-rate-limit.sql`](./sql/public-form-rate-limit.sql) en el archivo que genere la CLI.
2. Revisa el SQL y aplícalo en el entorno de desarrollo con el flujo de migraciones de Supabase antes de desplegar la función.
3. Configura los secretos por proyecto, por ejemplo:

```bash
supabase secrets set CLOUDFLARE_TURNSTILE_SECRET_KEY=<turnstile-secret>
supabase secrets set PUBLIC_FORM_RATE_LIMIT_HASH_SECRET=<random-secret>
supabase secrets set CLOUDFLARE_TURNSTILE_EXPECTED_HOSTNAMES=example.com,www.example.com
supabase secrets set PUBLIC_FORM_ALLOWED_ORIGINS=https://example.com,https://www.example.com
```

Para Supabase local, copia `supabase/functions/.env.example` a `supabase/functions/.env`; `supabase start` carga ese archivo para las Edge Functions locales. El secret incluido ahí es solo la clave de prueba pública de Cloudflare. Cambia el valor placeholder del HMAC por un valor aleatorio local.

4. En el handler de la función, crea `corsHeaders` con `createPublicFormCorsHeaders`, rechaza otros orígenes con `rejectDisallowedOrigin`, contesta `OPTIONS` con esos headers y envuelve las respuestas con `applyPublicFormCorsHeaders`. Usa `handleProtectedPublicForm` para que honeypot, formato/tamaño, cuota y Siteverify se validen antes del callback que guarda o envía datos. Configura el hostname y la acción esperados para ese formulario. No registres el token ni la IP.
5. Si la función admite usuarios anónimos, desactiva la verificación JWT solo para esa función en `supabase/config.toml` (`[functions.<slug>] verify_jwt = false`) y despliega solo ese slug. La verificación Turnstile y el limitador siguen siendo obligatorios. Nunca desactives JWT globalmente ni cambies la configuración de `cloudinary-signature` o `supabase-ping` por esta integración.
6. Integra el componente `app-turnstile-widget` y el servicio `PublicFormSubmissionService` en el formulario real. Envía el token de un solo uso y el control honeypot; al expirar o fallar, limpia el token y exige una verificación nueva.

`PublicFormSubmissionService` es una ayuda de cliente para invocar una función y no es una frontera de seguridad. La seguridad se aplica en la Edge Function. El callback de `handleProtectedPublicForm` es el único lugar donde debe ocurrir cualquier efecto secundario.

### Alcance y límites

- Cloudflare tokens expiran a los 5 minutos y solo se pueden validar una vez. El endpoint del servidor comprueba éxito, hostname y `action`; una respuesta vencida, duplicada, con fallo de red o con servicio indisponible se rechaza.
- El limitador falla cerrado si Postgres no responde. Las IP compartidas (por ejemplo oficinas o redes móviles) comparten cuota por acción; ajusta los límites para el tráfico esperado.
- El limitador usa `x-forwarded-for` como IP proporcionada por el proxy de Supabase. No uses cabeceras suministradas por la aplicación ni campos del body para identificar al cliente.
- Este cambio no despliega funciones, secretos ni migraciones remotas. Hasta que una función real use estos módulos y la migración se aplique, no existe protección servidor para ningún formulario del sitio.

## Configuración de secretos

Vincula primero la carpeta con el proyecto remoto que vas a configurar y establece las variables con los valores de esa cuenta:

```bash
supabase link --project-ref <project-ref>
supabase secrets set CLOUDINARY_API_SECRET=<cloudinary-api-secret>
supabase secrets set CLOUDINARY_API_KEY=<cloudinary-api-key>
supabase secrets set CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
supabase secrets set CLOUDINARY_ALLOWED_FOLDERS=profiles,products
```

Repite la configuración para cada proyecto remoto. Los valores del ejemplo son ilustrativos: reemplázalos por los nombres y valores que correspondan. No agregues valores reales a este archivo, al repositorio ni al bundle de Angular. Si el valor de una variable contiene espacios o caracteres especiales, usa el mecanismo de quoting recomendado por tu shell o por la Supabase CLI.

## Carpetas permitidas

`CLOUDINARY_ALLOWED_FOLDERS` debe incluir todos los nombres que la aplicación enviará en la propiedad `folder` al invocar `cloudinary-signature`. Por ejemplo, si Angular envía `profiles`, ese nombre debe estar en la lista. La función rechaza carpetas ausentes de la lista y nombres con caracteres o rutas no admitidos.

Actualiza la lista en Supabase cuando agregues una nueva categoría de carga. La carpeta solicitada se firma junto con el timestamp; Angular debe enviar el mismo valor `folder` al endpoint de carga de Cloudinary.

## Despliegue

Despliega únicamente las funciones de esta plantilla que necesites en el proyecto vinculado:

```bash
supabase functions deploy cloudinary-signature
supabase functions deploy supabase-ping
```

`cloudinary-signature` requiere un JWT válido. `supabase-ping` está configurada sin verificación JWT para que un monitor externo pueda invocarla periódicamente. Es una función pública y ligera que solo devuelve la hora del ping.

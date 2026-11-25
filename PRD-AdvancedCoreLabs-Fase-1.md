# Product Requirements Document (PRD)

## AdvancedCoreLabs --- Sitio web público

**Fase:** 1 --- Landing page comercial\
**Estado:** Borrador funcional para implementación con Codex\
**Idioma del producto:** Español (México)\
**Última actualización:** 8 de noviembre de 2026

------------------------------------------------------------------------

## 1. Resumen del producto

AdvancedCoreLabs necesita un sitio web público que presente la empresa y
sus servicios iniciales a emprendedores y micro y pequeñas empresas,
principalmente en México.

La primera fase consiste en una landing page comercial. Su propósito es
explicar de forma clara qué hace AdvancedCoreLabs, presentar tres
servicios concretos y facilitar que una persona interesada contacte al
equipo.

Este producto **no es todavía la plataforma de herramientas**. Tampoco
incluye registro de usuarios, suscripciones, contratación de módulos ni
la iniciativa CoLab.

### 1.1. Propuesta de valor

**Tu negocio merece herramientas que lo impulsen.**

Creamos soluciones digitales para emprendedores y pequeñas empresas.
Ayudamos a tener presencia en internet, conectar con clientes y
simplificar tareas del negocio mediante soluciones prácticas,
profesionales y accesibles.

La comunicación debe centrarse en los problemas y beneficios para el
negocio, no en vender tecnologías por sí mismas.

## 2. Objetivos

### 2.1. Objetivos principales

1.  Presentar la identidad y propósito de AdvancedCoreLabs.
2.  Comunicar claramente los tres servicios iniciales.
3.  Generar confianza entre emprendedores y pequeños negocios.
4.  Convertir visitas en consultas mediante un formulario de contacto.
5.  Establecer una base técnica sencilla, mantenible y preparada para
    evolucionar.

### 2.2. Indicadores de éxito propuestos

Los siguientes indicadores son recomendaciones para evaluar el sitio; no
se asume que ya exista una plataforma de analítica configurada.

-   Envíos válidos del formulario de contacto.
-   Porcentaje de visitantes que inician y completan el formulario, si
    se implementa analítica compatible.
-   Clics en los CTA principales, si se implementa analítica compatible.
-   Errores de envío del formulario.
-   Rendimiento, accesibilidad y correcta visualización en dispositivos
    habituales.

No fijar metas numéricas hasta contar con una línea base de tráfico y
conversiones.

## 3. Público objetivo

-   Emprendedores que están iniciando un negocio.
-   Micro y pequeñas empresas que necesitan mejorar su presencia
    digital.
-   Negocios que requieren herramientas para resolver problemas
    específicos de su operación.
-   Profesionales independientes que necesitan presentar sus servicios y
    facilitar el contacto.

### 3.1. Necesidades del público

-   Explicar qué ofrece su negocio y cómo contactarlo.
-   Tener una presencia digital profesional sin complejidad innecesaria.
-   Facilitar que otras personas encuentren y compartan la información
    de su negocio.
-   Resolver tareas o procesos concretos con herramientas digitales.
-   Entender qué solución se propone, qué incluye y cómo solicitar
    información.

## 4. Alcance

### 4.1. Incluido en Fase 1

-   Una landing page pública de AdvancedCoreLabs.
-   Navegación entre secciones de la misma página.
-   Presentación de la empresa y su filosofía.
-   Presentación de los tres servicios.
-   Sección breve que explique cómo trabaja AdvancedCoreLabs.
-   Formulario de contacto.
-   Footer con información y enlaces legales disponibles.
-   Diseño responsive.
-   SEO técnico y metadatos básicos.
-   Consideraciones de accesibilidad, seguridad y rendimiento.
-   Pruebas de los comportamientos implementados.

### 4.2. Fuera de alcance

No implementar ni simular en esta fase:

-   Plataforma central de herramientas para emprendedores.
-   Registro, autenticación o perfiles de usuario.
-   Panel de usuario o panel administrativo.
-   Catálogo funcional de módulos o productos contratables.
-   Suscripciones, pagos, facturación o checkout.
-   Gestión de planes recurrentes.
-   Sistema de colaboración CoLab.
-   Registro o administración de colaboradores.
-   Flujos de propuestas colaborativas.
-   Funcionalidades propias de los productos que eventualmente se
    desarrollen como micro apps.
-   Blog o CMS, salvo que el repositorio ya incluya una solución y se
    apruebe expresamente su uso.

La Fase 2 podrá abordar la plataforma de herramientas y CoLab mediante
un PRD independiente.

## 5. Arquitectura de información y contenido

La experiencia inicial se organiza como una landing page de una sola
página.

### 5.1. Navegación

Enlaces sugeridos:

-   Inicio
-   Nosotros / Filosofía
-   Servicios
-   Cómo trabajamos
-   Contacto

Los enlaces deben desplazar al visitante a la sección correspondiente.
No crear rutas independientes sin una necesidad demostrada.

### 5.2. Sección Hero

**Objetivo:** comunicar en pocos segundos qué ofrece AdvancedCoreLabs y
a quién ayuda.

**Título:** \> Tu negocio merece herramientas que lo impulsen.

**Descripción:** \> Creamos soluciones digitales para emprendedores y
pequeñas empresas. Te ayudamos a tener presencia en internet, conectar
con tus clientes y simplificar tareas de tu negocio.

**CTA primario:** Hablemos de tu proyecto.\
Acción: desplazarse a la sección de contacto.

**CTA secundario:** Conoce nuestros servicios.\
Acción: desplazarse a la sección de servicios.

### 5.3. Sección Filosofía

**Título:** \> La tecnología debe trabajar para tu negocio.

**Contenido:** \> Emprender no es sencillo. Cada día implica tomar
decisiones, cuidar recursos y encontrar mejores formas de hacer las
cosas. \> \> Creemos que las herramientas digitales no deberían ser
complicadas ni estar fuera del alcance de los pequeños negocios. Por eso
buscamos soluciones prácticas, bien construidas y pensadas para resolver
necesidades reales. \> \> No se trata de utilizar tecnología por
utilizarla, sino de encontrar nuevas posibilidades para que tu negocio
pueda avanzar.

### 5.4. Sección Servicios

**Título:** \> Soluciones digitales para impulsar tu negocio.

Presentar exactamente estos tres servicios como oferta inicial.

#### Servicio 1 --- Landing Pages

**Nombre:** Landing Pages\
**Título comercial:** Una presencia profesional para tu negocio.

**Descripción:** \> Creamos páginas de aterrizaje que presentan tu
negocio, comunican lo que ofreces y facilitan que tus clientes
potenciales se pongan en contacto contigo mediante un formulario.

**Beneficios a comunicar:** - Presentación profesional del negocio. -
Información clara sobre productos o servicios. - Formulario para recibir
consultas de clientes. - Diseño adaptable a dispositivos móviles.

**CTA:** Quiero una landing page.\
Acción: llevar a contacto y, si es viable, preseleccionar el servicio en
el formulario.

#### Servicio 2 --- Directorio Empresarial

**Nombre:** Directorio Empresarial\
**Título comercial:** Haz que tu negocio sea más fácil de encontrar y
compartir.

**Descripción:** \> Creamos perfiles digitales para empresas y negocios,
con información esencial, una presentación de sus servicios y un código
QR que facilita compartir su perfil.

**Beneficios a comunicar:** - Mini perfil digital para el negocio. -
Información de contacto y presentación comercial. - Código QR para
compartir fácilmente. - Una forma sencilla de acercar el negocio a
nuevos clientes.

**CTA:** Quiero conocer el directorio.\
Acción: llevar a contacto y, si es viable, preseleccionar el servicio en
el formulario.

**Nota:** el nombre "Directorio Empresarial" es descriptivo y
provisional. Confirmar nombre comercial antes de publicar.

#### Servicio 3 --- Micro Apps

**Nombre:** Micro Apps\
**Título comercial:** Herramientas digitales para problemas específicos.

**Descripción:** \> Desarrollamos pequeñas aplicaciones enfocadas en
resolver necesidades concretas de los negocios. Desde simplificar una
tarea hasta organizar mejor un proceso, buscamos que cada herramienta
tenga un propósito claro.

**Beneficios a comunicar:** - Soluciones enfocadas en necesidades
reales. - Funcionalidades sin complejidad innecesaria. - Desarrollo
orientado a facilitar tareas y procesos. - Herramientas diseñadas
alrededor del problema que se necesita resolver.

**CTA:** Cuéntanos qué necesitas resolver.\
Acción: llevar a contacto y, si es viable, preseleccionar el servicio en
el formulario.

### 5.5. Sección Cómo trabajamos

**Título:** \> Primero entendemos tu necesidad. Después construimos la
solución.

Pasos:

1.  **Nos cuentas tu idea:** conocemos tu negocio y lo que necesitas.
2.  **Analizamos la necesidad:** identificamos qué solución tiene
    sentido y cuál es su alcance.
3.  **Desarrollamos la propuesta:** construimos una solución práctica y
    adecuada para tu proyecto.
4.  **Te acompañamos:** buscamos que puedas aprovechar correctamente la
    solución y que siga siendo útil para tu negocio.

No prometer tiempos de entrega, resultados comerciales ni niveles de
soporte que no hayan sido definidos.

### 5.6. Sección Contacto

**Título:** \> ¿Tienes una idea o necesitas resolver algo en tu negocio?

**Descripción:** \> Cuéntanos qué tienes en mente. Podemos ayudarte a
encontrar una solución digital que tenga sentido para tu negocio.

**Campos propuestos:**

  ------------------------------------------------------------------------
  Campo                                    Requerido Notas
  --------------------- ---------------------------- ---------------------
  Nombre                                          Sí Texto

  Correo electrónico                              Sí Validación de formato

  Nombre del negocio                              No Texto

  Servicio de interés                             No Landing Pages,
                                                     Directorio
                                                     Empresarial, Micro
                                                     Apps, Otro

  Mensaje                                         Sí Texto multilínea
  ------------------------------------------------------------------------

**CTA:** Enviar mensaje.

Mostrar estados de envío: - Inicial / listo para completar. -
Enviando. - Enviado correctamente. - Error de validación. - Error de
envío.

En caso de éxito, mostrar una confirmación clara y accesible. En caso de
error, conservar los datos capturados y permitir reintentar.

No mostrar una confirmación de éxito si el backend no ha confirmado el
procesamiento.

### 5.7. Footer

Incluir: - Logotipo de AdvancedCoreLabs. - Descripción breve de la
empresa. - Enlaces de navegación a las secciones. - Medio de contacto
confirmado. - Enlace al aviso de privacidad cuando exista. - Enlace a
términos y condiciones si corresponde. - Año y aviso de derechos
reservados.

No inventar dirección, teléfono, correo, redes sociales ni enlaces
legales.

## 6. Requisitos funcionales

### FR-01 --- Navegación de una página

-   La navegación debe permitir desplazarse a las secciones
    correspondientes.
-   Los enlaces deben funcionar con mouse, teclado y tecnologías de
    asistencia.
-   Debe existir un comportamiento claro para el enlace de inicio.
-   Considerar el espacio ocupado por una cabecera fija al desplazar a
    anclas, si se implementa una cabecera sticky.

### FR-02 --- CTA

-   Los CTA del Hero deben llevar a Servicios o Contacto según
    corresponda.
-   Los CTA de cada servicio deben llevar a Contacto.
-   Cuando el servicio se preseleccione en el formulario, el visitante
    debe poder cambiar la selección.
-   Los CTA deben ser enlaces o botones semánticamente correctos según
    su acción.

### FR-03 --- Formulario de contacto

-   Validar campos requeridos en cliente para mejorar la experiencia.
-   Validar nuevamente en el servidor; la validación del cliente no es
    una medida de seguridad.
-   Validar formato y longitud razonable de los campos.
-   Normalizar espacios innecesarios en los valores de texto.
-   Evitar enviar el formulario más de una vez mientras exista una
    solicitud en curso.
-   Mostrar errores específicos y comprensibles sin exponer detalles
    internos.
-   Conservar los valores ante un error recuperable.
-   Limpiar el formulario únicamente después de una respuesta exitosa
    confirmada.
-   Proteger el endpoint contra abuso y spam antes de producción.
-   No incluir secretos ni credenciales privadas en el frontend.

**Integración pendiente de definición:** el mecanismo de recepción y
almacenamiento del mensaje, el servicio de correo y el endpoint. Codex
debe inspeccionar el repositorio y reportar las integraciones existentes
antes de proponer cambios. No inventar endpoints, tablas, credenciales
ni servicios.

### FR-04 --- Responsive

-   El contenido debe adaptarse a móvil, tablet y escritorio.
-   No debe existir desplazamiento horizontal involuntario.
-   Los textos, tarjetas, navegación y formulario deben seguir siendo
    utilizables en pantallas pequeñas.
-   Las áreas interactivas deben tener tamaño y separación adecuados.

### FR-05 --- Estados de interfaz

-   Los controles interactivos deben mostrar estados hover, focus,
    disabled y loading cuando apliquen.
-   Los estados de error y éxito del formulario deben ser perceptibles
    sin depender exclusivamente del color.
-   Respetar `prefers-reduced-motion` para animaciones no esenciales.

## 7. Requisitos no funcionales

### NFR-01 --- Rendimiento

-   Priorizar carga rápida y una experiencia fluida.
-   Evitar dependencias pesadas si no aportan valor al alcance.
-   Optimizar imágenes y utilizar formatos modernos cuando sea posible.
-   Evitar imágenes grandes cargadas antes de ser necesarias.
-   Evitar JavaScript innecesario.
-   Medir el resultado con herramientas como Lighthouse antes de
    publicar.

No fijar un presupuesto de rendimiento numérico hasta medir el
boilerplate y definir el hosting. Se recomienda establecer objetivos de
Core Web Vitals antes del lanzamiento.

### NFR-02 --- Accesibilidad

-   Usar HTML semántico.
-   Mantener jerarquía correcta de encabezados.
-   Todos los controles deben ser operables por teclado.
-   Mostrar indicador de foco visible.
-   Asociar etiquetas a los campos del formulario.
-   Proporcionar mensajes de error accesibles.
-   Utilizar textos alternativos descriptivos en imágenes informativas.
-   Mantener contraste suficiente.
-   No comunicar información únicamente mediante color.

Tomar WCAG 2.2 nivel AA como referencia objetivo, sujeto a validación.

### NFR-03 --- SEO

-   Definir título y descripción únicos para la página.
-   Configurar idioma español de México (`es-MX`) cuando corresponda.
-   Configurar canonical si el dominio de producción ya está definido.
-   Incluir Open Graph básico.
-   Generar o configurar sitemap y robots.txt según el entorno de
    publicación.
-   Utilizar encabezados semánticos y contenido textual rastreable.
-   Optimizar nombres y textos alternativos de imágenes.
-   No indexar entornos de desarrollo o staging.
-   No agregar datos estructurados de negocio con información inventada.
    Implementarlos cuando se confirmen los datos oficiales.

### NFR-04 --- Seguridad y privacidad

-   No exponer secretos en el bundle del frontend.
-   Validar y sanitizar datos en el servidor.
-   Implementar protección anti-spam y rate limiting en el punto de
    entrada del formulario.
-   Considerar honeypot y/o mecanismos adicionales de protección,
    evitando depender exclusivamente de ellos.
-   Evitar mostrar errores internos, trazas o información sensible.
-   Recabar únicamente los datos necesarios para atender la consulta.
-   Publicar el aviso de privacidad correspondiente antes de recopilar
    datos reales.
-   No asumir que ocultar un endpoint o validar en el navegador protege
    el formulario.

### NFR-05 --- Mantenibilidad

-   Seguir las convenciones y arquitectura que realmente existan en el
    repositorio.
-   Mantener componentes pequeños y con responsabilidades claras.
-   Evitar duplicación de contenido y estilos.
-   Reutilizar componentes existentes cuando sea razonable.
-   No introducir abstracciones o librerías que no aporten valor al
    alcance.
-   Añadir pruebas para los comportamientos críticos.

## 8. Consideraciones técnicas para Codex

El documento de referencia del boilerplate disponible para el proyecto
describe:

-   Angular 20, componentes standalone y signals.
-   Tailwind CSS 4.
-   Vitest para pruebas.
-   Organización basada en Atomic Design + separación MVC.
-   Carpetas de referencia: `core`, `shared`, `templates`, `pages`,
    `assets` y `environments`.
-   Aliases documentados: `@core/*`, `@shared/*`, `@templates/*`,
    `@pages/*`, `@assets/*` y `@env`.
-   Scripts documentados para start, build, lint, format y test.

**Importante:** ese documento es una referencia, no una garantía de que
el repositorio actual conserve exactamente esas versiones, dependencias,
scripts o convenciones. Antes de modificar código, Codex debe
inspeccionar el repositorio y verificar su configuración real
(`package.json`, configuración Angular, TypeScript, Tailwind, rutas,
estructura y scripts).

### 8.1. Instrucciones de implementación

1.  Inspeccionar la estructura y configuración actuales.
2.  Identificar componentes, estilos, fuentes, logotipo y recursos
    existentes.
3.  Identificar convenciones de nombres, aliases y generadores
    disponibles.
4.  Identificar integraciones existentes para formulario, correo o
    backend, sin asumir que están configuradas.
5.  Presentar un breve resumen de hallazgos y discrepancias respecto a
    este PRD.
6.  Proponer una implementación que respete el boilerplate y minimice
    dependencias.
7.  Implementar únicamente el alcance de Fase 1.
8.  Ejecutar lint, pruebas y build con los scripts disponibles.
9.  Reportar archivos modificados, pruebas ejecutadas, resultados y
    decisiones pendientes.

No migrar versiones ni reemplazar librerías como parte de esta tarea,
salvo que sea imprescindible y se solicite aprobación.

## 9. Historias de usuario

### US-01 --- Comprender la oferta

Como visitante, quiero entender rápidamente qué hace AdvancedCoreLabs
para saber si sus servicios pueden ayudar a mi negocio.

**Criterios de aceptación:** - El Hero comunica público y propuesta de
valor. - Los tres servicios aparecen claramente identificados. - El
contenido evita lenguaje técnico innecesario.

### US-02 --- Conocer un servicio

Como emprendedor, quiero consultar qué incluye cada servicio para
identificar cuál responde a mi necesidad.

**Criterios de aceptación:** - Cada servicio tiene título, descripción,
beneficios y CTA. - El CTA lleva a la sección de contacto. - No se
muestran precios no aprobados ni promesas no verificadas.

### US-03 --- Contactar a AdvancedCoreLabs

Como visitante interesado, quiero enviar una consulta para recibir
información sobre un servicio.

**Criterios de aceptación:** - El formulario muestra los campos
definidos. - Los campos requeridos se validan. - Se informa claramente
el estado de envío. - Solo se muestra éxito después de confirmar el
procesamiento. - Los errores permiten corregir o reintentar.

### US-04 --- Navegar desde un dispositivo móvil

Como visitante móvil, quiero navegar y consultar los servicios sin
dificultades.

**Criterios de aceptación:** - No existe overflow horizontal
involuntario. - Navegación, tarjetas y formulario son utilizables. - Los
textos mantienen legibilidad. - Los controles pueden operarse con
teclado y tecnologías de asistencia.

## 10. Criterios de aceptación globales

La Fase 1 se considera lista para revisión cuando:

-   [ ] La landing page contiene todas las secciones definidas.
-   [ ] El contenido comunica la propuesta de valor aprobada.
-   [ ] Se presentan únicamente los tres servicios iniciales.
-   [ ] Los CTA navegan a las secciones correctas.
-   [ ] El formulario valida y procesa los datos mediante una
    integración aprobada.
-   [ ] Los estados de éxito y error funcionan correctamente.
-   [ ] La página es responsive.
-   [ ] Se verifican navegación por teclado y etiquetas del formulario.
-   [ ] Se incluyen metadatos SEO básicos.
-   [ ] No hay secretos expuestos en el frontend.
-   [ ] No se implementan funcionalidades de Fase 2.
-   [ ] Las pruebas disponibles pasan.
-   [ ] El build de producción termina correctamente.
-   [ ] Se documentan las configuraciones externas necesarias para
    publicar.

## 11. Supuestos y decisiones pendientes

Codex no debe resolver estas decisiones mediante suposiciones. Debe
identificarlas y, cuando afecten la implementación, solicitar
confirmación antes de introducir una dependencia o integración.

1.  **Nombre del Directorio Empresarial:** "Directorio Empresarial" es
    provisional.
2.  **Correo y contacto oficial:** confirmar qué dirección y medios
    deben publicarse.
3.  **Formulario:** confirmar backend, endpoint, almacenamiento,
    servicio de correo y destinatarios.
4.  **Aviso de privacidad:** proporcionar el texto y URL oficiales.
5.  **Dominio y hosting:** confirmar dominio de producción y estrategia
    de despliegue.
6.  **Identidad visual:** confirmar logotipo, paleta, tipografías y
    recursos aprobados.
7.  **Analítica:** decidir si se instalará una herramienta de analítica
    y qué eventos se medirán. No agregar trackers por defecto.
8.  **Imágenes e ilustraciones:** definir recursos aprobados; no
    utilizar fotografías genéricas que contradigan la identidad de la
    marca.
9.  **Precios:** no publicar precios hasta validar costos y modelo
    comercial.
10. **Alcance de Micro Apps:** esta página comunica el servicio de
    desarrollo; no implica que exista un catálogo o producto listo para
    contratar.

## 12. Roadmap futuro --- Fuera de esta entrega

### Fase 2 --- Ecosistema de herramientas AdvancedCoreLabs

Se evaluará y especificará por separado: - Plataforma de herramientas
para emprendedores. - Productos y módulos propios. - Cuentas y
autenticación. - Gestión de módulos y funcionalidades. - Planes,
suscripciones y pagos, si el modelo comercial lo requiere. -
Administración de la plataforma.

### CoLab

La iniciativa de colaboración también se definirá en una etapa futura y
contará con su propio alcance, reglas operativas y documentación. No
construir formularios, páginas ni flujos de CoLab en Fase 1.

------------------------------------------------------------------------

## 13. Instrucción inicial sugerida para Codex

Utiliza este PRD como fuente de requisitos para la Fase 1 del sitio
público de AdvancedCoreLabs.

Antes de escribir o modificar código:

1.  Inspecciona el repositorio y sus instrucciones locales (`AGENTS.md`,
    README y documentación relevante).
2.  Verifica las versiones, scripts, estructura y convenciones reales.
3.  Compara los hallazgos con la sección de consideraciones técnicas de
    este PRD.
4.  Identifica decisiones pendientes que bloqueen una implementación
    correcta.
5.  Propón un plan breve y ordenado de implementación.

No implementes la Fase 2 ni CoLab. No inventes datos de contacto,
integraciones, endpoints, precios, contenido legal o capacidades
comerciales. Mantén la solución simple, accesible, segura y consistente
con el boilerplate existente.

**Entregable esperado:** landing page funcional de AdvancedCoreLabs,
responsive, probada y lista para revisión, junto con un resumen de
cambios, pruebas y configuraciones pendientes.

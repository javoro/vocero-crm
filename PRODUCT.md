# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Empresas mexicanas, directores de operaciones, equipos de ventas y atención al cliente que gestionan conversaciones, cotizaciones y prospectos comerciales a través de WhatsApp mediante agentes de inteligencia artificial y supervisión humana.

## Product Purpose

Agentia CRM es el centro de control operativo y conversacional para empresas que integran agentes de IA de AgentiaMX en WhatsApp. Permite monitorear la bandeja en tiempo real, intervenir conversaciones (escalamiento humano), gestionar oportunidades en el pipeline comercial, dar seguimiento a citas y evaluar el comportamiento de los agentes mediante un laboratorio de pruebas.

## Positioning

A diferencia de los CRM tradicionales o plataformas SaaS de "caja negra" con infraestructura compartida, Agentia CRM se despliega sobre la infraestructura y datos bajo control directo de cada empresa. Los datos de clientes y conversaciones nunca son revendidos ni retenidos en silos de terceros.

## Operating Context

- Bandeja de WhatsApp multi-agente con recepción y envío en tiempo real vía Server-Sent Events (SSE).
- Pipeline comercial visual (Kanban) con seguimiento de etapas, prioridades y montos en MXN.
- Laboratorio de evaluación ("Lab") para probar prompts, tool calling y consistencia del agente antes de producción.
- Agenda de citas y ficha de contacto sincronizada con WhatsApp.
- Soporte de marca blanca / personalización y operación continua en tema claro y tema oscuro.

## Capabilities and Constraints

- Aplicación web responsiva construida sobre Next.js 15 (App Router), React 19 y Tailwind CSS.
- Persistencia local y controlada con SQLite / Drizzle ORM o PostgreSQL.
- Moneda base predeterminada: **MXN ($ Pesos Mexicanos)** con manejo exacto en centavos enteros.
- Identidad visual integrada con la paleta de AgentiaMX (Menta Tech `#1EB894`, Océano Profundo `#086B89`, Azul Marino `#012B51`).
- Acceso seguro mediante autenticación con roles (propietario, agente de equipo).

## Brand Commitments

La marca del sistema es **Agentia CRM**, parte del ecosistema **AgentiaMX** ([agentiamx.com](https://agentiamx.com/)). Emplea el logotipo oficial de AgentiaMX y se comunica en español de México con un tono profesional, tecnológico, directo y enfocado en la agilidad operativa y la transparencia.

## Evidence on Hand

- Sistema de diseño y tokens en `src/app/globals.css` y `tailwind.config.ts`.
- Módulo de white-labeling y accesibilidad de color en `src/lib/branding.ts`.
- Activos gráficos oficiales (`logo.png`, `logo-v2.png`, `favicon.svg`) en `public/assets/img/`.
- Especificación de diseño Stitch Impeccable en `DESIGN.md`.

## Product Principles

1. **Control y Soberanía de Datos**: Cada empresa es dueña de su base de datos, credenciales y conversaciones.
2. **Claridad Operativa y Cero Fricción**: Interfaz rápida, sin sobrecarga visual, con respuesta instantánea a cada mensaje.
3. **Supervisión Humana Fluida**: Transición natural entre la atención del agente de IA y la intervención de un operador humano.
4. **Accesibilidad y Rigor Visual**: Cumplimiento estricto de WCAG 2.2 AA (contraste 4.5:1, foco visible y soporte de modo oscuro sin deslumbrar).

## Accessibility & Inclusion

Toda la interfaz es navegable mediante teclado con anillos de foco explícitos, ratios de contraste verificados según WCAG 2.2, soporte de reducción de movimiento y soporte completo de tema claro y tema oscuro.

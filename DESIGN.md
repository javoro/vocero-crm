# Design System — Agentia CRM

<!-- impeccable:design-schema 1 -->

## Brand Identity

Agentia CRM viste la identidad visual de **AgentiaMX** ([agentiamx.com](https://agentiamx.com/)). Combina la precisión y sobriedad de una herramienta de misión crítica con la vitalidad y frescura del verde menta tecnológico (`#1EB894`) y el azul marino corporativo (`#012B51`).

- **Tono**: Profesional, de alta confianza, ágil, sin distracciones y tecnológico.
- **Wordmark**: `agentia` (Navy / Blanco) + `CRM` / `mx` (Menta `#1EB894`).
- **Isotipo**: Icono oficial hexagonal/conectores de AgentiaMX.

---

## Colors

Sistema de color con tokens semánticos resueltos para tema claro y tema oscuro sin hex sueltos en componentes.

### 1. Paleta de Marca

| Token | Tema Claro | Tema Oscuro | Propósito |
| :--- | :--- | :--- | :--- |
| `--accent` | `#1EB894` | `#1EB894` | Acento primario, botones principales, foco |
| `--accent-hover` | `#179678` | `#28d4ab` | Estado hover de acciones primarias |
| `--accent-deep` | `#086B89` | `#0ea5c6` | Cian oceánico para degradados y énfasis |
| `--accent-soft` | `#D6F4EC` | `#133830` | Fondos de chips activos, badges |
| `--accent-tint` | `#EEF9F6` | `#0d241f` | Filas seleccionadas, fondo de navegación activa |
| `--accent-text` | `#0E634F` | `#70E4C8` | Tinta de texto sobre fondo con tinte de acento |
| `--accent-fg` | `#012B51` / `#FFFFFF` | `#0B141A` | Tinta de contraste sobre fondo de acento sólido |

### 2. Superficies y Neutros

| Token | Tema Claro | Tema Oscuro | Propósito |
| :--- | :--- | :--- | :--- |
| `--bg` | `#FFFFFF` | `#0B141A` | Lienzo principal |
| `--bg-subtle` | `#F6FAFB` | `#111B21` | Barra lateral de navegación y fondos secundarios |
| `--bg-panel` | `#F0F4F7` | `#1F2C34` | Paneles de control, fichas de contacto y tarjetas |
| `--bg-hover` | `#E8F0F3` | `#2A3942` | Estado hover de filas y botones secundarios |
| `--text` | `#012B51` | `#E9EDEF` | Texto primario de máximo contraste |
| `--text-2` | `#334E68` | `#8696A0` | Texto secundario y etiquetas |
| `--text-3` | `#627D98` | `#667781` | Texto terciario, placeholders y metadatos |
| `--border` | `#DCE7EB` | `#222D34` | Bordes divisorios estándar |
| `--border-strong` | `#BCCCDC` | `#374248` | Bordes de inputs, controles y selects |

### 3. Estados Semánticos

| Estado | Token Base | Tint (Fondo) | Soft (Borde) | Text (Tinta) |
| :--- | :--- | :--- | :--- | :--- |
| **Éxito / WhatsApp** | `#00A884` | `#E6F7F3` | `#B3E8DD` | `#006E56` |
| **Alerta** | `#D97706` | `#FEF3C7` | `#FDE68A` | `#92400E` |
| **Peligro** | `#EF4444` | `#FEE2E2` | `#FECACA` | `#991B1B` |
| **Info** | `#086B89` | `#E0F2FE` | `#BAE6FD` | `#075985` |

---

## Typography

- **Display & Logotipo**: `Poppins` (Pesos 600, 700). Letra nítida, geométrica y con alta presencia.
- **UI & Contenido**: `Instrument Sans` / `Geist` (Pesos 400, 500, 600). Legibilidad óptima en tablas, chat y listas densas.
- **Monospace**: `IBM Plex Mono` (Pesos 400, 500) para montos, IDs de mensajes, teléfonos y timestamps.

---

## Elevation & Surfaces

- **Radio de esquinas**:
  - `--radius-sm`: `6px` (badges, chips, botones compactos)
  - `--radius`: `10px` (inputs, tarjetas, modales de formulario)
  - `--radius-lg`: `14px` (cajón lateral de lead, diálogos)
- **Sombras**:
  - `--shadow-sm`: `0 1px 2px rgba(1, 43, 81, 0.06)`
  - `--shadow-md`: `0 6px 20px -6px rgba(1, 43, 81, 0.12)`
  - `--shadow-pop`: `0 12px 32px -8px rgba(1, 43, 81, 0.20)`

---

## Components

| Componente | Reglas de Diseño |
| :--- | :--- |
| **Botón Primario** | Fondo `--accent`, texto `#FFFFFF` (o `#012B51` si acento claro), hover `--accent-hover`, radio `--radius-sm`. Un solo botón primario por vista principal. |
| **Botón Secundario** | Fondo transparente o `--bg-panel`, borde `--border-strong`, texto `--text`, hover `--bg-hover`. |
| **Inputs & Formularios** | Borde siempre `--border-strong` (nunca `--border-sutil`), foco con anillo `--accent` y outline offset. |
| **Bandeja de Conversaciones** | Fila activa con fondo `--accent-tint` y texto `--accent-text`. Indicador no leído con badge `--accent`. |
| **Burbujas de Chat** | Mensaje entrante en `--bg-panel`, mensaje saliente en verde WhatsApp / Agentia (`--bubble-out`). |
| **Pipeline Kanban** | Columnas en `--bg-panel`, tarjetas con elevación `--shadow-sm`, montos formateados en `MXN`. |

---

## Accessibility Rules

- **AG-A1 (Contraste)**: Todo texto sobre cualquier superficie cumple ratio de contraste mínimo de 4.5:1 (texto normal) o 3:1 (texto grande e iconos de control).
- **AG-A2 (Foco Visible)**: Todo control interactivo muestra `:focus-visible` con anillo `--accent` de 2px a 3px y offset de 2px.
- **AG-A3 (Indicadores no solo por color)**: Los estados llevan siempre icono y texto explicativo adicional al color del badge.
- **AG-A4 (Dark Mode Nativo)**: Soporte completo sin flash en SSR mediante `data-theme="dark"`.

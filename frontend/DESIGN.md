---
name: Institutional Intelligence
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c3c5d9'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#8d90a2'
  outline-variant: '#434656'
  surface-tint: '#b7c4ff'
  primary: '#b7c4ff'
  on-primary: '#002682'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#004ced'
  secondary: '#b7c8e1'
  on-secondary: '#213145'
  secondary-container: '#3a4a5f'
  on-secondary-container: '#a9bad3'
  tertiary: '#bec6e0'
  on-tertiary: '#283044'
  tertiary-container: '#5e667d'
  on-tertiary-container: '#dde4ff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Work Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-max: 1440px
  gutter: 20px
---

## Brand & Style

This design system is engineered for high-stakes financial environments where speed of comprehension and perceived authority are paramount. The brand personality is clinical, precise, and sophisticated—evoking the feeling of a high-end Bloomberg terminal refined for a modern web experience. 

The design style follows a **Corporate / Modern** movement with a focus on data density and "Information First" architecture. It prioritizes clarity over decoration, utilizing a structured hierarchy to guide users through complex market fluctuations without cognitive overload. The aesthetic is "High-Resolution," characterized by sharp rendering, subtle dividers, and a strict adherence to a grid system that suggests stability and institutional reliability.

## Colors

The palette is anchored by a "Deep Navy" foundation to reduce eye strain during long trading sessions and to project professional gravity. 

- **Primary:** A vibrant "Electric Blue" used for active states, primary actions, and brand highlights. 
- **Neutral/Surface:** A range of slate grays and deep indigos provide the backdrop for data visualization. 
- **Semantic Colors:** Success (Green) and Danger (Red) are highly saturated to ensure instant recognition of market trends (Bullish vs. Bearish).
- **Backgrounds:** Use a tiered dark system where the base is the darkest, and cards/containers are slightly lighter to create structural depth.

## Typography

This design system utilizes **Inter** for its exceptional readability at small sizes and its neutral, systematic character. For numerical data, the `tnum` (tabular figures) OpenType feature must be enabled to ensure numbers align perfectly in columns, facilitating quick vertical scanning of price changes.

**Work Sans** is introduced for labels and metadata to provide a subtle distinction from body content, utilizing its slightly wider apertures to maintain legibility in condensed layouts. Bold weights are reserved for critical price points and headings, while medium weights are used to define information hierarchy in complex tables.

## Layout & Spacing

The layout employs a **12-column fluid grid** for dashboard views, transitioning to a **fixed grid** for marketing and landing pages. To accommodate high data density, the system uses a tight 4px baseline rhythm.

- **Data Tables:** Use "Compact" (8px vertical padding) or "Standard" (12px vertical padding) modes.
- **Margins:** Page margins are set to 32px on desktop to provide breathing room against the dense central data widgets.
- **Gutters:** 20px gutters ensure that even when columns are packed with text, the visual separation remains clear.

## Elevation & Depth

This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a flat, modern appearance that feels fast and performant.

- **Surface 0:** The base background (#0F172A).
- **Surface 1:** Primary cards and widgets, using a subtle border (1px solid #1E293B).
- **Surface 2:** Modals and dropdowns, featuring a 1px border and a soft, large-radius ambient shadow (0px 10px 30px rgba(0,0,0,0.5)) to create separation from the dashboard layer.
- **Interaction:** Hover states should be indicated by a subtle lightening of the surface color or a primary-colored left border accent for list items.

## Shapes

The shape language is **Soft (0.25rem)** to strike a balance between the clinical sharpness of traditional finance and the approachability of modern SaaS. 

- **Buttons & Inputs:** Use the standard 4px radius.
- **Cards/Containers:** Use 8px (rounded-lg) to provide a clear container for grouped data.
- **Graphs/Charts:** Sparklines and line charts should use a stroke width of 2px with slight smoothing, though not overly rounded, to preserve the accuracy of the data peaks.

## Components

- **Data Tables:** The core component. Must support sticky headers, sort indicators, and row-level "Quick Actions." Zebra striping is discouraged; use subtle 1px dividers instead.
- **Buttons:** 
  - *Primary:* Solid Electric Blue with white text. 
  - *Secondary:* Ghost style with a slate border. 
  - *Action:* "Buy" (Green) and "Sell" (Red) buttons with high-contrast white text.
- **Sparklines:** Compact, monochromatic line charts embedded in tables to show 24h trends. They inherit the color of the current price trend (Green/Red).
- **Input Fields:** Darker than the surface color with a 1px border. The focus state uses a 2px Electric Blue ring.
- **Chips/Badges:** Small, pill-shaped indicators for "New," "Volatile," or "Watchlist." Use low-opacity background fills of the semantic color with high-opacity text (e.g., light green text on dark green 15% opacity background).
- **Trend Indicators:** Up/Down chevrons paired with percentage changes, strictly color-coded for instant trend analysis.
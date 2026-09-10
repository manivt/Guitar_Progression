# Styling & CSS Architecture

## Overview

The application uses standard modern CSS structured into modular stylesheets loaded via `src/styles/global.css`. It relies exclusively on CSS Custom Properties (Design Tokens), avoiding heavy CSS-in-JS runtimes, utility libraries, or CSS preprocessors.

## File Organization

```
src/styles/
├── global.css       # Root entry point importing all partials in cascading order
├── variables.css    # Design tokens (colors, typography, spacing, shadows, radius)
├── reset.css        # Box sizing, margin normalization, modern CSS reset
├── typography.css   # Heading styles, font scales, line-height definitions
├── layout.css       # Container, grid systems, sticky headers, page sections
├── components.css   # Reusable UI component styling (cards, modals, badges, forms)
└── responsive.css   # Media queries, mobile optimizations, and touch target rules
```

## Design Tokens (`variables.css`)

### Color Palette
- `--color-primary`: Deep slate for high-contrast text and primary brand elements.
- `--color-surface`: Background color for cards, panels, and modals (`#ffffff`).
- `--color-surface-hover`: Subtle hover state background (`#f8fafc`).
- `--color-border`: Border lines for structural boundaries (`#e2e8f0`).
- `--color-border-focus`: High-visibility focus indicators for accessibility (`#2563eb`).
- `--color-accent`: Musical highlight accents (`#d97706`).
- `--color-danger`: Destructive actions and form error highlights (`#dc2626`).

### Layout & Aspect Ratios
- `--content-width`: Maximum reading/grid width (`1200px`).
- `--thumbnail-aspect`: Standard YouTube widescreen ratio (`16 / 9`).

### Spacing Scale
Consistent 4px/8px modular scale:
- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-5`: `24px`
- `--space-6`: `32px`
- `--space-7`: `48px`

## Key Implementation Patterns

### 1. Zero Inline Styles
All components use declarative class names defined in `components.css`:
- `.empty-state-error`: Error feedback in `HomePage`.
- `.modal-actions`: Responsive button groups in `VideoModal`.
- `.not-found-page`, `.not-found-code`, `.not-found-title`: Centered 404 display in `NotFoundPage`.

### 2. Semantic Accessibility & Touch Targets
- **Card Action Buttons:** `PerformanceCard` wraps its interactive surface in `.card-button` with `:focus-visible` outlines.
- **Mobile Touch Targets:** In `responsive.css`, `@media (hover: none) and (pointer: coarse)` enforces `min-height: 44px` and `min-width: 44px` on all buttons and form controls to satisfy WCAG touch accessibility guidelines.

### 3. Motion Accessibility
- `@media (prefers-reduced-motion: reduce)` automatically disables transitions and keyframe animations (`fadeIn`, `slideUp`, `slideIn`) for users who have requested reduced motion in their OS preferences.

### 4. Light and Dark Themes
- Dark-mode tokens are defined on `:root` as the default; light-mode overrides are scoped to `:root[data-theme='light']`.
- A small inline bootstrap script in `index.html` applies a saved preference or the dark default before the application renders, preventing a theme flash.
- `ThemeToggle` stores explicit visitor choices under `guitar-journey-theme` in `localStorage`.
- The browser `theme-color` metadata is synchronized with the active theme for compatible mobile browser chrome.

### 5. Site Icon
- `public/favicon.svg` uses a simplified electric-guitar silhouette in the site's charcoal and gold palette so it remains recognizable at browser-tab sizes.

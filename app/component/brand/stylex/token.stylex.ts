import * as stylex from "@stylexjs/stylex"

export const token = stylex.defineVars({
  colorScheme: "light",
  shapeSurface: "var(--bridge-surface-radius, 0.875em)",
  shapePill: "var(--bridge-pill-radius, 9999em)",
  fontBody: "var(--bridge-font-body, 'Geist Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontHeading: "var(--bridge-font-heading, 'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontNumber: "var(--bridge-font-number, InterVariable, Inter, sans-serif)",
  highlight: `var(--bridge-color-highlight, oklch(0.145 0 0))`,
  highlightForeground: `var(--bridge-color-highlight-foreground, oklch(1 0 0))`,
  brand: `var(--bridge-color-brand, oklch(0.8874 0.182 166.87))`,
  brandForeground: `var(--bridge-color-brand-foreground, oklch(0.145 0 0))`,
  brandText: `var(--bridge-color-brand-text, oklch(0.45 0.14 166.87))`,
  brandAccent: `var(--bridge-color-brand-accent, oklch(0.500137 0.29406 284.0716))`,
  brandAccentForeground: `var(--bridge-color-brand-accent-foreground, oklch(1 0 0))`,
  warning: `var(--bridge-color-warning, oklch(0.58 0.1793 34.97))`,
  warningForeground: `var(--bridge-color-warning-foreground, oklch(1 0 0))`,
  card: `var(--bridge-color-surface, oklch(1 0 0))`,
  cardForeground: `var(--bridge-color-surface-foreground, oklch(0.145 0 0))`,
  popover: `var(--bridge-color-popover, oklch(1 0 0))`,
  popoverForeground: `var(--bridge-color-popover-foreground, oklch(0.145 0 0))`,
  sidebar: `var(--bridge-color-sidebar, oklch(0.985 0 0))`,
  sidebarForeground: `var(--bridge-color-sidebar-foreground, oklch(0.145 0 0))`,
  sidebarPrimary: `var(--bridge-color-sidebar-primary, oklch(0.205 0 0))`,
  sidebarPrimaryForeground: `var(--bridge-color-sidebar-primary-foreground, oklch(0.985 0 0))`,
  sidebarAccent: `var(--bridge-color-sidebar-accent, oklch(0.97 0 0))`,
  sidebarAccentForeground: `var(--bridge-color-sidebar-accent-foreground, oklch(0.205 0 0))`,
  sidebarBorder: `var(--bridge-color-sidebar-border, oklch(0.922 0 0))`,
  sidebarRing: `var(--bridge-color-sidebar-ring, oklch(0.708 0 0))`,
  accent: `var(--bridge-color-accent, oklch(0.97 0 0))`,
  accentForeground: `var(--bridge-color-accent-foreground, oklch(0.205 0 0))`,
  tabInactive: "oklch(0.145 0 0 / 60%)",
  tabActiveBackground: `var(--bridge-color-accent, oklch(1 0 0))`,
  tabActiveBorder: `var(--bridge-color-border, transparent)`,
  footerBorder: `var(--bridge-color-border, oklch(0.922 0 0))`,
  switchOff: `var(--bridge-color-input, oklch(0.922 0 0))`,
  switchThumb: `var(--bridge-color-background, oklch(1 0 0))`,
  switchThumbOn: `var(--bridge-color-background, oklch(1 0 0))`,
  errorRingOpacity: "20%",
  outlineExpanded: "oklch(0.97 0 0)",
  errorText: `var(--bridge-color-destructive-text, oklch(0.5489 0.1841 25.69))`,
  destructiveText: `var(--bridge-color-destructive-text, oklch(0.5489 0.1841 25.69))`,
  inputBackground: "transparent",
  inputDisabled: `var(--bridge-color-input, oklch(0.922 0 0 / 50%))`,
  invalidBorder: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69))`,
  outlineFocus: `var(--bridge-color-ring, oklch(0.708 0 0))`,
  outlineHover: `var(--bridge-color-accent, oklch(0.97 0 0))`,
  ghostHover: `var(--bridge-color-accent, oklch(0.97 0 0))`,
  destructiveHoverOpacity: "20%",
  outlineBackground: `var(--bridge-color-background, oklch(1 0 0))`,
  outlineBorder: `var(--bridge-color-border, oklch(0.922 0 0))`,
  destructiveOpacity: "10%",
  background: `var(--bridge-color-background, oklch(1 0 0))`,
  foreground: `var(--bridge-color-foreground, oklch(0.145 0 0))`,
  primary: `var(--bridge-color-primary, oklch(0.205 0 0))`,
  primaryForeground: `var(--bridge-color-primary-foreground, oklch(0.985 0 0))`,
  secondary: `var(--bridge-color-secondary, oklch(0.2178 0 0))`,
  secondaryForeground: `var(--bridge-color-secondary-foreground, oklch(0.985 0 0))`,
  muted: `var(--bridge-color-muted, oklch(0.97 0 0))`,
  mutedForeground: `var(--bridge-color-muted-foreground, oklch(0.556 0 0))`,
  border: `var(--bridge-color-border, oklch(0.922 0 0))`,
  input: `var(--bridge-color-input, oklch(0.922 0 0))`,
  ring: `var(--bridge-color-ring, oklch(0.708 0 0))`,
  destructive: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69))`,
  destructiveForeground: `var(--bridge-color-destructive-foreground, oklch(1 0 0))`
})

// `defineConsts` (not a plain object) so StyleX's cross-file constant folding emits a
// single shared `:root` custom-property definition instead of silently referencing an
// undefined `var(--xHASH)` — see `geometryToken` below for the full explanation. This
// token is consumed from many files (Input, Dialog, Popover, Card, MetricTile, and more).
export const themeToken = stylex.defineConsts({
  background: `var(--bridge-color-background, ${token.background})`,
  foreground: `var(--bridge-color-foreground, ${token.foreground})`,
  primary: `var(--bridge-color-primary, ${token.primary})`,
  primaryForeground: `var(--bridge-color-primary-foreground, ${token.primaryForeground})`,
  surface: `var(--bridge-color-surface, ${token.card})`,
  surfaceForeground: `var(--bridge-color-surface-foreground, ${token.cardForeground})`,
  popover: `var(--bridge-color-popover, ${token.popover})`,
  popoverForeground: `var(--bridge-color-popover-foreground, ${token.popoverForeground})`,
  border: `var(--bridge-color-border, ${token.border})`,
  input: `var(--bridge-color-input, ${token.input})`,
  muted: `var(--bridge-color-muted, ${token.muted})`,
  mutedForeground: `var(--bridge-color-muted-foreground, ${token.mutedForeground})`,
  ring: `var(--bridge-color-ring, ${token.ring})`
})

// Effect colors (effect-color-token DEC-001): one public shadow color; each recipe owns
// its own alpha step and geometry. `color-mix(black N%, transparent)` equals the prior
// `rgb(0 0 0 / N%)` output, so defaults render unchanged.
export const effectToken = stylex.defineConsts({
  backdrop: "var(--bridge-color-backdrop, rgb(0 0 0 / 10%))",
  shadowXs: `0 1px 2px color-mix(in oklab, var(--bridge-color-shadow, black) 5%, transparent)`,
  shadowSm: `0 1px 3px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent)`,
  shadowMd: `0 4px 6px -1px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent), 0 2px 4px -2px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent)`,
  shadowLg: `0 10px 15px -3px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent), 0 4px 6px -4px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent)`,
  shadowXl: `0 20px 25px -5px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent), 0 8px 10px -6px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent)`,
  shadowFloat: `0 8px 24px color-mix(in oklab, var(--bridge-color-shadow, black) 12%, transparent)`,
  shadowArrow: `0 4px 6px -1px color-mix(in oklab, var(--bridge-color-shadow, black) 10%, transparent)`,
  shadowDepth: `0 6px 14px -6px color-mix(in oklab, var(--bridge-color-shadow, black) 28%, transparent)`,
  shadowInsetEdge: `inset 0 0 0 1px color-mix(in oklab, var(--bridge-color-shadow, black) 8%, transparent)`,
  shadowCard: `0 1px 2px color-mix(in oklab, var(--bridge-color-shadow, black) 6%, transparent)`,
  shadowBoard: `0 12px 32px color-mix(in oklab, var(--bridge-color-shadow, black) 8%, transparent)`,
  shadowDrag: `0 14px 32px color-mix(in oklab, var(--bridge-color-shadow, black) 20%, transparent)`
})

// `defineConsts` (not a plain object) so StyleX's cross-file constant folding emits a
// single shared `:root` custom-property definition instead of silently referencing an
// undefined `var(--xHASH)` — a plain-object literal that repeats across files (e.g.
// Button, Textarea, Kanban) gets folded into a shared internal variable whose
// definition is dropped, producing `border-radius: var(--xHASH)` with no fallback.
export const geometryToken = stylex.defineConsts({
  controlRadius: "var(--bridge-control-radius, 10px)",
  controlRadiusSmall: "var(--bridge-control-radius-sm, 8px)",
  surfaceRadius: "var(--bridge-surface-radius, 0.875em)",
  overlayRadius: "var(--bridge-overlay-radius, var(--bridge-surface-radius, 0.875em))",
  controlPaddingInline: "var(--bridge-control-padding-inline, 10px)",
  controlPaddingBlock: "var(--bridge-control-padding-block, 4px)",
  surfacePadding: "var(--bridge-surface-padding, 16px)",
  layoutGap: "var(--bridge-layout-gap, 16px)"
})

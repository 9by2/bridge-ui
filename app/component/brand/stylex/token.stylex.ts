import * as stylex from "@stylexjs/stylex"

export const token = stylex.defineVars({
  colorScheme: "light",
  shapeSurface: "14px",
  shapePill: "9999px",
  fontBody: "'Geist Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontHeading: "'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontNumber: "InterVariable, Inter, sans-serif",
  highlight: "oklch(0.145 0 0)",
  highlightForeground: "oklch(1 0 0)",
  brand: "oklch(0.8874 0.182 166.87)",
  brandForeground: "oklch(0.145 0 0)",
  brandText: "oklch(0.45 0.14 166.87)",
  brandAccent: "oklch(0.500137 0.29406 284.0716)",
  brandAccentForeground: "oklch(1 0 0)",
  warning: "oklch(0.58 0.1793 34.97)",
  warningForeground: "oklch(1 0 0)",
  card: "oklch(1 0 0)",
  cardForeground: "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  popoverForeground: "oklch(0.145 0 0)",
  sidebar: "oklch(0.985 0 0)",
  sidebarForeground: "oklch(0.145 0 0)",
  sidebarPrimary: "oklch(0.205 0 0)",
  sidebarPrimaryForeground: "oklch(0.985 0 0)",
  sidebarAccent: "oklch(0.97 0 0)",
  sidebarAccentForeground: "oklch(0.205 0 0)",
  sidebarBorder: "oklch(0.922 0 0)",
  sidebarRing: "oklch(0.708 0 0)",
  accent: "oklch(0.97 0 0)",
  accentForeground: "oklch(0.205 0 0)",
  tabInactive: "oklch(0.145 0 0 / 60%)",
  tabActiveBackground: "oklch(1 0 0)",
  tabActiveBorder: "transparent",
  footerBorder: "oklch(0.922 0 0)",
  switchOff: "oklch(0.922 0 0)",
  switchThumb: "oklch(1 0 0)",
  switchThumbOn: "oklch(1 0 0)",
  errorRingOpacity: "20%",
  outlineExpanded: "oklch(0.97 0 0)",
  errorText: "oklch(0.5489 0.1841 25.69)",
  destructiveText: "oklch(0.5489 0.1841 25.69)",
  inputBackground: "transparent",
  inputDisabled: "oklch(0.922 0 0 / 50%)",
  invalidBorder: "oklch(0.5489 0.1841 25.69)",
  outlineFocus: "oklch(0.708 0 0)",
  outlineHover: "oklch(0.97 0 0)",
  ghostHover: "oklch(0.97 0 0)",
  destructiveHoverOpacity: "20%",
  outlineBackground: "oklch(1 0 0)",
  outlineBorder: "oklch(0.922 0 0)",
  destructiveOpacity: "10%",
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  primaryForeground: "oklch(0.985 0 0)",
  secondary: "oklch(0.2178 0 0)",
  secondaryForeground: "oklch(0.985 0 0)",
  muted: "oklch(0.97 0 0)",
  mutedForeground: "oklch(0.556 0 0)",
  border: "oklch(0.922 0 0)",
  input: "oklch(0.922 0 0)",
  ring: "oklch(0.708 0 0)",
  destructive: "oklch(0.5489 0.1841 25.69)",
  destructiveForeground: "oklch(1 0 0)"
})

/** Literal names retain the documented Theme override seam after StyleX compilation. */
export const buttonToken = stylex.defineVars({
  "--bridge-button-primary": "oklch(0.205 0 0)",
  "--bridge-button-primary-foreground": "oklch(0.985 0 0)",
  "--bridge-button-radius": "10px",
  "--bridge-button-radius-small": "8px",
  "--bridge-button-padding-inline": "10px"
})

/** Dialog needs literal Theme variables after StyleX static compilation. */
export const dialogToken = stylex.defineVars({
  "--bridge-color-dialog": "oklch(1 0 0)",
  "--bridge-color-dialog-foreground": "oklch(0.145 0 0)",
  "--bridge-overlay-radius": "14px",
  "--bridge-surface-padding": "16px",
  "--bridge-layout-gap": "16px"
})

/** Public CSS variable bridge used by statically compiled component recipes. */
export const themeToken = {
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
} as const

export const geometryToken = {
  controlRadius: "var(--bridge-control-radius, 10px)",
  controlRadiusSmall: "var(--bridge-control-radius-sm, 8px)",
  surfaceRadius: "var(--bridge-surface-radius, 14px)",
  overlayRadius: "var(--bridge-overlay-radius, var(--bridge-surface-radius, 14px))",
  controlPaddingInline: "var(--bridge-control-padding-inline, 10px)",
  controlPaddingBlock: "var(--bridge-control-padding-block, 4px)",
  surfacePadding: "var(--bridge-surface-padding, 16px)",
  layoutGap: "var(--bridge-layout-gap, 16px)"
} as const

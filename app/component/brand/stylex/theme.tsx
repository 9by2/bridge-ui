import * as stylex from "@stylexjs/stylex"
import { createContext, useContext, useMemo, type ComponentProps, type CSSProperties } from "react"

import { token } from "./token.stylex"

export const themeMode = { light: "light", dark: "dark", cue: "cue", future: "future" } as const
export type ThemeMode = ValueOf<typeof themeMode>

export const bridgeDensity = { compact: "compact", default: "default", comfortable: "comfortable" } as const
export type BridgeDensity = ValueOf<typeof bridgeDensity>

type BridgeThemeColor =
  | "background"
  | "foreground"
  | "primary"
  | "primaryForeground"
  | "surface"
  | "surfaceForeground"
  | "dialog"
  | "dialogForeground"
  | "popover"
  | "popoverForeground"
  | "border"
  | "input"
  | "muted"
  | "mutedForeground"
  | "ring"
type BridgeThemeRadius = "control" | "controlSmall" | "surface" | "overlay"
type BridgeThemeSpace = 1 | 2 | 3 | 4 | 5

export type BridgeThemeOverride = {
  color?: Partial<Record<BridgeThemeColor, string>>
  radius?: Partial<Record<BridgeThemeRadius, string>>
  space?: Partial<Record<BridgeThemeSpace, string>>
}

type ValueOf<T> = T[keyof T]

const light = stylex.createTheme(token, {
  colorScheme: "light",
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
const dark = stylex.createTheme(token, {
  colorScheme: "dark",
  fontBody: "var(--bridge-font-body, 'Geist Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontHeading: "var(--bridge-font-heading, 'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontNumber: "var(--bridge-font-number, InterVariable, Inter, sans-serif)",
  highlight: `var(--bridge-color-highlight, oklch(1 0 0))`,
  highlightForeground: `var(--bridge-color-highlight-foreground, oklch(0.1776 0 0))`,
  brand: `var(--bridge-color-brand, oklch(0.8874 0.182 166.87))`,
  brandForeground: `var(--bridge-color-brand-foreground, oklch(0.1776 0 0))`,
  brandText: `var(--bridge-color-brand-text, oklch(0.8874 0.182 166.87))`,
  brandAccent: `var(--bridge-color-brand-accent, oklch(0.500137 0.29406 284.0716))`,
  brandAccentForeground: `var(--bridge-color-brand-accent-foreground, oklch(1 0 0))`,
  warning: `var(--bridge-color-warning, oklch(0.58 0.1793 34.97))`,
  warningForeground: `var(--bridge-color-warning-foreground, oklch(1 0 0))`,
  card: `var(--bridge-color-surface, oklch(0.1776 0 0))`,
  cardForeground: `var(--bridge-color-surface-foreground, oklch(0.683 0 0))`,
  popover: `var(--bridge-color-popover, oklch(0.1776 0 0))`,
  popoverForeground: `var(--bridge-color-popover-foreground, oklch(0.683 0 0))`,
  sidebar: `var(--bridge-color-sidebar, oklch(0.1776 0 0))`,
  sidebarForeground: `var(--bridge-color-sidebar-foreground, oklch(0.683 0 0))`,
  sidebarPrimary: `var(--bridge-color-sidebar-primary, white)`,
  sidebarPrimaryForeground: `var(--bridge-color-sidebar-primary-foreground, oklch(0.1776 0 0))`,
  sidebarAccent: `var(--bridge-color-sidebar-accent, oklch(0.269 0 0))`,
  sidebarAccentForeground: `var(--bridge-color-sidebar-accent-foreground, oklch(0.985 0 0))`,
  sidebarBorder: `var(--bridge-color-sidebar-border, oklch(0.32 0 0))`,
  sidebarRing: `var(--bridge-color-sidebar-ring, oklch(0.556 0 0))`,
  accent: `var(--bridge-color-accent, oklch(0.269 0 0))`,
  accentForeground: `var(--bridge-color-accent-foreground, oklch(0.985 0 0))`,
  tabInactive: "oklch(0.708 0 0)",
  tabActiveBackground: `var(--bridge-color-accent, oklch(1 0 0 / 10.8%))`,
  tabActiveBorder: `var(--bridge-color-border, oklch(1 0 0 / 36%))`,
  footerBorder: `var(--bridge-color-border, oklch(0.32 0 0))`,
  switchOff: `var(--bridge-color-input, oklch(1 0 0 / 28.8%))`,
  switchThumb: `var(--bridge-color-background, oklch(0.683 0 0))`,
  switchThumbOn: `var(--bridge-color-background, oklch(0.1776 0 0))`,
  errorRingOpacity: "40%",
  outlineExpanded: "oklch(1 0 0 / 10.8%)",
  errorText: `var(--bridge-color-destructive-text, oklch(0.66 0.19 25.69))`,
  destructiveText: `var(--bridge-color-destructive-text, oklch(0.5489 0.1841 25.69))`,
  inputBackground: "oklch(1 0 0 / 10.8%)",
  inputDisabled: `var(--bridge-color-input, oklch(1 0 0 / 28.8%))`,
  invalidBorder: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69 / 50%))`,
  outlineFocus: `var(--bridge-color-ring, oklch(1 0 0 / 36%))`,
  outlineHover: `var(--bridge-color-accent, oklch(0.32 0 0))`,
  ghostHover: `var(--bridge-color-accent, oklch(0.269 0 0 / 50%))`,
  destructiveHoverOpacity: "30%",
  outlineBackground: `var(--bridge-color-background, oklch(0.1776 0 0))`,
  outlineBorder: `var(--bridge-color-border, oklch(1 0 0 / 36%))`,
  destructiveOpacity: "20%",
  background: `var(--bridge-color-background, oklch(0.1776 0 0))`,
  foreground: `var(--bridge-color-foreground, oklch(0.683 0 0))`,
  primary: `var(--bridge-color-primary, white)`,
  primaryForeground: `var(--bridge-color-primary-foreground, oklch(0.1776 0 0))`,
  secondary: `var(--bridge-color-secondary, oklch(0.2178 0 0))`,
  secondaryForeground: `var(--bridge-color-secondary-foreground, white)`,
  muted: `var(--bridge-color-muted, oklch(0.269 0 0))`,
  mutedForeground: `var(--bridge-color-muted-foreground, oklch(0.708 0 0))`,
  border: `var(--bridge-color-border, oklch(0.32 0 0))`,
  input: `var(--bridge-color-input, oklch(1 0 0 / 36%))`,
  ring: `var(--bridge-color-ring, oklch(0.556 0 0))`,
  destructive: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69))`,
  destructiveForeground: `var(--bridge-color-destructive-foreground, oklch(1 0 0))`
})
const cue = stylex.createTheme(token, {
  colorScheme: "dark",
  fontBody: "var(--bridge-font-body, 'Geist Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontHeading: "var(--bridge-font-heading, 'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontNumber: "var(--bridge-font-number, InterVariable, Inter, sans-serif)",
  highlight: `var(--bridge-color-highlight, oklch(1 0 0))`,
  highlightForeground: `var(--bridge-color-highlight-foreground, oklch(0.1776 0 0))`,
  brand: `var(--bridge-color-brand, oklch(0.8874 0.182 166.87))`,
  brandForeground: `var(--bridge-color-brand-foreground, oklch(0.1776 0 0))`,
  brandText: `var(--bridge-color-brand-text, oklch(0.8874 0.182 166.87))`,
  brandAccent: `var(--bridge-color-brand-accent, oklch(0.500137 0.29406 284.0716))`,
  brandAccentForeground: `var(--bridge-color-brand-accent-foreground, oklch(1 0 0))`,
  warning: `var(--bridge-color-warning, oklch(0.58 0.1793 34.97))`,
  warningForeground: `var(--bridge-color-warning-foreground, oklch(1 0 0))`,
  card: `var(--bridge-color-surface, oklch(0.1776 0 0))`,
  cardForeground: `var(--bridge-color-surface-foreground, oklch(0.683 0 0))`,
  popover: `var(--bridge-color-popover, oklch(0.1776 0 0))`,
  popoverForeground: `var(--bridge-color-popover-foreground, oklch(0.683 0 0))`,
  sidebar: `var(--bridge-color-sidebar, oklch(0.205 0 0))`,
  sidebarForeground: `var(--bridge-color-sidebar-foreground, oklch(0.985 0 0))`,
  sidebarPrimary: `var(--bridge-color-sidebar-primary, oklch(0.488 0.243 264.376))`,
  sidebarPrimaryForeground: `var(--bridge-color-sidebar-primary-foreground, oklch(0.985 0 0))`,
  sidebarAccent: `var(--bridge-color-sidebar-accent, oklch(0.269 0 0))`,
  sidebarAccentForeground: `var(--bridge-color-sidebar-accent-foreground, oklch(0.985 0 0))`,
  sidebarBorder: `var(--bridge-color-sidebar-border, oklch(1 0 0 / 10%))`,
  sidebarRing: `var(--bridge-color-sidebar-ring, oklch(0.556 0 0))`,
  accent: `var(--bridge-color-accent, oklch(0.269 0 0))`,
  accentForeground: `var(--bridge-color-accent-foreground, oklch(0.985 0 0))`,
  tabInactive: "oklch(0.708 0 0)",
  tabActiveBackground: `var(--bridge-color-accent, oklch(1 0 0 / 10.8%))`,
  tabActiveBorder: `var(--bridge-color-border, oklch(1 0 0 / 36%))`,
  footerBorder: `var(--bridge-color-border, oklch(0.32 0 0))`,
  switchOff: `var(--bridge-color-input, oklch(1 0 0 / 28.8%))`,
  switchThumb: `var(--bridge-color-background, oklch(0.683 0 0))`,
  switchThumbOn: `var(--bridge-color-background, oklch(0.1776 0 0))`,
  errorRingOpacity: "40%",
  outlineExpanded: "oklch(1 0 0 / 10.8%)",
  errorText: `var(--bridge-color-destructive-text, oklch(0.66 0.19 25.69))`,
  destructiveText: `var(--bridge-color-destructive-text, oklch(0.66 0.19 25.69))`,
  inputBackground: "oklch(1 0 0 / 10.8%)",
  inputDisabled: `var(--bridge-color-input, oklch(1 0 0 / 28.8%))`,
  invalidBorder: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69 / 50%))`,
  outlineFocus: `var(--bridge-color-ring, oklch(1 0 0 / 36%))`,
  outlineHover: `var(--bridge-color-accent, oklch(0.32 0 0))`,
  ghostHover: `var(--bridge-color-accent, oklch(0.269 0 0 / 50%))`,
  destructiveHoverOpacity: "30%",
  outlineBackground: `var(--bridge-color-background, oklch(0.1776 0 0))`,
  outlineBorder: `var(--bridge-color-border, oklch(1 0 0 / 36%))`,
  destructiveOpacity: "20%",
  background: `var(--bridge-color-background, oklch(0.1776 0 0))`,
  foreground: `var(--bridge-color-foreground, oklch(0.683 0 0))`,
  primary: `var(--bridge-color-primary, white)`,
  primaryForeground: `var(--bridge-color-primary-foreground, oklch(0.1776 0 0))`,
  secondary: `var(--bridge-color-secondary, oklch(0.2178 0 0))`,
  secondaryForeground: `var(--bridge-color-secondary-foreground, white)`,
  muted: `var(--bridge-color-muted, oklch(0.269 0 0))`,
  mutedForeground: `var(--bridge-color-muted-foreground, oklch(0.708 0 0))`,
  border: `var(--bridge-color-border, oklch(0.32 0 0))`,
  input: `var(--bridge-color-input, oklch(1 0 0 / 36%))`,
  ring: `var(--bridge-color-ring, oklch(0.556 0 0))`,
  destructive: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69))`,
  destructiveForeground: `var(--bridge-color-destructive-foreground, oklch(1 0 0))`
})
// Proves DEC-003/DEC-009: a fourth theme swaps only semantic color values. It reuses
// the same component recipe (DOM, geometry, spacing, typography, motion) as light/dark/cue
// while carrying a distinct violet-forward palette so token/geometry parity tests can
// assert real cross-theme equivalence instead of aliasing an existing mode.
const future = stylex.createTheme(token, {
  colorScheme: "dark",
  fontBody: "var(--bridge-font-body, 'Geist Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontHeading: "var(--bridge-font-heading, 'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif)",
  fontNumber: "var(--bridge-font-number, InterVariable, Inter, sans-serif)",
  highlight: `var(--bridge-color-highlight, oklch(1 0 0))`,
  highlightForeground: `var(--bridge-color-highlight-foreground, oklch(0.16 0.03 284.37))`,
  brand: `var(--bridge-color-brand, oklch(0.7 0.19 284.37))`,
  brandForeground: `var(--bridge-color-brand-foreground, oklch(1 0 0))`,
  brandText: `var(--bridge-color-brand-text, oklch(0.78 0.16 284.37))`,
  brandAccent: `var(--bridge-color-brand-accent, oklch(0.8874 0.182 166.87))`,
  brandAccentForeground: `var(--bridge-color-brand-accent-foreground, oklch(0.145 0 0))`,
  warning: `var(--bridge-color-warning, oklch(0.58 0.1793 34.97))`,
  warningForeground: `var(--bridge-color-warning-foreground, oklch(1 0 0))`,
  card: `var(--bridge-color-surface, oklch(0.18 0.02 284.37))`,
  cardForeground: `var(--bridge-color-surface-foreground, oklch(0.75 0.01 284.37))`,
  popover: `var(--bridge-color-popover, oklch(0.18 0.02 284.37))`,
  popoverForeground: `var(--bridge-color-popover-foreground, oklch(0.75 0.01 284.37))`,
  sidebar: `var(--bridge-color-sidebar, oklch(0.21 0.02 284.37))`,
  sidebarForeground: `var(--bridge-color-sidebar-foreground, oklch(0.98 0 0))`,
  sidebarPrimary: `var(--bridge-color-sidebar-primary, oklch(0.7 0.19 284.37))`,
  sidebarPrimaryForeground: `var(--bridge-color-sidebar-primary-foreground, oklch(1 0 0))`,
  sidebarAccent: `var(--bridge-color-sidebar-accent, oklch(0.27 0.02 284.37))`,
  sidebarAccentForeground: `var(--bridge-color-sidebar-accent-foreground, oklch(0.98 0 0))`,
  sidebarBorder: `var(--bridge-color-sidebar-border, oklch(1 0 0 / 10%))`,
  sidebarRing: `var(--bridge-color-sidebar-ring, oklch(0.56 0 0))`,
  accent: `var(--bridge-color-accent, oklch(0.27 0.02 284.37))`,
  accentForeground: `var(--bridge-color-accent-foreground, oklch(0.98 0 0))`,
  tabInactive: "oklch(0.71 0 0)",
  tabActiveBackground: `var(--bridge-color-accent, oklch(1 0 0 / 10.8%))`,
  tabActiveBorder: `var(--bridge-color-border, oklch(1 0 0 / 36%))`,
  footerBorder: `var(--bridge-color-border, oklch(0.32 0 0))`,
  switchOff: `var(--bridge-color-input, oklch(1 0 0 / 28.8%))`,
  switchThumb: `var(--bridge-color-background, oklch(0.75 0.01 284.37))`,
  switchThumbOn: `var(--bridge-color-background, oklch(0.18 0.02 284.37))`,
  errorRingOpacity: "40%",
  outlineExpanded: "oklch(1 0 0 / 10.8%)",
  errorText: `var(--bridge-color-destructive-text, oklch(0.66 0.19 25.69))`,
  destructiveText: `var(--bridge-color-destructive-text, oklch(0.66 0.19 25.69))`,
  inputBackground: "oklch(1 0 0 / 10.8%)",
  inputDisabled: `var(--bridge-color-input, oklch(1 0 0 / 28.8%))`,
  invalidBorder: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69 / 50%))`,
  outlineFocus: `var(--bridge-color-ring, oklch(1 0 0 / 36%))`,
  outlineHover: `var(--bridge-color-accent, oklch(1 0 0 / 18%))`,
  ghostHover: `var(--bridge-color-accent, oklch(0.27 0.02 284.37 / 50%))`,
  destructiveHoverOpacity: "30%",
  outlineBackground: `var(--bridge-color-background, oklch(1 0 0 / 10.8%))`,
  outlineBorder: `var(--bridge-color-border, oklch(1 0 0 / 36%))`,
  destructiveOpacity: "20%",
  background: `var(--bridge-color-background, oklch(0.16 0.03 284.37))`,
  foreground: `var(--bridge-color-foreground, oklch(0.75 0.01 284.37))`,
  primary: `var(--bridge-color-primary, white)`,
  primaryForeground: `var(--bridge-color-primary-foreground, oklch(0.16 0.03 284.37))`,
  secondary: `var(--bridge-color-secondary, oklch(0.24 0.02 284.37))`,
  secondaryForeground: `var(--bridge-color-secondary-foreground, white)`,
  muted: `var(--bridge-color-muted, oklch(0.27 0.02 284.37))`,
  mutedForeground: `var(--bridge-color-muted-foreground, oklch(0.71 0 0))`,
  border: `var(--bridge-color-border, oklch(0.32 0.02 284.37))`,
  input: `var(--bridge-color-input, oklch(1 0 0 / 36%))`,
  ring: `var(--bridge-color-ring, oklch(0.56 0 0))`,
  destructive: `var(--bridge-color-destructive, oklch(0.5489 0.1841 25.69))`,
  destructiveForeground: `var(--bridge-color-destructive-foreground, oklch(1 0 0))`
})
const modeTheme = { light, dark, cue, future } as const
type BridgeTheme = { mode: ThemeMode; density: BridgeDensity; theme: BridgeThemeOverride }

const ThemeContext = createContext<BridgeTheme>({ mode: themeMode.light, density: bridgeDensity.default, theme: {} })

/**
 * Public seam for reading the nearest Bridge `Theme` mode (DEC-009). Consumers that
 * render inside a portal, such as `SonnerToaster`, use this instead of any external
 * theme provider so package-owned components stay coupled to `@bridge/ui` theme
 * authority only.
 */
export function useThemeMode(): ThemeMode {
  return useContext(ThemeContext).mode
}

/** Reads the nearest resolved Bridge customization for package portals and consumer composition. */
export function useBridgeTheme(): BridgeTheme {
  return useContext(ThemeContext)
}
const style = stylex.create({
  root: {
    "--pilot-background": token.background,
    "--pilot-foreground": token.foreground,
    "--pilot-muted": token.muted,
    "--pilot-muted-foreground": token.mutedForeground,
    "--pilot-border": token.border,
    "--pilot-primary": token.primary,
    "--pilot-accent-foreground": token.accentForeground,
    colorScheme: token.colorScheme,
    fontFamily: token.fontBody,
    fontSize: 16,
    lineHeight: 1.5,
    color: token.foreground
  },
  number: {
    fontFamily: token.fontNumber,
    fontFeatureSettings: '"liga" 1, "calt" 1, "ss01" 1'
  }
})

export const numberTextClassName = String(stylex.props(style.number).className)

function mergeTheme(parent: BridgeThemeOverride, current: BridgeThemeOverride | undefined): BridgeThemeOverride {
  return {
    color: { ...parent.color, ...current?.color },
    radius: { ...parent.radius, ...current?.radius },
    space: { ...parent.space, ...current?.space }
  }
}

function themeVariables(
  density: BridgeDensity,
  theme: BridgeThemeOverride
): CSSProperties & Record<`--${string}`, string> {
  const compact = density === bridgeDensity.compact
  const comfortable = density === bridgeDensity.comfortable
  const space = { 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 5: "1.5rem", ...theme.space }
  const variables: CSSProperties & Record<string, string> = {
    "--bridge-color-dialog":
      theme.color?.dialog ?? theme.color?.surface ?? `var(--bridge-color-surface, ${token.card})`,
    "--bridge-color-dialog-foreground":
      theme.color?.dialogForeground ??
      theme.color?.surfaceForeground ??
      `var(--bridge-color-surface-foreground, ${token.cardForeground})`,
    "--bridge-space-1": space[1],
    "--bridge-space-2": space[2],
    "--bridge-space-3": space[3],
    "--bridge-space-4": space[4],
    "--bridge-space-5": space[5],
    "--bridge-control-radius-sm": theme.radius?.controlSmall ?? "0.5rem",
    "--bridge-surface-radius": theme.radius?.surface ?? "0.875rem",
    "--bridge-overlay-radius": theme.radius?.overlay ?? theme.radius?.surface ?? "0.875rem",
    "--bridge-control-padding-inline": compact
      ? "var(--bridge-space-2)"
      : comfortable
        ? "var(--bridge-space-3)"
        : "0.625rem",
    "--bridge-control-padding-block": compact ? "0.125rem" : comfortable ? "0.375rem" : "0.25rem",
    "--bridge-surface-padding": compact
      ? "var(--bridge-space-3)"
      : comfortable
        ? "var(--bridge-space-5)"
        : "var(--bridge-space-4)",
    "--bridge-layout-gap": compact
      ? "var(--bridge-space-3)"
      : comfortable
        ? "var(--bridge-space-5)"
        : "var(--bridge-space-4)"
  }
  if (theme.radius?.control !== undefined) variables["--bridge-control-radius"] = theme.radius.control
  const { color } = theme
  if (color) {
    if (color.background) variables["--bridge-color-background"] = color.background
    if (color.foreground) variables["--bridge-color-foreground"] = color.foreground
    if (color.primary) variables["--bridge-color-primary"] = color.primary
    if (color.primaryForeground) variables["--bridge-color-primary-foreground"] = color.primaryForeground
    if (color.surface) variables["--bridge-color-surface"] = color.surface
    if (color.surfaceForeground) variables["--bridge-color-surface-foreground"] = color.surfaceForeground
    if (color.popover) variables["--bridge-color-popover"] = color.popover
    if (color.popoverForeground) variables["--bridge-color-popover-foreground"] = color.popoverForeground
    if (color.border) variables["--bridge-color-border"] = color.border
    if (color.input) variables["--bridge-color-input"] = color.input
    if (color.muted) variables["--bridge-color-muted"] = color.muted
    if (color.mutedForeground) variables["--bridge-color-muted-foreground"] = color.mutedForeground
    if (color.ring) variables["--bridge-color-ring"] = color.ring
  }
  return variables
}

export function Theme({
  mode,
  density,
  theme,
  className,
  style: callerStyle,
  ...props
}: ComponentProps<"div"> & {
  mode?: ThemeMode
  density?: BridgeDensity
  theme?: BridgeThemeOverride
}) {
  const inherited = useContext(ThemeContext)
  const current: BridgeTheme = useMemo(
    () => ({
      mode: mode ?? inherited.mode,
      density: density ?? inherited.density,
      theme: mergeTheme(inherited.theme, theme)
    }),
    [mode, density, theme, inherited]
  )
  return (
    <ThemeContext value={current}>
      <div
        data-pilot-theme={current.mode}
        data-bridge-theme={current.mode}
        data-bridge-density={current.density}
        {...props}
        style={{ ...themeVariables(current.density, current.theme), ...callerStyle }}
        className={[stylex.props(style.root, modeTheme[current.mode]).className, className].filter(Boolean).join(" ")}
      />
    </ThemeContext>
  )
}

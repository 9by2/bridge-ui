import * as stylex from "@stylexjs/stylex"
import { createContext, useContext, type ComponentProps, type CSSProperties } from "react"

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
const dark = stylex.createTheme(token, {
  colorScheme: "dark",
  fontBody: "'Geist Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontHeading: "'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontNumber: "InterVariable, Inter, sans-serif",
  highlight: "oklch(1 0 0)",
  highlightForeground: "oklch(0.1776 0 0)",
  brand: "oklch(0.8874 0.182 166.87)",
  brandForeground: "oklch(0.1776 0 0)",
  brandText: "oklch(0.8874 0.182 166.87)",
  brandAccent: "oklch(0.500137 0.29406 284.0716)",
  brandAccentForeground: "oklch(1 0 0)",
  warning: "oklch(0.58 0.1793 34.97)",
  warningForeground: "oklch(1 0 0)",
  card: "oklch(0.1776 0 0)",
  cardForeground: "oklch(0.683 0 0)",
  popover: "oklch(0.1776 0 0)",
  popoverForeground: "oklch(0.683 0 0)",
  sidebar: "oklch(0.1776 0 0)",
  sidebarForeground: "oklch(0.683 0 0)",
  sidebarPrimary: "white",
  sidebarPrimaryForeground: "oklch(0.1776 0 0)",
  sidebarAccent: "oklch(0.269 0 0)",
  sidebarAccentForeground: "oklch(0.985 0 0)",
  sidebarBorder: "oklch(0.32 0 0)",
  sidebarRing: "oklch(0.556 0 0)",
  accent: "oklch(0.269 0 0)",
  accentForeground: "oklch(0.985 0 0)",
  tabInactive: "oklch(0.708 0 0)",
  tabActiveBackground: "oklch(1 0 0 / 10.8%)",
  tabActiveBorder: "oklch(1 0 0 / 36%)",
  footerBorder: "oklch(0.32 0 0)",
  switchOff: "oklch(1 0 0 / 28.8%)",
  switchThumb: "oklch(0.683 0 0)",
  switchThumbOn: "oklch(0.1776 0 0)",
  errorRingOpacity: "40%",
  outlineExpanded: "oklch(1 0 0 / 10.8%)",
  errorText: "oklch(0.66 0.19 25.69)",
  destructiveText: "oklch(0.5489 0.1841 25.69)",
  inputBackground: "oklch(1 0 0 / 10.8%)",
  inputDisabled: "oklch(1 0 0 / 28.8%)",
  invalidBorder: "oklch(0.5489 0.1841 25.69 / 50%)",
  outlineFocus: "oklch(1 0 0 / 36%)",
  outlineHover: "oklch(0.32 0 0)",
  ghostHover: "oklch(0.269 0 0 / 50%)",
  destructiveHoverOpacity: "30%",
  outlineBackground: "oklch(0.1776 0 0)",
  outlineBorder: "oklch(1 0 0 / 36%)",
  destructiveOpacity: "20%",
  background: "oklch(0.1776 0 0)",
  foreground: "oklch(0.683 0 0)",
  primary: "white",
  primaryForeground: "oklch(0.1776 0 0)",
  secondary: "oklch(0.2178 0 0)",
  secondaryForeground: "white",
  muted: "oklch(0.269 0 0)",
  mutedForeground: "oklch(0.708 0 0)",
  border: "oklch(0.32 0 0)",
  input: "oklch(1 0 0 / 36%)",
  ring: "oklch(0.556 0 0)",
  destructive: "oklch(0.5489 0.1841 25.69)",
  destructiveForeground: "oklch(1 0 0)"
})
const cue = stylex.createTheme(token, {
  colorScheme: "dark",
  fontBody: "'Geist Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontHeading: "'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontNumber: "InterVariable, Inter, sans-serif",
  highlight: "oklch(1 0 0)",
  highlightForeground: "oklch(0.1776 0 0)",
  brand: "oklch(0.8874 0.182 166.87)",
  brandForeground: "oklch(0.1776 0 0)",
  brandText: "oklch(0.8874 0.182 166.87)",
  brandAccent: "oklch(0.500137 0.29406 284.0716)",
  brandAccentForeground: "oklch(1 0 0)",
  warning: "oklch(0.58 0.1793 34.97)",
  warningForeground: "oklch(1 0 0)",
  card: "oklch(0.1776 0 0)",
  cardForeground: "oklch(0.683 0 0)",
  popover: "oklch(0.1776 0 0)",
  popoverForeground: "oklch(0.683 0 0)",
  sidebar: "oklch(0.205 0 0)",
  sidebarForeground: "oklch(0.985 0 0)",
  sidebarPrimary: "oklch(0.488 0.243 264.376)",
  sidebarPrimaryForeground: "oklch(0.985 0 0)",
  sidebarAccent: "oklch(0.269 0 0)",
  sidebarAccentForeground: "oklch(0.985 0 0)",
  sidebarBorder: "oklch(1 0 0 / 10%)",
  sidebarRing: "oklch(0.556 0 0)",
  accent: "oklch(0.269 0 0)",
  accentForeground: "oklch(0.985 0 0)",
  tabInactive: "oklch(0.708 0 0)",
  tabActiveBackground: "oklch(1 0 0 / 10.8%)",
  tabActiveBorder: "oklch(1 0 0 / 36%)",
  footerBorder: "oklch(0.32 0 0)",
  switchOff: "oklch(1 0 0 / 28.8%)",
  switchThumb: "oklch(0.683 0 0)",
  switchThumbOn: "oklch(0.1776 0 0)",
  errorRingOpacity: "40%",
  outlineExpanded: "oklch(1 0 0 / 10.8%)",
  errorText: "oklch(0.66 0.19 25.69)",
  destructiveText: "oklch(0.66 0.19 25.69)",
  inputBackground: "oklch(1 0 0 / 10.8%)",
  inputDisabled: "oklch(1 0 0 / 28.8%)",
  invalidBorder: "oklch(0.5489 0.1841 25.69 / 50%)",
  outlineFocus: "oklch(1 0 0 / 36%)",
  outlineHover: "oklch(0.32 0 0)",
  ghostHover: "oklch(0.269 0 0 / 50%)",
  destructiveHoverOpacity: "30%",
  outlineBackground: "oklch(0.1776 0 0)",
  outlineBorder: "oklch(1 0 0 / 36%)",
  destructiveOpacity: "20%",
  background: "oklch(0.1776 0 0)",
  foreground: "oklch(0.683 0 0)",
  primary: "white",
  primaryForeground: "oklch(0.1776 0 0)",
  secondary: "oklch(0.2178 0 0)",
  secondaryForeground: "white",
  muted: "oklch(0.269 0 0)",
  mutedForeground: "oklch(0.708 0 0)",
  border: "oklch(0.32 0 0)",
  input: "oklch(1 0 0 / 36%)",
  ring: "oklch(0.556 0 0)",
  destructive: "oklch(0.5489 0.1841 25.69)",
  destructiveForeground: "oklch(1 0 0)"
})
// Proves DEC-003/DEC-009: a fourth theme swaps only semantic color values. It reuses
// the same component recipe (DOM, geometry, spacing, typography, motion) as light/dark/cue
// while carrying a distinct violet-forward palette so token/geometry parity tests can
// assert real cross-theme equivalence instead of aliasing an existing mode.
const future = stylex.createTheme(token, {
  colorScheme: "dark",
  fontBody: "'Geist Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontHeading: "'Plus Jakarta Sans Variable', aktiv-grotesk, Sarabun, sans-serif",
  fontNumber: "InterVariable, Inter, sans-serif",
  highlight: "oklch(1 0 0)",
  highlightForeground: "oklch(0.16 0.03 284.37)",
  brand: "oklch(0.7 0.19 284.37)",
  brandForeground: "oklch(1 0 0)",
  brandText: "oklch(0.78 0.16 284.37)",
  brandAccent: "oklch(0.8874 0.182 166.87)",
  brandAccentForeground: "oklch(0.145 0 0)",
  warning: "oklch(0.58 0.1793 34.97)",
  warningForeground: "oklch(1 0 0)",
  card: "oklch(0.18 0.02 284.37)",
  cardForeground: "oklch(0.75 0.01 284.37)",
  popover: "oklch(0.18 0.02 284.37)",
  popoverForeground: "oklch(0.75 0.01 284.37)",
  sidebar: "oklch(0.21 0.02 284.37)",
  sidebarForeground: "oklch(0.98 0 0)",
  sidebarPrimary: "oklch(0.7 0.19 284.37)",
  sidebarPrimaryForeground: "oklch(1 0 0)",
  sidebarAccent: "oklch(0.27 0.02 284.37)",
  sidebarAccentForeground: "oklch(0.98 0 0)",
  sidebarBorder: "oklch(1 0 0 / 10%)",
  sidebarRing: "oklch(0.56 0 0)",
  accent: "oklch(0.27 0.02 284.37)",
  accentForeground: "oklch(0.98 0 0)",
  tabInactive: "oklch(0.71 0 0)",
  tabActiveBackground: "oklch(1 0 0 / 10.8%)",
  tabActiveBorder: "oklch(1 0 0 / 36%)",
  footerBorder: "oklch(0.32 0 0)",
  switchOff: "oklch(1 0 0 / 28.8%)",
  switchThumb: "oklch(0.75 0.01 284.37)",
  switchThumbOn: "oklch(0.18 0.02 284.37)",
  errorRingOpacity: "40%",
  outlineExpanded: "oklch(1 0 0 / 10.8%)",
  errorText: "oklch(0.66 0.19 25.69)",
  destructiveText: "oklch(0.66 0.19 25.69)",
  inputBackground: "oklch(1 0 0 / 10.8%)",
  inputDisabled: "oklch(1 0 0 / 28.8%)",
  invalidBorder: "oklch(0.5489 0.1841 25.69 / 50%)",
  outlineFocus: "oklch(1 0 0 / 36%)",
  outlineHover: "oklch(1 0 0 / 18%)",
  ghostHover: "oklch(0.27 0.02 284.37 / 50%)",
  destructiveHoverOpacity: "30%",
  outlineBackground: "oklch(1 0 0 / 10.8%)",
  outlineBorder: "oklch(1 0 0 / 36%)",
  destructiveOpacity: "20%",
  background: "oklch(0.16 0.03 284.37)",
  foreground: "oklch(0.75 0.01 284.37)",
  primary: "white",
  primaryForeground: "oklch(0.16 0.03 284.37)",
  secondary: "oklch(0.24 0.02 284.37)",
  secondaryForeground: "white",
  muted: "oklch(0.27 0.02 284.37)",
  mutedForeground: "oklch(0.71 0 0)",
  border: "oklch(0.32 0.02 284.37)",
  input: "oklch(1 0 0 / 36%)",
  ring: "oklch(0.56 0 0)",
  destructive: "oklch(0.5489 0.1841 25.69)",
  destructiveForeground: "oklch(1 0 0)"
})
const modeTheme = { light, dark, cue, future } as const
const buttonColor = {
  light: { primary: "oklch(0.205 0 0)", primaryForeground: "oklch(0.985 0 0)" },
  dark: { primary: "white", primaryForeground: "oklch(0.1776 0 0)" },
  cue: { primary: "white", primaryForeground: "oklch(0.1776 0 0)" },
  future: { primary: "oklch(0.7 0.19 284.37)", primaryForeground: "oklch(1 0 0)" }
} as const
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
  mode: ThemeMode,
  density: BridgeDensity,
  theme: BridgeThemeOverride
): CSSProperties & Record<`--${string}`, string> {
  const compact = density === bridgeDensity.compact
  const comfortable = density === bridgeDensity.comfortable
  const space = { 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 5: "1.5rem", ...theme.space }
  const variables: CSSProperties & Record<string, string> = {
    "--bridge-button-primary": theme.color?.primary ?? buttonColor[mode].primary,
    "--bridge-button-primary-foreground": theme.color?.primaryForeground ?? buttonColor[mode].primaryForeground,
    "--bridge-button-radius": theme.radius?.control ?? "0.625rem",
    "--bridge-button-radius-small": theme.radius?.controlSmall ?? "0.5rem",
    "--bridge-button-padding-inline": compact
      ? "var(--bridge-space-2)"
      : comfortable
        ? "var(--bridge-space-3)"
        : "0.625rem",
    "--bridge-space-1": space[1],
    "--bridge-space-2": space[2],
    "--bridge-space-3": space[3],
    "--bridge-space-4": space[4],
    "--bridge-space-5": space[5],
    "--bridge-control-radius": theme.radius?.control ?? "0.625rem",
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
  const current: BridgeTheme = {
    mode: mode ?? inherited.mode,
    density: density ?? inherited.density,
    theme: mergeTheme(inherited.theme, theme)
  }
  return (
    <ThemeContext value={current}>
      <div
        data-pilot-theme={current.mode}
        data-bridge-theme={current.mode}
        data-bridge-density={current.density}
        {...props}
        style={{ ...themeVariables(current.mode, current.density, current.theme), ...callerStyle }}
        className={[stylex.props(style.root, modeTheme[current.mode]).className, className].filter(Boolean).join(" ")}
      />
    </ThemeContext>
  )
}

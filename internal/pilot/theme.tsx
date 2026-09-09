import * as stylex from "@stylexjs/stylex"
import { createContext, useContext, type ComponentProps } from "react"

import { token } from "./token.stylex"

const light = stylex.createTheme(token, {
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
  destructive: "oklch(0.5489 0.1841 25.69)"
})
const dark = stylex.createTheme(token, {
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
  outlineHover: "oklch(1 0 0 / 18%)",
  ghostHover: "oklch(0.269 0 0 / 50%)",
  destructiveHoverOpacity: "30%",
  outlineBackground: "oklch(1 0 0 / 10.8%)",
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
  destructive: "oklch(0.5489 0.1841 25.69)"
})
const ThemeContext = createContext<"light" | "dark">("light")
const style = stylex.create({
  root: {
    "--pilot-background": token.background,
    "--pilot-foreground": token.foreground,
    "--pilot-muted": token.muted,
    "--pilot-muted-foreground": token.mutedForeground,
    "--pilot-border": token.border,
    "--pilot-primary": token.primary,
    "--pilot-accent-foreground": token.accentForeground,
    fontFamily: "'Geist Variable', aktiv-grotesk, Sarabun, sans-serif",
    fontSize: 16,
    lineHeight: 1.5,
    color: token.foreground
  }
})

export function Theme({ mode, className, ...props }: ComponentProps<"div"> & { mode?: "light" | "dark" }) {
  const inherited = useContext(ThemeContext)
  const current = mode ?? inherited
  return (
    <ThemeContext value={current}>
      <div
        data-pilot-theme={current}
        {...props}
        className={[stylex.props(style.root, current === "dark" ? dark : light).className, className]
          .filter(Boolean)
          .join(" ")}
      />
    </ThemeContext>
  )
}

import * as stylex from "@stylexjs/stylex"

import { color } from "./token.stylex"

const dark = stylex.createTheme(color, { surface: "rgb(20, 20, 20)", text: "rgb(255, 255, 255)" })
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } })
const style = stylex.create({
  root: {
    backgroundColor: color.surface,
    color: color.text,
    opacity: { default: 1, ":disabled": 0.5 },
    outlineWidth: { default: 0, ":focus-visible": 3 },
    padding: { default: 12, "@media (max-width: 400px)": 8 },
    animationName: fade,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  width: (value: number) => ({ width: value })
})

export function Contract({ isDark = false, width = 120 }: { isDark?: boolean; width?: number }) {
  return <button {...stylex.props(isDark && dark, style.root, style.width(width))}>Contract</button>
}

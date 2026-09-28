import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import { createContext, useContext, type ComponentProps } from "react"

import { token } from "./token.stylex"

type Variant = "default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "destructive"
const Context = createContext<Variant | null>(null)
const style = stylex.create({
  group: { display: "flex", minWidth: 0, flexDirection: "column", gap: "var(--bridge-unit-8, 8px)" },
  root: {
    position: "relative",
    display: "flex",
    width: "fit-content",
    maxWidth: "80%",
    minWidth: 0,
    flexDirection: "column",
    gap: "var(--bridge-unit-4, 4px)",
    alignSelf: { default: "auto", [stylex.when.ancestor('[data-align="end"]')]: "end" }
  },
  end: { alignSelf: "end" },
  ghostRoot: { maxWidth: "100%", borderWidth: 0 },
  content: {
    boxSizing: "border-box",
    width: "fit-content",
    maxWidth: "100%",
    minWidth: 0,
    overflow: "hidden",
    borderRadius: "var(--bridge-radius-14, 0.875em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: "transparent", ":is(button, a):focus-visible": token.ring },
    paddingInline: "var(--bridge-unit-12, 12px)",
    paddingBlock: "var(--bridge-unit-8, 8px)",
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: 1.625,
    overflowWrap: "break-word",
    alignSelf: { default: "auto", [stylex.when.ancestor('[data-align="end"]')]: "end" },
    textAlign: "left",
    textDecorationLine: "none",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outline: "none",
    boxShadow: {
      default: "none",
      ":is(button, a):focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`
    }
  },
  default: {
    backgroundColor: {
      default: token.primary,
      ":is(button, a):hover": `color-mix(in oklch, ${token.primary}, transparent 20%)`
    },
    color: token.primaryForeground
  },
  secondary: {
    backgroundColor: {
      default: token.secondary,
      ":is(button, a):hover": `color-mix(in oklch, ${token.secondary}, ${token.foreground} 5%)`
    },
    color: token.secondaryForeground
  },
  muted: {
    backgroundColor: {
      default: token.muted,
      ":is(button, a):hover": `color-mix(in oklch, ${token.muted}, ${token.foreground} 5%)`
    },
    color: token.foreground
  },
  tinted: {
    backgroundColor: {
      default: `oklch(from ${token.primary} 0.93 calc(c * 0.4) h)`,
      ":is(button, a):hover": `oklch(from ${token.primary} 0.88 calc(c * 0.5) h)`
    },
    color: token.foreground
  },
  outline: {
    borderColor: { default: token.border, ":is(button, a):focus-visible": token.ring },
    backgroundColor: { default: token.background, ":is(button, a):hover": token.ghostHover },
    color: token.foreground
  },
  ghost: {
    borderRadius: 0,
    backgroundColor: { default: "transparent", ":is(button, a):hover": token.ghostHover },
    padding: 0,
    color: token.foreground
  },
  destructive: {
    backgroundColor: {
      default: `color-mix(in oklch, ${token.destructive} ${token.destructiveOpacity}, transparent)`,
      ":is(button, a):hover": `color-mix(in oklch, ${token.destructive} ${token.destructiveHoverOpacity}, transparent)`
    },
    color: token.errorText
  },
  reactions: {
    position: "absolute",
    zIndex: 10,
    display: "flex",
    width: "fit-content",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--bridge-unit-4, 4px)",
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    backgroundColor: token.muted,
    paddingInline: { default: "var(--bridge-unit-6, 6px)", ":has(button)": 0 },
    paddingBlock: { default: "var(--bridge-unit-2, 2px)", ":has(button)": 0 },
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    boxShadow: `0 0 0 3px ${token.background}`
  },
  top: { top: 0, translate: "0 -75%" },
  bottom: { bottom: 0, translate: "0 75%" },
  start: { left: 12 },
  reactionEnd: { right: 12 }
})
export function BubbleGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: ComponentProps<"div"> & { variant?: Variant | null; align?: "start" | "end" }) {
  return (
    <Context value={variant}>
      <div
        data-slot="bubble"
        data-variant={variant}
        data-align={align}
        {...props}
        className={[
          stylex.props(
            stylex.defaultMarker(),
            style.root,
            align === "end" && style.end,
            variant === "ghost" && style.ghostRoot
          ).className,
          className
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </Context>
  )
}
export function BubbleContent({ className, render, ...props }: useRender.ComponentProps<"div">) {
  const variant = useContext(Context)
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: [stylex.props(style.content, variant && style[variant]).className, className]
          .filter(Boolean)
          .join(" ")
      },
      props
    ),
    render,
    state: { slot: "bubble-content" }
  })
}
export function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: ComponentProps<"div"> & { align?: "start" | "end"; side?: "top" | "bottom" }) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      {...props}
      className={[
        stylex.props(
          style.reactions,
          side === "top" ? style.top : style.bottom,
          align === "start" ? style.start : style.reactionEnd
        ).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  )
}

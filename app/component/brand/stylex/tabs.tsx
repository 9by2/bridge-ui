import { Tabs as Primitive } from "@base-ui/react/tabs"
import * as stylex from "@stylexjs/stylex"

import { effectToken, token } from "./token.stylex"

const style = stylex.create({
  relation: {
    flex: {
      default: 1,
      [stylex.when.ancestor('[data-variant="line"]')]: "0 0 auto",
      [stylex.when.ancestor('[data-variant="capsule"]')]: "0 0 auto",
      [stylex.when.ancestor('[data-variant="link"]')]: "0 0 auto"
    },
    width: { default: null, [stylex.when.ancestor('[data-orientation="vertical"]')]: "100%" },
    justifyContent: { default: "center", [stylex.when.ancestor('[data-orientation="vertical"]')]: "start" },
    backgroundColor: {
      default: "transparent",
      ":is([data-active])": {
        default: token.tabActiveBackground,
        [stylex.when.ancestor('[data-variant="line"]')]: "transparent",
        [stylex.when.ancestor('[data-variant="capsule"]')]: token.tabActiveBackground,
        [stylex.when.ancestor('[data-variant="link"]')]: "transparent"
      }
    },
    borderRadius: {
      default: 8,
      [stylex.when.ancestor('[data-variant="line"]')]: 0,
      [stylex.when.ancestor('[data-variant="capsule"]')]: 999,
      [stylex.when.ancestor('[data-variant="link"]')]: 0
    },
    paddingInline: {
      default: 6,
      [stylex.when.ancestor('[data-variant="capsule"]')]: 10,
      [stylex.when.ancestor('[data-variant="link"]')]: 0
    },
    paddingBlock: {
      default: 2,
      [stylex.when.ancestor('[data-variant="capsule"]')]: 4,
      [stylex.when.ancestor('[data-variant="link"]')]: 0
    },
    borderBottomWidth: { default: 0, [stylex.when.ancestor('[data-variant="line"]')]: 1 },
    borderBottomColor: {
      default: "transparent",
      [stylex.when.ancestor('[data-variant="line"]')]: {
        default: "transparent",
        ":is([data-active])": token.primary
      }
    },
    boxShadow: {
      default: "none",
      ":is([data-active])": {
        default: effectToken.shadowXs,
        [stylex.when.ancestor('[data-variant="line"]')]: "none"
      }
    }
  },
  root: {
    display: "flex",
    gap: 8,
    flexDirection: { default: "row", ':is([data-orientation="horizontal"])': "column" }
  },
  list: {
    boxSizing: "border-box",
    display: "inline-flex",
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    padding: 3,
    color: token.mutedForeground,
    height: { default: 32, [stylex.when.ancestor('[data-orientation="vertical"]')]: "fit-content" },
    flexDirection: { default: "row", [stylex.when.ancestor('[data-orientation="vertical"]')]: "column" }
  },
  default: { backgroundColor: token.muted },
  line: {
    gap: 4,
    width: "100%",
    justifyContent: "start",
    backgroundColor: token.background,
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border,
    padding: 0
  },
  capsule: { gap: 4, backgroundColor: token.background, padding: 0 },
  link: {
    gap: 16,
    width: "100%",
    height: 56,
    justifyContent: "start",
    overflowX: "auto",
    overflowY: "hidden",
    backgroundColor: token.background,
    borderRadius: 0,
    padding: 0
  },
  trigger: {
    position: { default: "relative", "::after": "absolute" },
    boxSizing: "border-box",
    display: "inline-flex",
    height: {
      default: "calc(100% - 1px)",
      [stylex.when.ancestor('[data-orientation="horizontal"]')]: { "::after": 2 },
      [stylex.when.ancestor('[data-orientation="vertical"]')]: { "::after": "100%" }
    },
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 0,
    borderStyle: "solid",
    fontFamily: { default: "inherit", [stylex.when.ancestor('[data-variant="link"]')]: token.fontHeading },
    fontSize: { default: 14, [stylex.when.ancestor('[data-variant="link"]')]: 16 },
    lineHeight: { default: "20px", [stylex.when.ancestor('[data-variant="link"]')]: "24px" },
    fontWeight: 500,
    whiteSpace: "nowrap",
    color: {
      default: token.tabInactive,
      ":hover": token.foreground,
      ":is([data-active])": {
        default: token.foreground,
        [stylex.when.ancestor('[data-variant="line"]')]: token.primary,
        [stylex.when.ancestor('[data-variant="link"]')]: `var(--bridge-color-brand-text, ${token.brandText})`
      }
    },
    transitionProperty: { default: "all", "::after": "opacity" },
    transitionDuration: "150ms",
    backgroundColor: {
      default: "transparent",
      ":is([data-active])": token.tabActiveBackground,
      "::after": token.foreground
    },
    borderColor: "transparent",
    outline: { default: "none", ":focus-visible": `1px solid ${token.ring}` },
    pointerEvents: { default: "auto", ":disabled": "none" },
    opacity: {
      default: 1,
      ":disabled": 0.5,
      "::after": 0,
      [stylex.when.ancestor('[data-variant="line"]')]: { ":is([data-active])::after": 1 }
    },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    content: { "::after": '""' },
    insetInline: {
      [stylex.when.ancestor('[data-orientation="horizontal"]')]: { "::after": 0 }
    },
    bottom: {
      [stylex.when.ancestor('[data-orientation="horizontal"]')]: { "::after": -5 }
    },
    insetBlock: {
      [stylex.when.ancestor('[data-orientation="vertical"]')]: { "::after": 0 }
    },
    right: {
      [stylex.when.ancestor('[data-orientation="vertical"]')]: { "::after": -4 }
    },
    width: {
      [stylex.when.ancestor('[data-orientation="vertical"]')]: { "::after": 2 }
    }
  },
  verticalTrigger: { width: "100%", justifyContent: "start" },
  content: { flex: 1, fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", outline: "none" }
})
export function Tabs({ className, orientation = "horizontal", ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      {...props}
      className={(state) =>
        [
          stylex.props(stylex.defaultMarker(), style.root).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function tabsListVariants({
  variant = "default",
  className,
  class: extra
}: { variant?: "default" | "line" | "link" | "capsule" | null; className?: string; class?: string } = {}) {
  return [stylex.props(stylex.defaultMarker(), style.list, variant && style[variant]).className, className, extra]
    .filter(Boolean)
    .join(" ")
}
export function TabsList({
  className,
  variant = "default",
  ...props
}: Primitive.List.Props & { variant?: "default" | "line" | "link" | "capsule" | null }) {
  return (
    <Primitive.List
      data-slot="tabs-list"
      data-variant={variant}
      {...props}
      className={(state) =>
        [tabsListVariants({ variant }), typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function TabsTrigger({ className, ...props }: Primitive.Tab.Props) {
  return (
    <Primitive.Tab
      data-slot="tabs-trigger"
      {...props}
      className={(state) =>
        [
          stylex.props(style.trigger, style.relation).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function TabsContent({ className, ...props }: Primitive.Panel.Props) {
  return (
    <Primitive.Panel
      data-slot="tabs-content"
      {...props}
      className={(state) =>
        [stylex.props(style.content).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}

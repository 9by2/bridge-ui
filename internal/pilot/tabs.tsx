import { Tabs as Primitive } from "@base-ui/react/tabs"
import * as stylex from "@stylexjs/stylex"

import { token } from "./token.stylex"

const style = stylex.create({
  relation: {
    width: { default: null, [stylex.when.ancestor('[data-orientation="vertical"]')]: "100%" },
    justifyContent: { default: "center", [stylex.when.ancestor('[data-orientation="vertical"]')]: "start" },
    backgroundColor: {
      default: "transparent",
      ":is([data-active])": {
        default: token.tabActiveBackground,
        [stylex.when.ancestor('[data-variant="line"]')]: "transparent"
      }
    },
    borderBottomColor: {
      default: "transparent",
      [stylex.when.ancestor('[data-variant="line"]')]: {
        default: "transparent",
        ":is([data-active])": token.foreground
      }
    }
  },
  defaultRelation: {
    borderBottomColor: { default: "transparent", ":is([data-active])": token.tabActiveBorder }
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
    borderRadius: 10,
    padding: 3,
    color: token.mutedForeground,
    height: { default: 32, [stylex.when.ancestor('[data-orientation="vertical"]')]: "fit-content" },
    flexDirection: { default: "row", [stylex.when.ancestor('[data-orientation="vertical"]')]: "column" }
  },
  default: { backgroundColor: token.muted },
  line: { gap: 4, backgroundColor: "transparent", borderRadius: 0 },
  trigger: {
    position: "relative",
    boxSizing: "border-box",
    display: "inline-flex",
    height: "calc(100% - 1px)",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    paddingInline: 6,
    paddingBlock: 2,
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    color: {
      default: token.tabInactive,
      ":hover": token.foreground,
      ":is([data-active])": token.foreground
    },
    transitionProperty: "all",
    transitionDuration: "150ms",
    backgroundColor: { default: "transparent", ":is([data-active])": token.tabActiveBackground },
    borderColor: { default: "transparent", ":is([data-active])": token.tabActiveBorder, ":focus-visible": token.ring },
    pointerEvents: { default: "auto", ":disabled": "none" },
    opacity: { default: 1, ":disabled": 0.5 },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  verticalTrigger: { width: "100%", justifyContent: "start" },
  lineTrigger: {
    backgroundColor: "transparent",
    borderBottomColor: { default: "transparent", ":is([data-active])": token.foreground }
  },
  content: { flex: 1, fontSize: 14, lineHeight: "20px", outline: "none" }
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
}: { variant?: "default" | "line" | null; className?: string; class?: string } = {}) {
  return [stylex.props(stylex.defaultMarker(), style.list, variant && style[variant]).className, className, extra]
    .filter(Boolean)
    .join(" ")
}
export function TabsList({
  className,
  variant = "default",
  ...props
}: Primitive.List.Props & { variant?: "default" | "line" | null }) {
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
          stylex.props(style.trigger, style.relation, style.defaultRelation).className,
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

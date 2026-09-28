import { Collapsible as Primitive } from "@base-ui/react/collapsible"
import * as stylex from "@stylexjs/stylex"
import { ChevronDownIcon } from "lucide-react"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    borderBottomWidth: { default: 0, ':is([data-variant="line"])': 1 },
    borderBottomStyle: "solid",
    borderBottomColor: token.border
  },
  trigger: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "var(--bridge-unit-8, 8px)",
    paddingBlock: "var(--bridge-unit-12, 12px)",
    textAlign: "left"
  },
  icon: {
    width: 16,
    height: 16,
    flexShrink: 0,
    transitionProperty: "rotate",
    transitionDuration: "150ms",
    rotate: { default: "0deg", ":is([data-panel-open])": "180deg" }
  },
  content: { paddingBottom: "var(--bridge-unit-12, 12px)" }
})

export function Collapsible({
  variant = "default",
  ...props
}: Primitive.Root.Props & { variant?: "default" | "line" }) {
  return <Primitive.Root data-slot="collapsible" data-variant={variant} {...props} {...stylex.props(style.root)} />
}
export function CollapsibleTrigger({
  children,
  className,
  showChevron = false,
  ...props
}: Primitive.Trigger.Props & { showChevron?: boolean }) {
  return (
    <Primitive.Trigger
      data-slot="collapsible-trigger"
      {...props}
      className={(state) =>
        [stylex.props(style.trigger).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      {children}
      {showChevron && <ChevronDownIcon aria-hidden="true" {...stylex.props(style.icon)} />}
    </Primitive.Trigger>
  )
}
export function CollapsibleContent({ className, ...props }: Primitive.Panel.Props) {
  return (
    <Primitive.Panel
      data-slot="collapsible-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}

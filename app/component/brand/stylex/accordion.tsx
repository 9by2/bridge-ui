import { Accordion as Primitive } from "@base-ui/react/accordion"
import * as stylex from "@stylexjs/stylex"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { token } from "./token.stylex"

const down = stylex.keyframes({ from: { height: 0 }, to: { height: "var(--accordion-panel-height)" } })
const up = stylex.keyframes({ from: { height: "var(--accordion-panel-height)" }, to: { height: 0 } })
const style = stylex.create({
  root: { display: "flex", width: "100%", flexDirection: "column" },
  item: {
    borderBottomWidth: { default: 1, ":last-child": 0 },
    borderBottomStyle: "solid",
    borderBottomColor: token.border
  },
  header: { display: "flex", margin: 0 },
  trigger: {
    position: "relative",
    display: "flex",
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: "transparent", ":focus-visible": token.ring },
    paddingBlock: "var(--bridge-unit-10, 10px)",
    paddingInline: 0,
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    fontWeight: 500,
    color: "inherit",
    backgroundColor: "transparent",
    transitionProperty: "all",
    transitionDuration: "150ms",
    outline: "none",
    textDecorationLine: { default: "none", ":hover": "underline" },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    pointerEvents: { default: "auto", ':is([aria-disabled="true"])': "none" },
    opacity: { default: 1, ':is([aria-disabled="true"])': 0.5 }
  },
  icon: {
    width: 16,
    height: 16,
    marginLeft: "auto",
    pointerEvents: "none",
    flexShrink: 0,
    color: token.mutedForeground
  },
  down: { display: { default: "inline", [stylex.when.ancestor('[aria-expanded="true"]')]: "none" } },
  up: { display: { default: "none", [stylex.when.ancestor('[aria-expanded="true"]')]: "inline" } },
  panel: {
    overflow: "hidden",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    animationName: down,
    animationDuration: { default: "200ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    animationTimingFunction: "ease-out"
  },
  closed: { animationName: up },
  content: { paddingTop: 0, paddingBottom: "var(--bridge-unit-10, 10px)" }
})
export function Accordion({ className, ...props }: Primitive.Root.Props) {
  return (
    <Primitive.Root
      data-slot="accordion"
      {...props}
      className={(state) =>
        [stylex.props(style.root).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function AccordionItem({ className, ...props }: Primitive.Item.Props) {
  return (
    <Primitive.Item
      data-slot="accordion-item"
      {...props}
      className={(state) =>
        [stylex.props(style.item).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function AccordionTrigger({ className, children, ...props }: Primitive.Trigger.Props) {
  return (
    <Primitive.Header {...stylex.props(style.header)}>
      <Primitive.Trigger
        data-slot="accordion-trigger"
        {...props}
        className={(state) =>
          [
            stylex.props(stylex.defaultMarker(), style.trigger).className,
            typeof className === "function" ? className(state) : className
          ]
            .filter(Boolean)
            .join(" ")
        }>
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon" {...stylex.props(style.icon, style.down)} />
        <ChevronUpIcon data-slot="accordion-trigger-icon" {...stylex.props(style.icon, style.up)} />
      </Primitive.Trigger>
    </Primitive.Header>
  )
}
export function AccordionContent({ className, children, ...props }: Primitive.Panel.Props) {
  return (
    <Primitive.Panel
      data-slot="accordion-content"
      {...props}
      className={(state) =>
        [
          stylex.props(style.panel, !state.open && style.closed).className,
          typeof className === "function" ? className(state) : undefined
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <div
        className={[stylex.props(style.content).className, typeof className === "string" ? className : undefined]
          .filter(Boolean)
          .join(" ")}>
        {children}
      </div>
    </Primitive.Panel>
  )
}

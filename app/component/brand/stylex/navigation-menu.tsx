import { NavigationMenu as Primitive } from "@base-ui/react/navigation-menu"
import * as stylex from "@stylexjs/stylex"
import { ChevronDownIcon } from "lucide-react"

import { Theme } from "./theme"
import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    maxWidth: "max-content",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  list: {
    display: "flex",
    flex: 1,
    listStyleType: "none",
    margin: 0,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 0
  },
  item: { position: "relative" },
  trigger: {
    display: "inline-flex",
    boxSizing: "border-box",
    height: 36,
    width: "max-content",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingInline: 10,
    paddingBlock: 6,
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    transitionProperty: "all",
    transitionDuration: "150ms",
    outline: "none",
    borderWidth: 0,
    color: "inherit",
    backgroundColor: {
      default: "transparent",
      ":hover": token.muted,
      ":focus": token.muted,
      ":is([data-popup-open], [data-open])": `color-mix(in oklch, ${token.muted}, transparent 50%)`
    },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    pointerEvents: { default: "auto", ":disabled": "none" },
    opacity: { default: 1, ":disabled": 0.5 }
  },
  chevron: {
    position: "relative",
    top: 1,
    marginLeft: 4,
    width: 12,
    height: 12,
    transitionProperty: "rotate",
    transitionDuration: "300ms",
    rotate: { default: "0deg", [stylex.when.ancestor(":is([data-popup-open], [data-open])")]: "180deg" }
  },
  content: {
    height: "100%",
    width: "auto",
    padding: 4,
    boxSizing: "border-box",
    transitionProperty: "opacity, transform, translate",
    transitionDuration: { default: "350ms", "@media (prefers-reduced-motion: reduce)": "0s" },
    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
    opacity: { default: 1, ":is([data-starting-style], [data-ending-style])": 0 },
    translate: {
      default: "none",
      ':is([data-ending-style][data-activation-direction="left"], [data-starting-style][data-activation-direction="right"])':
        "50% 0",
      ':is([data-ending-style][data-activation-direction="right"], [data-starting-style][data-activation-direction="left"])':
        "-50% 0"
    }
  },
  positioner: {
    isolation: "isolate",
    zIndex: 50,
    height: "var(--positioner-height)",
    width: "var(--positioner-width)",
    maxWidth: "var(--available-width)",
    transitionProperty: "top, left, right, bottom",
    transitionDuration: {
      default: "350ms",
      "@media (prefers-reduced-motion: reduce)": "0s",
      ":is([data-instant])": "0s"
    },
    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)"
  },
  popup: {
    position: "relative",
    height: "var(--popup-height)",
    width: "var(--popup-width)",
    transformOrigin: "var(--transform-origin)",
    borderRadius: 10,
    backgroundColor: token.background,
    color: token.foreground,
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%), 0 1px 3px rgb(0 0 0 / 10%)`,
    transitionProperty: "opacity, transform, width, height, scale, translate",
    transitionDuration: {
      default: "350ms",
      ":is([data-ending-style])": "150ms",
      "@media (prefers-reduced-motion: reduce)": "0s"
    },
    transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
    outline: "none",
    scale: { default: "1", ":is([data-starting-style], [data-ending-style])": "0.9" },
    opacity: { default: 1, ":is([data-starting-style], [data-ending-style])": 0 }
  },
  viewport: { position: "relative", width: "100%", height: "100%", overflow: "hidden" },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    borderRadius: { default: 10, ':is([data-slot="navigation-menu-content"] *)': 8 },
    padding: 8,
    fontSize: 14,
    lineHeight: "20px",
    color: "inherit",
    textDecorationLine: "none",
    transitionProperty: "all",
    transitionDuration: "150ms",
    outline: "none",
    backgroundColor: {
      default: "transparent",
      ":hover": token.muted,
      ":focus": token.muted,
      ":is([data-active])": `color-mix(in oklch, ${token.muted}, transparent 50%)`
    },
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` }
  },
  indicator: {
    top: "100%",
    zIndex: 1,
    display: "flex",
    height: 6,
    alignItems: "end",
    justifyContent: "center",
    overflow: "hidden"
  },
  arrow: {
    position: "relative",
    top: "60%",
    height: 8,
    width: 8,
    rotate: "45deg",
    borderTopLeftRadius: 6,
    backgroundColor: token.border,
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 10%)"
  }
})
export function NavigationMenu({
  align = "start",
  className,
  children,
  ...props
}: Primitive.Root.Props & Pick<Primitive.Positioner.Props, "align">) {
  return (
    <Primitive.Root
      data-slot="navigation-menu"
      {...props}
      className={(state) =>
        [stylex.props(style.root).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      {children}
      <NavigationMenuPositioner align={align} />
    </Primitive.Root>
  )
}
export function NavigationMenuList({ className, ...props }: Primitive.List.Props) {
  return (
    <Primitive.List
      data-slot="navigation-menu-list"
      {...props}
      className={(state) =>
        [stylex.props(style.list).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function NavigationMenuItem({ className, ...props }: Primitive.Item.Props) {
  return (
    <Primitive.Item
      data-slot="navigation-menu-item"
      {...props}
      className={(state) =>
        [stylex.props(style.item).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function navigationMenuTriggerStyle({ className, class: extra }: { className?: string; class?: string } = {}) {
  return [stylex.props(stylex.defaultMarker(), style.trigger).className, className, extra].filter(Boolean).join(" ")
}
export function NavigationMenuTrigger({ className, children, ...props }: Primitive.Trigger.Props) {
  return (
    <Primitive.Trigger
      data-slot="navigation-menu-trigger"
      {...props}
      className={(state) =>
        [navigationMenuTriggerStyle(), typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      {children} <ChevronDownIcon aria-hidden="true" {...stylex.props(style.chevron)} />
    </Primitive.Trigger>
  )
}
export function NavigationMenuContent({ className, ...props }: Primitive.Content.Props) {
  return (
    <Primitive.Content
      data-slot="navigation-menu-content"
      {...props}
      className={(state) =>
        [stylex.props(style.content).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function NavigationMenuPositioner({
  className,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  ...props
}: Primitive.Positioner.Props) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          {...props}
          className={(state) =>
            [stylex.props(style.positioner).className, typeof className === "function" ? className(state) : className]
              .filter(Boolean)
              .join(" ")
          }>
          <Primitive.Popup {...stylex.props(style.popup)}>
            <Primitive.Viewport {...stylex.props(style.viewport)} />
          </Primitive.Popup>
        </Primitive.Positioner>
      </Theme>
    </Primitive.Portal>
  )
}
export function NavigationMenuLink({ className, ...props }: Primitive.Link.Props) {
  return (
    <Primitive.Link
      data-slot="navigation-menu-link"
      {...props}
      className={(state) =>
        [stylex.props(style.link).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function NavigationMenuIndicator({ className, ...props }: Primitive.Icon.Props) {
  return (
    <Primitive.Icon
      data-slot="navigation-menu-indicator"
      {...props}
      className={(state) =>
        [stylex.props(style.indicator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      <div {...stylex.props(style.arrow)} />
    </Primitive.Icon>
  )
}

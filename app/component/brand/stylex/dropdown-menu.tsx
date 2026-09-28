import { Menu as Primitive } from "@base-ui/react/menu"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { Theme } from "./theme"
import { effectToken, token } from "./token.stylex"

const enter = stylex.keyframes({ from: { opacity: 0, scale: "0.95" }, to: { opacity: 1, scale: "1" } })
const exit = stylex.keyframes({ from: { opacity: 1, scale: "1" }, to: { opacity: 0, scale: "0.95" } })
export const menuStyle = stylex.create({
  positioner: { isolation: "isolate", zIndex: 50, outline: "none" },
  popup: {
    zIndex: 50,
    boxSizing: "border-box",
    maxHeight: "var(--available-height)",
    width: "var(--anchor-width)",
    minWidth: 128,
    transformOrigin: "var(--transform-origin)",
    overflowX: "hidden",
    overflowY: "auto",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    backgroundColor: token.background,
    padding: "var(--bridge-unit-4, 4px)",
    color: token.foreground,
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%), ${effectToken.shadowMd}`,
    outline: "none",
    animationName: enter,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  closed: { animationName: exit, overflow: "hidden" },
  sub: {
    width: "auto",
    minWidth: 96,
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%), ${effectToken.shadowLg}`
  },
  label: {
    paddingInline: "var(--bridge-unit-6, 6px)",
    paddingBlock: "var(--bridge-unit-4, 4px)",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    fontWeight: 500,
    color: token.mutedForeground
  },
  inset: { paddingLeft: "var(--bridge-unit-28, 28px)" },
  item: {
    position: "relative",
    display: "flex",
    cursor: "default",
    alignItems: "center",
    gap: "var(--bridge-unit-6, 6px)",
    borderRadius: "var(--bridge-radius-8, 0.5em)",
    paddingInline: "var(--bridge-unit-6, 6px)",
    paddingBlock: "var(--bridge-unit-4, 4px)",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    outline: "2px solid transparent",
    outlineOffset: 2,
    userSelect: "none",
    backgroundColor: { default: "transparent", ":focus": token.accent },
    color: { default: token.foreground, ":focus": token.accentForeground },
    pointerEvents: { default: "auto", ":is([data-disabled])": "none" },
    opacity: { default: 1, ":is([data-disabled])": 0.5 }
  },
  destructive: {
    color: token.errorText,
    backgroundColor: {
      default: "transparent",
      ":focus": `color-mix(in oklch, ${token.destructive} ${token.destructiveOpacity}, transparent)`
    }
  },
  subTrigger: {
    position: "static",
    backgroundColor: {
      default: "transparent",
      ":focus": token.accent,
      ":is([data-popup-open], [data-open])": token.accent
    },
    color: {
      default: token.foreground,
      ":focus": token.accentForeground,
      ":is([data-popup-open], [data-open])": token.accentForeground
    }
  },
  selection: { paddingRight: "var(--bridge-unit-32, 32px)" },
  indicator: {
    pointerEvents: "none",
    position: "absolute",
    right: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  icon: { width: 16, height: 16, pointerEvents: "none", flexShrink: 0 },
  chevron: { marginLeft: "auto" },
  separator: { marginInline: -4, marginBlock: 4, height: 1, backgroundColor: token.border },
  shortcut: {
    marginLeft: "auto",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    letterSpacing: "0.1em",
    color: { default: token.mutedForeground, [stylex.when.ancestor(":focus")]: token.accentForeground }
  }
})
export function DropdownMenu(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function DropdownMenuPortal({ children, ...props }: Primitive.Portal.Props) {
  return (
    <Primitive.Portal data-slot="dropdown-menu-portal" {...props}>
      <Theme>{children}</Theme>
    </Primitive.Portal>
  )
}
export function DropdownMenuTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}
export function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: Primitive.Popup.Props & Pick<Primitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          {...stylex.props(menuStyle.positioner)}>
          <Primitive.Popup
            data-slot="dropdown-menu-content"
            {...props}
            className={(state) =>
              [
                stylex.props(menuStyle.popup, !state.open && menuStyle.closed).className,
                typeof className === "function" ? className(state) : className
              ]
                .filter(Boolean)
                .join(" ")
            }
          />
        </Primitive.Positioner>
      </Theme>
    </Primitive.Portal>
  )
}
export function DropdownMenuGroup(props: Primitive.Group.Props) {
  return <Primitive.Group data-slot="dropdown-menu-group" {...props} />
}
export function DropdownMenuLabel({ className, inset, ...props }: Primitive.GroupLabel.Props & { inset?: boolean }) {
  return (
    <Primitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.label, inset && menuStyle.inset).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: Primitive.Item.Props & { inset?: boolean; variant?: "default" | "destructive" }) {
  return (
    <Primitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      {...props}
      className={(state) =>
        [
          stylex.props(
            stylex.defaultMarker(),
            menuStyle.item,
            inset && menuStyle.inset,
            variant === "destructive" && menuStyle.destructive
          ).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function DropdownMenuSub(props: Primitive.SubmenuRoot.Props) {
  return <Primitive.SubmenuRoot {...props} />
}
export function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: Primitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <Primitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.item, menuStyle.subTrigger, inset && menuStyle.inset).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      {children}
      <ChevronRightIcon {...stylex.props(menuStyle.icon, menuStyle.chevron)} />
    </Primitive.SubmenuTrigger>
  )
}
export function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          {...stylex.props(menuStyle.positioner)}>
          <Primitive.Popup
            data-slot="dropdown-menu-sub-content"
            {...props}
            className={(state) =>
              [
                stylex.props(menuStyle.popup, menuStyle.sub, !state.open && menuStyle.closed).className,
                typeof className === "function" ? className(state) : className
              ]
                .filter(Boolean)
                .join(" ")
            }
          />
        </Primitive.Positioner>
      </Theme>
    </Primitive.Portal>
  )
}
export function DropdownMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: Primitive.CheckboxItem.Props & { inset?: boolean }) {
  return (
    <Primitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.item, menuStyle.selection, inset && menuStyle.inset).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <span data-slot="dropdown-menu-checkbox-item-indicator" {...stylex.props(menuStyle.indicator)}>
        <Primitive.CheckboxItemIndicator>
          <CheckIcon {...stylex.props(menuStyle.icon)} />
        </Primitive.CheckboxItemIndicator>
      </span>
      {children}
    </Primitive.CheckboxItem>
  )
}
export function DropdownMenuRadioGroup(props: Primitive.RadioGroup.Props) {
  return <Primitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}
export function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: Primitive.RadioItem.Props & { inset?: boolean }) {
  return (
    <Primitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.item, menuStyle.selection, inset && menuStyle.inset).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <span data-slot="dropdown-menu-radio-item-indicator" {...stylex.props(menuStyle.indicator)}>
        <Primitive.RadioItemIndicator>
          <CheckIcon {...stylex.props(menuStyle.icon)} />
        </Primitive.RadioItemIndicator>
      </span>
      {children}
    </Primitive.RadioItem>
  )
}
export function DropdownMenuSeparator({ className, ...props }: Primitive.Separator.Props) {
  return (
    <Primitive.Separator
      data-slot="dropdown-menu-separator"
      {...props}
      className={(state) =>
        [stylex.props(menuStyle.separator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      {...props}
      className={[stylex.props(menuStyle.shortcut).className, className].filter(Boolean).join(" ")}
    />
  )
}

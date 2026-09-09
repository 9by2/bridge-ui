import { ContextMenu as Primitive } from "@base-ui/react/context-menu"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon, ChevronRightIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { menuStyle } from "./dropdown-menu"
import { Theme } from "./theme"

const style = stylex.create({
  trigger: { userSelect: "none" },
  popup: { width: "auto", minWidth: 144 },
  sub: { boxShadow: "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)" },
  indicator: { position: "absolute", right: 8, pointerEvents: "none" }
})
export function ContextMenu(props: Primitive.Root.Props) {
  return <Primitive.Root {...props} />
}
export function ContextMenuPortal({ children, ...props }: Primitive.Portal.Props) {
  return (
    <Primitive.Portal data-slot="context-menu-portal" {...props}>
      <Theme>{children}</Theme>
    </Primitive.Portal>
  )
}
export function ContextMenuTrigger({ className, ...props }: Primitive.Trigger.Props) {
  return (
    <Primitive.Trigger
      data-slot="context-menu-trigger"
      {...props}
      className={(state) =>
        [stylex.props(style.trigger).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ContextMenuContent({
  className,
  align = "start",
  alignOffset = 4,
  side = "right",
  sideOffset = 0,
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
            data-slot="context-menu-content"
            {...props}
            className={(state) =>
              [
                stylex.props(menuStyle.popup, style.popup, !state.open && menuStyle.closed).className,
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
export function ContextMenuGroup(props: Primitive.Group.Props) {
  return <Primitive.Group data-slot="context-menu-group" {...props} />
}
export function ContextMenuLabel({ className, inset, ...props }: Primitive.GroupLabel.Props & { inset?: boolean }) {
  return (
    <Primitive.GroupLabel
      data-slot="context-menu-label"
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
export function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: Primitive.Item.Props & { inset?: boolean; variant?: "default" | "destructive" }) {
  return (
    <Primitive.Item
      data-slot="context-menu-item"
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
export function ContextMenuSub(props: Primitive.SubmenuRoot.Props) {
  return <Primitive.SubmenuRoot {...props} />
}
export function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: Primitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <Primitive.SubmenuTrigger
      data-slot="context-menu-sub-trigger"
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
export function ContextMenuSubContent({ className, ...props }: ComponentProps<typeof ContextMenuContent>) {
  return (
    <ContextMenuContent
      data-slot="context-menu-sub-content"
      side="right"
      {...props}
      className={(state) =>
        [stylex.props(style.sub).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ContextMenuCheckboxItem({
  className,
  children,
  inset,
  ...props
}: Primitive.CheckboxItem.Props & { inset?: boolean }) {
  return (
    <Primitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
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
      <span {...stylex.props(style.indicator)}>
        <Primitive.CheckboxItemIndicator>
          <CheckIcon {...stylex.props(menuStyle.icon)} />
        </Primitive.CheckboxItemIndicator>
      </span>
      {children}
    </Primitive.CheckboxItem>
  )
}
export function ContextMenuRadioGroup(props: Primitive.RadioGroup.Props) {
  return <Primitive.RadioGroup data-slot="context-menu-radio-group" {...props} />
}
export function ContextMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: Primitive.RadioItem.Props & { inset?: boolean }) {
  return (
    <Primitive.RadioItem
      data-slot="context-menu-radio-item"
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
      <span {...stylex.props(style.indicator)}>
        <Primitive.RadioItemIndicator>
          <CheckIcon {...stylex.props(menuStyle.icon)} />
        </Primitive.RadioItemIndicator>
      </span>
      {children}
    </Primitive.RadioItem>
  )
}
export function ContextMenuSeparator({ className, ...props }: Primitive.Separator.Props) {
  return (
    <Primitive.Separator
      data-slot="context-menu-separator"
      {...props}
      className={(state) =>
        [stylex.props(menuStyle.separator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ContextMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      {...props}
      className={[stylex.props(menuStyle.shortcut).className, className].filter(Boolean).join(" ")}
    />
  )
}

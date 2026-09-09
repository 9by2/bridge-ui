import { Menu as Primitive } from "@base-ui/react/menu"
import { Menubar as Bar } from "@base-ui/react/menubar"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon } from "lucide-react"
import type { ComponentProps } from "react"

import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  type DropdownMenuContent,
  menuStyle
} from "./dropdown-menu"
import { Theme } from "./theme"
import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    boxSizing: "border-box",
    display: "flex",
    height: 32,
    alignItems: "center",
    gap: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    padding: 3
  },
  trigger: {
    display: "flex",
    alignItems: "center",
    borderRadius: 6,
    paddingInline: 6,
    paddingBlock: 2,
    fontSize: 14,
    lineHeight: "20px",
    fontFamily: "inherit",
    fontWeight: 500,
    outline: "2px solid transparent",
    outlineOffset: 2,
    userSelect: "none",
    borderWidth: 0,
    color: "inherit",
    backgroundColor: { default: "transparent", ":hover": token.muted, ':is([aria-expanded="true"])': token.muted }
  },
  content: { minWidth: 144 },
  selection: { paddingLeft: 28, paddingRight: 6 },
  indicator: {
    pointerEvents: "none",
    position: "absolute",
    left: 6,
    display: "flex",
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center"
  },
  label: { fontSize: 14, lineHeight: "20px" },
  sub: { minWidth: 128 }
})
export function Menubar({ className, ...props }: Bar.Props) {
  return (
    <Bar
      data-slot="menubar"
      {...props}
      className={(state) =>
        [stylex.props(style.root).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function MenubarMenu(props: ComponentProps<typeof DropdownMenu>) {
  return <DropdownMenu {...props} />
}
export function MenubarPortal(props: ComponentProps<typeof DropdownMenuPortal>) {
  return <DropdownMenuPortal data-slot="menubar-portal" {...props} />
}
export function MenubarGroup(props: ComponentProps<typeof DropdownMenuGroup>) {
  return <DropdownMenuGroup data-slot="menubar-group" {...props} />
}
export function MenubarTrigger({ className, ...props }: ComponentProps<typeof DropdownMenuTrigger>) {
  return (
    <DropdownMenuTrigger
      data-slot="menubar-trigger"
      {...props}
      className={(state) =>
        [stylex.props(style.trigger).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  side = "bottom",
  ...props
}: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          side={side}
          {...stylex.props(menuStyle.positioner)}>
          <Primitive.Popup
            data-slot="menubar-content"
            {...props}
            className={(state) =>
              [
                stylex.props(menuStyle.popup, style.content, !state.open && menuStyle.closed).className,
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
export function MenubarItem(props: ComponentProps<typeof DropdownMenuItem>) {
  return <DropdownMenuItem data-slot="menubar-item" {...props} />
}
export function MenubarCheckboxItem({
  className,
  children,
  inset,
  ...props
}: Primitive.CheckboxItem.Props & { inset?: boolean }) {
  return (
    <Primitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      data-inset={inset}
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.item, style.selection).className,
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
export function MenubarRadioGroup(props: ComponentProps<typeof DropdownMenuRadioGroup>) {
  return <DropdownMenuRadioGroup data-slot="menubar-radio-group" {...props} />
}
export function MenubarRadioItem({
  className,
  children,
  inset,
  ...props
}: Primitive.RadioItem.Props & { inset?: boolean }) {
  return (
    <Primitive.RadioItem
      data-slot="menubar-radio-item"
      data-inset={inset}
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.item, style.selection).className,
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
export function MenubarLabel({ className, inset, ...props }: Primitive.GroupLabel.Props & { inset?: boolean }) {
  return (
    <Primitive.GroupLabel
      data-slot="menubar-label"
      data-inset={inset}
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.label, style.label, inset && menuStyle.inset).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function MenubarSeparator(props: ComponentProps<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator data-slot="menubar-separator" {...props} />
}
export function MenubarShortcut(props: ComponentProps<typeof DropdownMenuShortcut>) {
  return <DropdownMenuShortcut data-slot="menubar-shortcut" {...props} />
}
export function MenubarSub(props: ComponentProps<typeof DropdownMenuSub>) {
  return <DropdownMenuSub {...props} />
}
export function MenubarSubTrigger(props: ComponentProps<typeof DropdownMenuSubTrigger>) {
  return <DropdownMenuSubTrigger data-slot="menubar-sub-trigger" {...props} />
}
export function MenubarSubContent({
  className,
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
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
            data-slot="menubar-sub-content"
            {...props}
            className={(state) =>
              [
                stylex.props(menuStyle.popup, menuStyle.sub, style.sub, !state.open && menuStyle.closed).className,
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

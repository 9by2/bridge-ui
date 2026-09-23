import { Combobox as Primitive } from "@base-ui/react/combobox"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { useRef } from "react"

import { Button } from "./button"
import { menuStyle } from "./dropdown-menu"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./input-group"
import { Theme } from "./theme"
import { token } from "./token.stylex"

const style = stylex.create({
  icon: { width: 16, height: 16, pointerEvents: "none", color: token.mutedForeground },
  inputGroup: { width: "auto" },
  trigger: {
    display: { default: "inline-flex", ':is([data-slot="input-group"]:has([data-slot="combobox-clear"]) *)': "none" },
    backgroundColor: { default: null, ":is([data-pressed])": "transparent" }
  },
  popup: {
    position: "relative",
    maxWidth: "var(--available-width)",
    minWidth: "calc(var(--anchor-width) + 28px)",
    overflow: "hidden",
    overflowY: "hidden",
    padding: 0
  },
  anchored: { minWidth: "var(--anchor-width)" },
  list: {
    maxHeight: "min(252px, calc(var(--available-height) - 36px))",
    scrollPaddingBlock: 4,
    overflowY: "auto",
    overscrollBehavior: "contain",
    padding: { default: 4, ":is([data-empty])": 0 },
    scrollbarWidth: "none"
  },
  item: {
    width: "100%",
    boxSizing: "border-box",
    gap: 8,
    backgroundColor: { default: "transparent", ":is([data-highlighted])": token.accent },
    color: { default: token.foreground, ":is([data-highlighted])": token.accentForeground }
  },
  label: { paddingInline: 8, paddingBlock: 6, fontSize: "var(--bridge-font-size-sm, 0.75em)", lineHeight: "16px", color: token.mutedForeground },
  empty: {
    display: { default: "none", [stylex.when.ancestor("[data-empty]")]: "flex" },
    width: "100%",
    justifyContent: "center",
    paddingBlock: 8,
    textAlign: "center",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    color: token.mutedForeground
  },
  chips: {
    boxSizing: "border-box",
    display: "flex",
    minHeight: 32,
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: token.input,
      ":focus-within": token.ring,
      ':has([aria-invalid="true"])': token.invalidBorder
    },
    backgroundColor: token.inputBackground,
    backgroundClip: "padding-box",
    paddingInline: { default: 10, ':has([data-slot="combobox-chip"])': 4 },
    paddingBlock: 4,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    boxShadow: {
      default: "none",
      ":focus-within": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`,
      ':has([aria-invalid="true"])': `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
    }
  },
  chip: {
    display: "flex",
    height: 21,
    width: "fit-content",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: "var(--bridge-radius-6, 0.375em)",
    backgroundColor: token.muted,
    paddingInline: 6,
    paddingRight: { default: 6, ':has([data-slot="combobox-chip-remove"])': 0 },
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    color: token.foreground,
    pointerEvents: { default: "auto", ":has(:disabled)": "none" },
    cursor: { default: "default", ":has(:disabled)": "not-allowed" },
    opacity: { default: 1, ":has(:disabled)": 0.5 }
  },
  remove: { marginLeft: -4, opacity: { default: 0.5, ":hover": 1 } },
  chipInput: {
    minWidth: 64,
    flex: 1,
    outline: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    font: "inherit",
    color: "inherit"
  }
})
export const Combobox = Primitive.Root
export function ComboboxValue(props: Primitive.Value.Props) {
  return <Primitive.Value data-slot="combobox-value" {...props} />
}
export function ComboboxTrigger({ children, ...props }: Primitive.Trigger.Props) {
  return (
    <Primitive.Trigger data-slot="combobox-trigger" {...props}>
      {children}
      <ChevronDownIcon {...stylex.props(style.icon)} />
    </Primitive.Trigger>
  )
}
export function ComboboxButton({ children, ...props }: Primitive.Trigger.Props) {
  return (
    <Primitive.Trigger
      data-slot="combobox-button"
      render={<Button variant="outline" />}
      aria-label={props["aria-label"] ?? (typeof children === "string" ? children : undefined)}
      {...props}>
      {children}
      <ChevronDownIcon {...stylex.props(style.icon)} />
    </Primitive.Trigger>
  )
}
function ComboboxClear(props: Primitive.Clear.Props) {
  return (
    <Primitive.Clear data-slot="combobox-clear" render={<InputGroupButton variant="ghost" size="icon-xs" />} {...props}>
      <XIcon {...stylex.props(style.icon)} />
    </Primitive.Clear>
  )
}
export function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: Primitive.Input.Props & { showTrigger?: boolean; showClear?: boolean }) {
  return (
    <InputGroup
      className={[stylex.props(style.inputGroup).className, typeof className === "string" ? className : undefined]
        .filter(Boolean)
        .join(" ")}>
      <Primitive.Input
        render={<InputGroupInput disabled={disabled} />}
        className={typeof className === "function" ? className : undefined}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className={stylex.props(style.trigger).className}
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}
export function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: Primitive.Popup.Props &
  Pick<Primitive.Positioner.Props, "side" | "sideOffset" | "align" | "alignOffset" | "anchor">) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          anchor={anchor}
          {...stylex.props(menuStyle.positioner)}>
          <Primitive.Popup
            data-slot="combobox-content"
            data-chips={!!anchor}
            {...props}
            className={(state) =>
              [
                stylex.props(
                  stylex.defaultMarker(),
                  menuStyle.popup,
                  style.popup,
                  !!anchor && style.anchored,
                  !state.open && menuStyle.closed
                ).className,
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
export function ComboboxList({ className, ...props }: Primitive.List.Props) {
  return (
    <Primitive.List
      data-slot="combobox-list"
      {...props}
      className={(state) =>
        [stylex.props(style.list).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ComboboxItem({ className, children, ...props }: Primitive.Item.Props) {
  return (
    <Primitive.Item
      data-slot="combobox-item"
      {...props}
      className={(state) =>
        [
          stylex.props(menuStyle.item, menuStyle.selection, style.item).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      {children}
      <Primitive.ItemIndicator render={<span {...stylex.props(menuStyle.indicator)} />}>
        <CheckIcon {...stylex.props(style.icon)} />
      </Primitive.ItemIndicator>
    </Primitive.Item>
  )
}
export function ComboboxGroup(props: Primitive.Group.Props) {
  return <Primitive.Group data-slot="combobox-group" {...props} />
}
export function ComboboxLabel({ className, ...props }: Primitive.GroupLabel.Props) {
  return (
    <Primitive.GroupLabel
      data-slot="combobox-label"
      {...props}
      className={(state) =>
        [stylex.props(style.label).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ComboboxCollection(props: Primitive.Collection.Props) {
  return <Primitive.Collection data-slot="combobox-collection" {...props} />
}
export function ComboboxEmpty({ className, ...props }: Primitive.Empty.Props) {
  return (
    <Primitive.Empty
      data-slot="combobox-empty"
      {...props}
      className={(state) =>
        [stylex.props(style.empty).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ComboboxSeparator({ className, ...props }: Primitive.Separator.Props) {
  return (
    <Primitive.Separator
      data-slot="combobox-separator"
      {...props}
      className={(state) =>
        [stylex.props(menuStyle.separator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ComboboxChips({ className, ...props }: Primitive.Chips.Props) {
  return (
    <Primitive.Chips
      data-slot="combobox-chips"
      {...props}
      className={(state) =>
        [stylex.props(style.chips).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: Primitive.Chip.Props & { showRemove?: boolean }) {
  return (
    <Primitive.Chip
      data-slot="combobox-chip"
      {...props}
      className={(state) =>
        [stylex.props(style.chip).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      {children}
      {showRemove && (
        <Primitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className={stylex.props(style.remove).className}
          data-slot="combobox-chip-remove">
          <XIcon {...stylex.props(style.icon)} />
        </Primitive.ChipRemove>
      )}
    </Primitive.Chip>
  )
}
export function ComboboxChipsInput({ className, ...props }: Primitive.Input.Props) {
  return (
    <Primitive.Input
      data-slot="combobox-chip-input"
      {...props}
      className={(state) =>
        [stylex.props(style.chipInput).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function useComboboxAnchor() {
  return useRef<HTMLDivElement | null>(null)
}

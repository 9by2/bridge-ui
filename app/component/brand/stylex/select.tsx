import { Select as Primitive } from "@base-ui/react/select"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { Theme } from "./theme"
import { token } from "./token.stylex"

const enter = stylex.keyframes({ from: { opacity: 0, scale: "0.95" }, to: { opacity: 1, scale: "1" } })
const exit = stylex.keyframes({ from: { opacity: 1, scale: "1" }, to: { opacity: 0, scale: "0.95" } })
const style = stylex.create({
  group: { scrollMarginBlock: 4, padding: 4 },
  value: {
    display: "flex",
    flex: 1,
    textAlign: "left",
    alignItems: "center",
    gap: 6,
    overflow: "hidden",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical"
  },
  trigger: {
    boxSizing: "border-box",
    display: "flex",
    width: "fit-content",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.input, ":focus-visible": token.ring },
    backgroundColor: {
      default: token.inputBackground,
      ":hover": {
        [stylex.when.ancestor('[data-pilot-theme="cue"]')]: `color-mix(in oklch, ${token.input}, transparent 50%)`
      }
    },
    paddingBlock: 8,
    paddingRight: 8,
    paddingLeft: 10,
    fontFamily: "inherit",
    fontSize: 14,
    lineHeight: "20px",
    whiteSpace: "nowrap",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outline: "none",
    userSelect: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)` },
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    opacity: { default: 1, ":disabled": 0.5 },
    color: { default: token.foreground, ":is([data-placeholder])": token.mutedForeground },
    height: 32
  },
  small: { height: 28, borderRadius: 8 },
  unstyled: {
    width: "fit-content",
    height: "auto",
    gap: 6,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: "transparent",
    padding: 0,
    boxShadow: "none"
  },
  invalid: {
    borderColor: token.invalidBorder,
    boxShadow: `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
  },
  icon: { width: 16, height: 16, pointerEvents: "none", flexShrink: 0 },
  mutedIcon: { color: token.mutedForeground },
  positioner: { isolation: "isolate", zIndex: 50 },
  popup: {
    position: "relative",
    isolation: "isolate",
    zIndex: 50,
    maxHeight: "var(--available-height)",
    width: "var(--anchor-width)",
    minWidth: 144,
    transformOrigin: "var(--transform-origin)",
    overflowX: "hidden",
    overflowY: "auto",
    borderRadius: 10,
    backgroundColor: token.background,
    color: token.foreground,
    boxShadow: `0 0 0 1px color-mix(in oklch, ${token.foreground}, transparent 90%), 0 4px 6px -1px rgb(0 0 0 / 10%), 0 2px 4px -2px rgb(0 0 0 / 10%)`,
    animationName: enter,
    animationDuration: { default: "100ms", "@media (prefers-reduced-motion: reduce)": "0s" }
  },
  closed: { animationName: exit },
  aligned: { animationName: "none" },
  label: { paddingInline: 6, paddingBlock: 4, fontSize: 12, lineHeight: "16px", color: token.mutedForeground },
  item: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    cursor: "default",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
    paddingBlock: 4,
    paddingRight: 32,
    paddingLeft: 6,
    fontSize: 14,
    lineHeight: "20px",
    outline: "2px solid transparent",
    outlineOffset: 2,
    userSelect: "none",
    backgroundColor: { default: "transparent", ":focus": token.accent },
    color: { default: token.foreground, ":focus": token.accentForeground },
    pointerEvents: { default: "auto", ":is([data-disabled])": "none" },
    opacity: { default: 1, ":is([data-disabled])": 0.5 }
  },
  text: { display: "flex", flex: 1, flexShrink: 0, gap: 8, whiteSpace: "nowrap" },
  indicator: {
    position: "absolute",
    right: 8,
    display: "flex",
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none"
  },
  separator: { pointerEvents: "none", marginInline: -4, marginBlock: 4, height: 1, backgroundColor: token.border },
  arrow: {
    zIndex: 10,
    display: "flex",
    width: "100%",
    cursor: "default",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: token.background,
    paddingBlock: 4
  },
  top: { top: 0 },
  bottom: { bottom: 0 }
})
export const Select = Primitive.Root
export function SelectGroup({ className, ...props }: Primitive.Group.Props) {
  return (
    <Primitive.Group
      data-slot="select-group"
      {...props}
      className={(state) =>
        [stylex.props(style.group).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function SelectValue({ className, ...props }: Primitive.Value.Props) {
  return (
    <Primitive.Value
      data-slot="select-value"
      {...props}
      className={(state) =>
        [stylex.props(style.value).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function SelectTrigger({
  className,
  size = "default",
  appearance = "default",
  children,
  ...props
}: Primitive.Trigger.Props & { size?: "default" | "sm"; appearance?: "default" | "unstyled" }) {
  return (
    <Primitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-appearance={appearance}
      {...props}
      className={(state) =>
        [
          stylex.props(
            appearance === "unstyled" ? style.unstyled : style.trigger,
            appearance === "default" && size === "sm" && style.small,
            (props["aria-invalid"] === true || props["aria-invalid"] === "true") && style.invalid
          ).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      {children}
      <Primitive.Icon render={<ChevronDownIcon {...stylex.props(style.icon, style.mutedIcon)} />} />
    </Primitive.Trigger>
  )
}
export function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: Primitive.Popup.Props &
  Pick<Primitive.Positioner.Props, "side" | "sideOffset" | "align" | "alignOffset" | "alignItemWithTrigger">) {
  return (
    <Primitive.Portal>
      <Theme>
        <Primitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          alignItemWithTrigger={alignItemWithTrigger}
          {...stylex.props(style.positioner)}>
          <Primitive.Popup
            data-slot="select-content"
            data-align-trigger={alignItemWithTrigger}
            {...props}
            className={(state) =>
              [
                stylex.props(style.popup, !state.open && style.closed, alignItemWithTrigger && style.aligned).className,
                typeof className === "function" ? className(state) : className
              ]
                .filter(Boolean)
                .join(" ")
            }>
            <SelectScrollUpButton />
            <Primitive.List>{children}</Primitive.List>
            <SelectScrollDownButton />
          </Primitive.Popup>
        </Primitive.Positioner>
      </Theme>
    </Primitive.Portal>
  )
}
export function SelectLabel({ className, ...props }: Primitive.GroupLabel.Props) {
  return (
    <Primitive.GroupLabel
      data-slot="select-label"
      {...props}
      className={(state) =>
        [stylex.props(style.label).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function SelectItem({ className, children, ...props }: Primitive.Item.Props) {
  return (
    <Primitive.Item
      data-slot="select-item"
      {...props}
      className={(state) =>
        [stylex.props(style.item).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      <Primitive.ItemText {...stylex.props(style.text)}>{children}</Primitive.ItemText>
      <Primitive.ItemIndicator render={<span {...stylex.props(style.indicator)} />}>
        <CheckIcon {...stylex.props(style.icon)} />
      </Primitive.ItemIndicator>
    </Primitive.Item>
  )
}
export function SelectSeparator({ className, ...props }: Primitive.Separator.Props) {
  return (
    <Primitive.Separator
      data-slot="select-separator"
      {...props}
      className={(state) =>
        [stylex.props(style.separator).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }
    />
  )
}
export function SelectScrollUpButton({ className, ...props }: Primitive.ScrollUpArrow.Props) {
  return (
    <Primitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      {...props}
      className={(state) =>
        [stylex.props(style.arrow, style.top).className, typeof className === "function" ? className(state) : className]
          .filter(Boolean)
          .join(" ")
      }>
      <ChevronUpIcon {...stylex.props(style.icon)} />
    </Primitive.ScrollUpArrow>
  )
}
export function SelectScrollDownButton({ className, ...props }: Primitive.ScrollDownArrow.Props) {
  return (
    <Primitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      {...props}
      className={(state) =>
        [
          stylex.props(style.arrow, style.bottom).className,
          typeof className === "function" ? className(state) : className
        ]
          .filter(Boolean)
          .join(" ")
      }>
      <ChevronDownIcon {...stylex.props(style.icon)} />
    </Primitive.ScrollDownArrow>
  )
}

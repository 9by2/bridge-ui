import * as stylex from "@stylexjs/stylex"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"
import { useContext, type ComponentProps } from "react"

import { token } from "./token.stylex"

const blink = stylex.keyframes({ "0%, 70%, 100%": { opacity: 1 }, "20%, 50%": { opacity: 0 } })
const style = stylex.create({
  container: { display: "flex", alignItems: "center", opacity: { default: 1, ":has(:disabled)": 0.5 } },
  input: { cursor: { default: "text", ":disabled": "not-allowed" } },
  group: {
    display: "flex",
    alignItems: "center",
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderColor: { default: token.input, ':has([aria-invalid="true"])': token.destructive },
    boxShadow: {
      default: "none",
      ':has([aria-invalid="true"])': `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
    }
  },
  slot: {
    position: "relative",
    display: "flex",
    boxSizing: "border-box",
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: { default: 0, ":first-child": 1 },
    borderStyle: "solid",
    borderColor: { default: token.input, ':is([aria-invalid="true"])': token.destructive },
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    transitionProperty: "all",
    transitionDuration: "150ms",
    outline: "none",
    borderTopLeftRadius: { default: 0, ":first-child": 10 },
    borderBottomLeftRadius: { default: 0, ":first-child": 10 },
    borderTopRightRadius: { default: 0, ":last-child": 10 },
    borderBottomRightRadius: { default: 0, ":last-child": 10 },
    backgroundColor: token.inputBackground
  },
  active: {
    zIndex: 10,
    borderColor: { default: token.ring, ':is([aria-invalid="true"])': token.destructive },
    boxShadow: {
      default: `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`,
      ':is([aria-invalid="true"])': `0 0 0 3px color-mix(in oklch, ${token.destructive} ${token.errorRingOpacity}, transparent)`
    }
  },
  caretContainer: {
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  caret: {
    height: 16,
    width: 1,
    backgroundColor: token.foreground,
    animationName: blink,
    animationDuration: "1000ms",
    animationTimingFunction: "ease-out",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", "@media (prefers-reduced-motion: reduce)": "paused" }
  },
  separator: { display: "flex", alignItems: "center" },
  icon: { width: 16, height: 16 }
})
export function InputOTP({ className, containerClassName, ...props }: ComponentProps<typeof OTPInput>) {
  return (
    <OTPInput
      data-slot="input-otp"
      spellCheck={false}
      {...props}
      containerClassName={["cn-input-otp", stylex.props(style.container).className, containerClassName]
        .filter(Boolean)
        .join(" ")}
      className={[stylex.props(style.input).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function InputOTPGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function InputOTPSlot({ index, className, ...props }: ComponentProps<"div"> & { index: number }) {
  const context = useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = context?.slots[index] ?? {}
  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      {...props}
      className={[stylex.props(style.slot, isActive && style.active).className, className].filter(Boolean).join(" ")}>
      {char}
      {hasFakeCaret && (
        <div {...stylex.props(style.caretContainer)}>
          <div {...stylex.props(style.caret)} />
        </div>
      )}
    </div>
  )
}
export function InputOTPSeparator(props: ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...stylex.props(style.separator)} {...props}>
      <MinusIcon {...stylex.props(style.icon)} />
    </div>
  )
}

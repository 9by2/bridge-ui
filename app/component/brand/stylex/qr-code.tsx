import * as stylex from "@stylexjs/stylex"
import QRCodePrimitive, { type QRCodeProps } from "react-qr-code"

const style = stylex.create({ root: { display: "block", maxWidth: "100%" } })

export type QrCodeProps = Omit<QRCodeProps, "ref"> & { value: string }
/**
 * Scannable QR code primitive wrapping `react-qr-code`. Transparent background
 * and `currentColor` foreground by default so callers theme it through CSS
 * `color`, matching Cue's ticket/PromptPay QR usage. Level defaults to "H"
 * (highest error correction) for print/screen ticket scan reliability. The
 * underlying primitive derives its own `viewBox` from the QR module grid, so
 * `size` (not `viewBox`) is the caller-facing rendered-dimension control.
 */
export function QrCode({
  bgColor = "transparent",
  className,
  fgColor = "currentColor",
  level = "H",
  size = 128,
  ...prop
}: QrCodeProps) {
  return (
    <QRCodePrimitive
      data-slot="qr-code"
      size={size}
      level={level}
      bgColor={bgColor}
      fgColor={fgColor}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
      {...prop}
    />
  )
}

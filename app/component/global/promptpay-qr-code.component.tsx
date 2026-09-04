import { cn } from "cnfast"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { generatePromptPayQrPayload } from "@cue/web/shared/lib/promptpay"
import { memo, useMemo, type ComponentPropsWithoutRef } from "react"
import QRCode, { type QRCodeProps } from "react-qr-code"

export interface PromptPayQrCodeComponentProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  readonly amount?: number | undefined
  readonly bgColor?: QRCodeProps["bgColor"] | undefined
  readonly fgColor?: QRCodeProps["fgColor"] | undefined
  readonly level?: QRCodeProps["level"] | undefined
  readonly qrClassName?: string | undefined
  readonly qrTitle?: string | undefined
  readonly size?: number | undefined
  readonly target: string
}

const DefaultPromptPayQrCodeSize = 192

export const PromptPayQrCodeComponent = memo(function PromptPayQrCodeComponent({
  amount,
  bgColor = "transparent",
  className,
  fgColor = "currentColor",
  level = "H",
  qrClassName,
  qrTitle = m.promptpay_qr_code_title(),
  size = DefaultPromptPayQrCodeSize,
  target,
  ...props
}: PromptPayQrCodeComponentProps) {
  const payload = useMemo(
    () => (amount === undefined ? generatePromptPayQrPayload(target) : generatePromptPayQrPayload(target, { amount })),
    [amount, target]
  )

  return (
    <div
      data-slot="promptpay-qr-code"
      className={cn("inline-flex items-center justify-center text-foreground", className)}
      {...props}>
      <QRCode
        data-slot="promptpay-qr-code-svg"
        value={payload}
        size={size}
        title={qrTitle}
        level={level}
        bgColor={bgColor}
        fgColor={fgColor}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("block max-w-full", qrClassName)}
      />
    </div>
  )
})

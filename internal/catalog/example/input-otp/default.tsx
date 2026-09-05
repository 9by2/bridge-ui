import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.InputOTP aria-label="Verification code" maxLength={4}>
      <UI.InputOTPGroup>
        <UI.InputOTPSlot index={0} />
        <UI.InputOTPSlot index={1} />
        <UI.InputOTPSlot index={2} />
        <UI.InputOTPSlot index={3} />
      </UI.InputOTPGroup>
    </UI.InputOTP>
  )
}

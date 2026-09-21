import { Fragment } from "react"

import * as UI from "@bridge/ui"

const item = [
  { title: "Account", description: "Verify your email", state: "completed" },
  { title: "Payment", description: "Add a payment method", state: "current" },
  { title: "Review", description: "Confirm your order", state: "upcoming" }
] as const

const longItem = [
  {
    title: "ยืนยันตัวตนและตรวจสอบข้อมูลบัญชีผู้ใช้งาน",
    description: "กรอกข้อมูลส่วนตัวให้ครบถ้วนและยืนยันอีเมลของคุณเพื่อดำเนินการขั้นตอนถัดไป",
    state: "completed"
  },
  {
    title: "Payment method with a very long English label to test wrap behavior",
    description:
      "Add a payment method, review the billing terms, and confirm the amount before the order is finalized and submitted.",
    state: "current"
  },
  { title: "Review", description: "Confirm your order", state: "upcoming" }
] as const

function Row({
  orientation,
  variant,
  tone,
  data,
  label
}: {
  orientation: UI.WizardStepOrientation
  variant: UI.WizardStepVariant
  tone: UI.WizardStepTone
  data: readonly { title: string; description: string; state: UI.WizardStepState }[]
  label: string
}) {
  return (
    <UI.WizardStep orientation={orientation} variant={variant} tone={tone} aria-label={label}>
      {data.map((value, index) => (
        <Fragment key={value.title}>
          <UI.WizardStepItem
            state={value.state}
            {...(value.state === "completed" ? { render: <button type="button" /> } : {})}>
            <UI.WizardStepIndicator state={value.state} tone={tone} dot={variant === "dot"}>
              {index + 1}
            </UI.WizardStepIndicator>
            <UI.WizardStepLabel>
              <UI.WizardStepTitle>{value.title}</UI.WizardStepTitle>
              <UI.WizardStepDescription>{value.description}</UI.WizardStepDescription>
            </UI.WizardStepLabel>
          </UI.WizardStepItem>
          {index < data.length - 1 ? <UI.WizardStepConnector orientation={orientation} state={value.state} /> : null}
        </Fragment>
      ))}
    </UI.WizardStep>
  )
}

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 32 }}>
      <Row orientation="horizontal" variant="number" tone="hard" data={item} label="Number variant, hard tone" />
      <Row orientation="horizontal" variant="number" tone="soft" data={item} label="Number variant, soft tone" />
      <Row orientation="horizontal" variant="dot" tone="hard" data={item} label="Dot variant" />
      <Row orientation="vertical" variant="number" tone="hard" data={item} label="Vertical orientation" />
      <UI.WizardStep aria-label="Error state">
        <UI.WizardStepItem state="completed" render={<button type="button" />}>
          <UI.WizardStepIndicator state="completed">1</UI.WizardStepIndicator>
          <UI.WizardStepLabel>
            <UI.WizardStepTitle>Account</UI.WizardStepTitle>
          </UI.WizardStepLabel>
        </UI.WizardStepItem>
        <UI.WizardStepConnector state="error" />
        <UI.WizardStepItem state="error">
          <UI.WizardStepIndicator state="error">2</UI.WizardStepIndicator>
          <UI.WizardStepLabel>
            <UI.WizardStepTitle>Payment</UI.WizardStepTitle>
            <UI.WizardStepDescription>Validation failed — check your card details.</UI.WizardStepDescription>
          </UI.WizardStepLabel>
        </UI.WizardStepItem>
        <UI.WizardStepConnector />
        <UI.WizardStepItem state="upcoming">
          <UI.WizardStepIndicator state="upcoming">3</UI.WizardStepIndicator>
          <UI.WizardStepLabel>
            <UI.WizardStepTitle>Review</UI.WizardStepTitle>
          </UI.WizardStepLabel>
        </UI.WizardStepItem>
      </UI.WizardStep>
      <UI.WizardStepCounter>Step 2 of 3</UI.WizardStepCounter>
      <Row orientation="horizontal" variant="number" tone="hard" data={longItem} label="Long and Thai copy" />
    </div>
  )
}

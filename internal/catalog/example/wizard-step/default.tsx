import { Fragment } from "react"

import * as UI from "@bridge/ui"

const item = [
  { title: "Account", description: "Verify your email", state: "completed" },
  { title: "Payment", description: "Add a payment method", state: "current" },
  { title: "Review", description: "Confirm your order", state: "upcoming" }
] as const

export default function Example() {
  return (
    <UI.WizardStep aria-label="Checkout">
      {item.map((value, index) => (
        <Fragment key={value.title}>
          <UI.WizardStepItem
            state={value.state}
            {...(value.state === "completed" ? { render: <button type="button" /> } : {})}>
            <UI.WizardStepIndicator state={value.state}>{index + 1}</UI.WizardStepIndicator>
            <UI.WizardStepLabel>
              <UI.WizardStepTitle>{value.title}</UI.WizardStepTitle>
              <UI.WizardStepDescription>{value.description}</UI.WizardStepDescription>
            </UI.WizardStepLabel>
          </UI.WizardStepItem>
          {index < item.length - 1 ? <UI.WizardStepConnector state={value.state} /> : null}
        </Fragment>
      ))}
    </UI.WizardStep>
  )
}

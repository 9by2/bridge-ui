import { cleanup, render, screen } from "@testing-library/react"
import { createRef } from "react"
import { afterEach, expect, test } from "vitest"

import {
  WizardStep,
  WizardStepConnector,
  WizardStepCounter,
  WizardStepDescription,
  WizardStepIndicator,
  WizardStepItem,
  WizardStepLabel,
  WizardStepTitle
} from "../../app/component/brand/stylex/wizard-step"

afterEach(cleanup)

test("wizard step root retains native prop, ref, and orientation/variant/tone metadata", () => {
  const ref = createRef<HTMLDivElement>()
  render(
    <WizardStep ref={ref} orientation="vertical" variant="dot" tone="soft" aria-label="Account setup">
      <WizardStepItem state="current">
        <WizardStepIndicator state="current" />
      </WizardStepItem>
    </WizardStep>
  )

  expect(ref.current).toBe(screen.getByLabelText("Account setup"))
  expect(ref.current?.getAttribute("data-slot")).toBe("wizard-step")
  expect(ref.current?.getAttribute("data-orientation")).toBe("vertical")
  expect(ref.current?.getAttribute("data-variant")).toBe("dot")
  expect(ref.current?.getAttribute("data-tone")).toBe("soft")
})

test("wizard step root defaults to horizontal orientation, number variant, and hard tone", () => {
  render(<WizardStep aria-label="Checkout" />)

  const root = screen.getByLabelText("Checkout")
  expect(root.getAttribute("data-orientation")).toBe("horizontal")
  expect(root.getAttribute("data-variant")).toBe("number")
  expect(root.getAttribute("data-tone")).toBe("hard")
})

test("wizard step item exposes data-state for every state and defaults to a non-interactive div", () => {
  const state = ["upcoming", "current", "completed", "error"] as const
  render(
    <>
      {state.map((value) => (
        <WizardStepItem key={value} state={value}>
          {value}
        </WizardStepItem>
      ))}
    </>
  )

  for (const value of state) {
    const node = screen.getByText(value)
    expect(node.getAttribute("data-slot")).toBe("wizard-step-item")
    expect(node.getAttribute("data-state")).toBe(value)
    expect(node.tagName).toBe("DIV")
  }
})

test("wizard step item defaults to upcoming state when omitted", () => {
  render(<WizardStepItem>Default</WizardStepItem>)
  expect(screen.getByText("Default").getAttribute("data-state")).toBe("upcoming")
})

test("completed wizard step item becomes interactive through the render prop while others stay div", () => {
  render(
    <>
      <WizardStepItem state="completed" render={<button type="button" />}>
        Account
      </WizardStepItem>
      <WizardStepItem state="current">Payment</WizardStepItem>
    </>
  )

  const completed = screen.getByRole("button", { name: "Account" })
  expect(completed.tagName).toBe("BUTTON")
  expect(completed.getAttribute("data-slot")).toBe("wizard-step-item")
  expect(completed.getAttribute("data-state")).toBe("completed")

  const current = screen.getByText("Payment")
  expect(current.tagName).toBe("DIV")
})

test("wizard step indicator renders a checkmark for completed and an X for error regardless of children", () => {
  render(
    <>
      <WizardStepIndicator state="completed">3</WizardStepIndicator>
      <WizardStepIndicator state="error">3</WizardStepIndicator>
      <WizardStepIndicator state="current">3</WizardStepIndicator>
      <WizardStepIndicator state="upcoming">3</WizardStepIndicator>
    </>
  )

  const indicators = screen.getAllByText((_, node) => node?.getAttribute("data-slot") === "wizard-step-indicator", {
    selector: "div"
  })
  expect(indicators).toHaveLength(4)

  const completed = document.querySelector('[data-slot="wizard-step-indicator"][data-state="completed"]')
  const error = document.querySelector('[data-slot="wizard-step-indicator"][data-state="error"]')
  const current = document.querySelector('[data-slot="wizard-step-indicator"][data-state="current"]')
  const upcoming = document.querySelector('[data-slot="wizard-step-indicator"][data-state="upcoming"]')

  expect(completed?.querySelector("svg")).not.toBeNull()
  expect(completed?.textContent).toBe("")
  expect(error?.querySelector("svg")).not.toBeNull()
  expect(error?.textContent).toBe("")
  expect(current?.textContent).toBe("3")
  expect(upcoming?.textContent).toBe("3")
})

test("wizard step indicator renders no text content in dot mode regardless of state", () => {
  render(
    <>
      <WizardStepIndicator dot state="upcoming" data-testid="dot-upcoming">
        1
      </WizardStepIndicator>
      <WizardStepIndicator dot state="current" data-testid="dot-current">
        2
      </WizardStepIndicator>
      <WizardStepIndicator dot state="completed" data-testid="dot-completed">
        3
      </WizardStepIndicator>
    </>
  )

  expect(screen.getByTestId("dot-upcoming").textContent).toBe("")
  const current = screen.getByTestId("dot-current")
  expect(current.textContent).toBe("")
  expect(current.getAttribute("data-state")).toBe("current")
  expect(screen.getByTestId("dot-completed").textContent).toBe("")
})

test("wizard step indicator applies soft tone background only for current state", () => {
  render(
    <>
      <WizardStepIndicator state="current" tone="soft" data-testid="soft-current">
        2
      </WizardStepIndicator>
      <WizardStepIndicator state="completed" tone="soft" data-testid="soft-completed" />
    </>
  )

  expect(screen.getByTestId("soft-current").className).not.toBe(screen.getByTestId("soft-completed").className)
})

test("wizard step connector exposes data-state, data-orientation, and aria-hidden", () => {
  render(
    <>
      <WizardStepConnector state="completed" orientation="horizontal" data-testid="connector-completed" />
      <WizardStepConnector state="error" orientation="vertical" data-testid="connector-error" />
    </>
  )

  const completed = screen.getByTestId("connector-completed")
  expect(completed.getAttribute("data-slot")).toBe("wizard-step-connector")
  expect(completed.getAttribute("data-state")).toBe("completed")
  expect(completed.getAttribute("data-orientation")).toBe("horizontal")
  expect(completed.getAttribute("aria-hidden")).toBe("true")

  const error = screen.getByTestId("connector-error")
  expect(error.getAttribute("data-state")).toBe("error")
  expect(error.getAttribute("data-orientation")).toBe("vertical")
})

test("wizard step connector defaults to upcoming state and horizontal orientation", () => {
  render(<WizardStepConnector data-testid="connector-default" />)
  const node = screen.getByTestId("connector-default")
  expect(node.getAttribute("data-state")).toBe("upcoming")
  expect(node.getAttribute("data-orientation")).toBe("horizontal")
})

test("wizard step connector renders a distinct gradient for current state in both orientations", () => {
  render(
    <>
      <WizardStepConnector state="current" orientation="horizontal" data-testid="current-horizontal" />
      <WizardStepConnector state="current" orientation="vertical" data-testid="current-vertical" />
    </>
  )

  const horizontal = screen.getByTestId("current-horizontal")
  const vertical = screen.getByTestId("current-vertical")
  expect(horizontal.getAttribute("data-state")).toBe("current")
  expect(vertical.getAttribute("data-state")).toBe("current")
  expect(horizontal.className).not.toBe(vertical.className)
})

test("wizard step label, title, description and counter expose documented data-slot and pass through copy", () => {
  render(
    <WizardStepLabel>
      <WizardStepTitle>ยืนยันตัวตน</WizardStepTitle>
      <WizardStepDescription>
        A long English description that keeps going to confirm the label wraps without pushing the layout wide.
      </WizardStepDescription>
      <WizardStepCounter>Step 2 of 3</WizardStepCounter>
    </WizardStepLabel>
  )

  expect(screen.getByText("ยืนยันตัวตน").getAttribute("data-slot")).toBe("wizard-step-title")
  expect(screen.getByText(/A long English description/).getAttribute("data-slot")).toBe("wizard-step-description")
  expect(screen.getByText("Step 2 of 3").getAttribute("data-slot")).toBe("wizard-step-counter")
  expect(document.querySelector('[data-slot="wizard-step-label"]')).not.toBeNull()
})

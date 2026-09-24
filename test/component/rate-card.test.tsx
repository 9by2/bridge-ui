import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, expect, test } from "vitest"

import {
  RateCard,
  RateCardAction,
  RateCardContent,
  RateCardDescription,
  RateCardDetail,
  RateCardDetailItem,
  RateCardFeature,
  RateCardFeatureList,
  RateCardHeader,
  RateCardHighlight,
  RateCardPrice,
  RateCardTitle
} from "../../app/component/brand/stylex/rate-card"

afterEach(cleanup)

test("rate card is named by its title so similar cards stay distinguishable", () => {
  render(
    <>
      <RateCard variants="card">
        <RateCardHeader>
          <RateCardTitle>Half day</RateCardTitle>
        </RateCardHeader>
      </RateCard>
      <RateCard variants="card">
        <RateCardHeader>
          <RateCardTitle>Full day</RateCardTitle>
        </RateCardHeader>
      </RateCard>
    </>
  )
  expect(screen.getByRole("article", { name: "Half day" })).toBeDefined()
  expect(screen.getByRole("article", { name: "Full day" })).toBeDefined()
  expect(screen.getByRole("heading", { level: 3, name: "Full day" })).toBeDefined()
})

test("consumer supplied accessible name overrides the title", () => {
  render(
    <RateCard variants="row" aria-label="Weekend rate">
      <RateCardTitle>Weekend</RateCardTitle>
    </RateCard>
  )
  expect(screen.getByRole("article", { name: "Weekend rate" })).toBeDefined()
})

test("title heading level can match the surrounding document outline", () => {
  render(
    <RateCard variants="plan">
      <RateCardTitle render={(props) => <h2 {...props} />}>Pro</RateCardTitle>
    </RateCard>
  )
  expect(screen.getByRole("heading", { level: 2, name: "Pro" })).toBeDefined()
  expect(screen.getByRole("article", { name: "Pro" })).toBeDefined()
})

test("price reads prefix, amount and period in order", () => {
  render(
    <RateCard variants="card">
      <RateCardPrice prefix="From" amount="฿1,500" period="/ hour" />
    </RateCard>
  )
  const price = document.querySelector('[data-slot="rate-card-price"]')
  expect(price?.textContent).toBe("From฿1,500/ hour")
  expect(screen.getByText("฿1,500")).toBeDefined()
})

test("detail exposes label and value as a description list", () => {
  render(
    <RateCard variants="row">
      <RateCardContent>
        <RateCardDescription>Studio A booking</RateCardDescription>
        <RateCardDetail>
          <RateCardDetailItem label="Duration">4 hours</RateCardDetailItem>
          <RateCardDetailItem label="Valid">1 Jan – 31 Mar</RateCardDetailItem>
        </RateCardDetail>
      </RateCardContent>
      <RateCardPrice amount="฿6,000" period="/ session" />
    </RateCard>
  )
  expect(screen.getByText("฿6,000")).toBeDefined()
  expect(screen.getAllByRole("term").map((node) => node.textContent)).toEqual(["Duration", "Valid"])
  expect(screen.getAllByRole("definition").map((node) => node.textContent)).toEqual(["4 hours", "1 Jan – 31 Mar"])
  expect(screen.getByText("Studio A booking")).toBeDefined()
})

test("feature list exposes items and keeps feature icons decorative", () => {
  render(
    <RateCard variants="plan">
      <RateCardFeatureList aria-label="Included">
        <RateCardFeature icon={<svg data-testid="check" />}>Unlimited revisions</RateCardFeature>
        <RateCardFeature>Source files</RateCardFeature>
      </RateCardFeatureList>
    </RateCard>
  )
  const list = screen.getByRole("list", { name: "Included" })
  expect(within(list).getAllByRole("listitem")).toHaveLength(2)
  expect(screen.getByTestId("check").parentElement?.getAttribute("aria-hidden")).toBe("true")
})

test("highlighted plan exposes highlight state and ribbon copy for consumer styling", () => {
  render(
    <RateCard variants="plan" highlight>
      <RateCardHighlight>Most popular</RateCardHighlight>
      <RateCardTitle>Pro</RateCardTitle>
      <RateCardAction>
        <button type="button">Choose Pro</button>
      </RateCardAction>
    </RateCard>
  )
  const card = screen.getByRole("article", { name: "Pro" })
  expect(card.getAttribute("data-variants")).toBe("plan")
  expect(card.getAttribute("data-highlight")).toBe("true")
  expect(screen.getByText("Most popular")).toBeDefined()
  expect(within(card).getByRole("button", { name: "Choose Pro" })).toBeDefined()
})

test("parts render outside a rate card without throwing so they compose into other containers", () => {
  render(
    <div>
      <RateCardTitle>Loose</RateCardTitle>
      <RateCardPrice amount="฿0" />
    </div>
  )
  expect(screen.getByRole("heading", { name: "Loose" })).toBeDefined()
})

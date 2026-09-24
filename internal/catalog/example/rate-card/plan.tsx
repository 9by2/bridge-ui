import { Check } from "lucide-react"

import {
  Button,
  RateCard,
  RateCardAction,
  RateCardDescription,
  RateCardFeature,
  RateCardFeatureList,
  RateCardHeader,
  RateCardHighlight,
  RateCardPrice,
  RateCardTitle
} from "@bridge/ui"

const plan = [
  {
    id: "starter",
    title: "Starter",
    description: "For a single deliverable.",
    amount: "฿4,000",
    feature: ["2 days delivery", "1 revision"],
    highlight: false
  },
  {
    id: "standard",
    title: "Standard",
    description: "Most briefs fit here.",
    amount: "฿8,000",
    feature: ["4 days delivery", "2 revisions", "Source files"],
    highlight: true
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Multi-channel campaign.",
    amount: "฿12,000",
    feature: ["10 days delivery", "3 revisions", "Source files", "Usage rights 1 year"],
    highlight: false
  }
]

export default function Example() {
  return (
    <section
      aria-label="Service tiers"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
        gap: 16,
        width: "100%",
        alignItems: "stretch"
      }}>
      {plan.map((item) => (
        <RateCard key={item.id} variants="plan" highlight={item.highlight}>
          {item.highlight && <RateCardHighlight>Most popular</RateCardHighlight>}
          <RateCardHeader>
            <RateCardTitle>{item.title}</RateCardTitle>
          </RateCardHeader>
          <RateCardDescription>{item.description}</RateCardDescription>
          <RateCardPrice amount={item.amount} period="/ project" />
          <RateCardFeatureList aria-label={`${item.title} includes`}>
            {item.feature.map((feature) => (
              <RateCardFeature key={feature} icon={<Check size={16} />}>
                {feature}
              </RateCardFeature>
            ))}
          </RateCardFeatureList>
          <RateCardAction>
            <Button variant={item.highlight ? "default" : "outline"} style={{ width: "100%" }}>
              Choose {item.title}
            </Button>
          </RateCardAction>
        </RateCard>
      ))}
    </section>
  )
}

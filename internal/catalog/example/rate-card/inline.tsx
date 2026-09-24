import { useState } from "react"

import {
  Badge,
  Field,
  FieldDescription,
  FieldLabel,
  RateCard,
  RateCardDescription,
  RateCardHeader,
  RateCardPrice,
  RateCardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@bridge/ui"

const rate = [
  {
    id: "festival",
    title: "ONLY MONDAY / FESTIVAL ขายบัตร เทศกาล",
    amount: "฿250,000",
    duration: "60 min",
    region: ["BMA", "UPC"],
    description: "Ticketed festival slot, Monday only.",
    disabled: false
  },
  {
    id: "corporate",
    title: "Corporate private event",
    amount: "฿180,000",
    duration: "90 min",
    region: ["BMA"],
    description: "Private hire with two encore songs.",
    disabled: false
  },
  {
    id: "expired",
    title: "Songkran 2026",
    amount: "฿320,000",
    duration: "45 min",
    region: ["UPC"],
    description: "Outside its valid date range.",
    disabled: true
  }
]

function Summary({ item, description }: { item: (typeof rate)[number]; description?: boolean }) {
  return (
    <RateCard variants="inline">
      <RateCardHeader>
        <RateCardTitle>{item.title}</RateCardTitle>
        {item.region.map((region) => (
          <Badge key={region} variant={region === "BMA" ? "info" : "secondary"}>
            {region}
          </Badge>
        ))}
      </RateCardHeader>
      <RateCardPrice amount={item.amount} period={item.duration} />
      {description && <RateCardDescription>{item.description}</RateCardDescription>}
    </RateCard>
  )
}

export default function Example() {
  const [value, setValue] = useState("festival")
  const selected = rate.find((item) => item.id === value)
  return (
    <Field style={{ width: "100%", maxWidth: 560 }}>
      <FieldLabel htmlFor="rate-card">Select Rate Card</FieldLabel>
      <Select value={value} onValueChange={(next) => next && setValue(next)}>
        <SelectTrigger id="rate-card" style={{ width: "100%", height: "auto", paddingBlock: 12, paddingInline: 16 }}>
          {selected && <Summary item={selected} />}
        </SelectTrigger>
        <SelectContent>
          {rate.map((item) => (
            <SelectItem key={item.id} value={item.id} disabled={item.disabled} style={{ paddingBlock: 8 }}>
              <Summary item={item} description />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>Only rate cards covering the venue area are listed.</FieldDescription>
    </Field>
  )
}

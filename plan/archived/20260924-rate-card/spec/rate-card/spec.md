# Spec: Rate card

**Spec ID:** `rate-card`
**Proposal:** `rate-card`
**Status:** accepted

## Summary

`RateCard` is a noninteractive compound presentation of a priced offer. The root requires `variants: "row" | "card" | "plan" | "inline"` and accepts optional `highlight`. Parts: `RateCardHeader`, `RateCardTitle`, `RateCardHighlight`, `RateCardContent`, `RateCardDescription`, `RateCardPrice`, `RateCardDetail`, `RateCardDetailItem`, `RateCardFeatureList`, `RateCardFeature`, `RateCardAction`. Consumers pass localized copy, formatted amounts and interactive children.

## Requirements

### REQ-001 Accessible name

The article is labelled by `RateCardTitle` unless `aria-label` or `aria-labelledby` is supplied.

**Acceptance:**

- [x] `getByRole("article", { name })` resolves by title.
- [x] Consumer `aria-label` wins.

### REQ-002 Price

`RateCardPrice` renders optional `prefix`, required `amount`, optional `period` in reading order.

**Acceptance:**

- [x] Text reads "From ฿1,500 / hour".

### REQ-003 Semantic lists

`RateCardDetail` is a description list of `label`/value pairs; `RateCardFeatureList` is a list whose feature icon is decorative.

**Acceptance:**

- [x] term/definition roles exposed; list/listitem roles exposed; icon `aria-hidden`.

### REQ-004 Variants and highlight

Every variant and `highlight` appear by name in catalog and CUSTOMIZATION.md. `data-variants` and `data-highlight` are exposed for consumer styling.

### REQ-006 Inline variant

`inline` renders a frameless phrasing-only summary (`span` root, header, title, price, description) so it can sit inside interactive controls such as `SelectTrigger` and `SelectItem`. It exposes no article or heading role and does not set its own accessible name.

**Acceptance:**

- [x] Inside a Select trigger the combobox text contains title and price; no article or heading role is exposed.

### REQ-005 Title level

`RateCardTitle` defaults to `h3` and accepts `render` to change heading level.

## Schema / API

```ts
type RateCardVariant = "row" | "card" | "plan" | "inline"
type RateCardProps = ComponentProps<"article"> & { variants: RateCardVariant; highlight?: boolean }
type RateCardPriceProps = Omit<ComponentProps<"div">, "children"> & {
  amount: ReactNode
  period?: ReactNode
  prefix?: ReactNode
}
type RateCardDetailItemProps = Omit<ComponentProps<"div">, "children"> & { label: ReactNode; children: ReactNode }
type RateCardFeatureProps = ComponentProps<"li"> & { icon?: ReactNode }
```

## Non-Goals

- Currency formatting, selection, status logic, form, revision history, grid layout.

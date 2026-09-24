import {
  Button,
  RateCard,
  RateCardAction,
  RateCardContent,
  RateCardDescription,
  RateCardDetail,
  RateCardDetailItem,
  RateCardHeader,
  RateCardPrice,
  RateCardTitle
} from "@bridge/ui"

const service = [
  {
    id: "portrait",
    title: "Portrait session",
    description: "Single talent, two looks, retouched selects.",
    duration: "1 hr 30 min",
    prefix: undefined,
    amount: "฿3,500"
  },
  {
    id: "product",
    title: "Product shoot",
    description: "Tabletop set with up to 20 SKUs and white background.",
    duration: "4 hr",
    prefix: "From",
    amount: "฿12,000"
  },
  {
    id: "campaign",
    title: "Campaign day",
    description: "Full crew, two sets and on-site art direction.",
    duration: "8 hr",
    prefix: undefined,
    amount: "฿45,000"
  }
]

export default function Example() {
  return (
    <section
      aria-label="Services"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
        gap: 12,
        width: "100%"
      }}>
      {service.map((item) => (
        <RateCard key={item.id} variants="card">
          <RateCardHeader>
            <RateCardTitle>{item.title}</RateCardTitle>
          </RateCardHeader>
          <RateCardContent>
            <RateCardDescription>{item.description}</RateCardDescription>
            <RateCardDetail>
              <RateCardDetailItem label="Duration">{item.duration}</RateCardDetailItem>
            </RateCardDetail>
          </RateCardContent>
          <RateCardPrice prefix={item.prefix} amount={item.amount} />
          <RateCardAction>
            <Button variant="outline" style={{ width: "100%" }}>
              Select
            </Button>
          </RateCardAction>
        </RateCard>
      ))}
    </section>
  )
}

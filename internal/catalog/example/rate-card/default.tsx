import {
  Badge,
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

export default function Example() {
  return (
    <RateCard variants="card" style={{ maxWidth: 360 }}>
      <RateCardHeader>
        <RateCardTitle>Half-day studio</RateCardTitle>
        <Badge variant="success">Active</Badge>
      </RateCardHeader>
      <RateCardContent>
        <RateCardDescription>Studio A with lighting kit and one assistant.</RateCardDescription>
        <RateCardDetail>
          <RateCardDetailItem label="Duration">4 hours</RateCardDetailItem>
          <RateCardDetailItem label="Valid">1 Oct – 31 Dec 2026</RateCardDetailItem>
        </RateCardDetail>
      </RateCardContent>
      <RateCardPrice amount="฿6,000" period="/ session" />
      <RateCardAction>
        <Button>Book</Button>
      </RateCardAction>
    </RateCard>
  )
}

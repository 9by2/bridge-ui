import { EllipsisVertical, Pencil } from "lucide-react"

import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  RateCard,
  RateCardAction,
  RateCardContent,
  RateCardDetail,
  RateCardDetailItem,
  RateCardHeader,
  RateCardPrice,
  RateCardTitle
} from "@bridge/ui"

const rate = [
  {
    id: "weekday",
    title: "Weekday rate",
    status: "Active",
    tone: "success",
    amount: "฿1,500",
    period: "/ hour",
    duration: "Min. 2 hours",
    valid: "1 Oct – 31 Dec 2026",
    region: "BMA"
  },
  {
    id: "weekend",
    title: "Weekend rate",
    status: "Inactive",
    tone: "outline",
    amount: "฿2,000",
    period: "/ hour",
    duration: "Min. 4 hours",
    valid: "1 Oct – 31 Dec 2026",
    region: "UPC"
  },
  {
    id: "launch",
    title: "Launch promotion",
    status: "Expired",
    tone: "destructive",
    amount: "฿9,900",
    period: "/ day",
    duration: "8 hours",
    valid: "1 Jul – 30 Sep 2026",
    region: "BMA"
  }
] as const

export default function Example() {
  return (
    <section aria-label="Rate cards" style={{ display: "grid", gap: 12, width: "100%", maxWidth: 880 }}>
      {rate.map((item) => (
        <RateCard key={item.id} variants="row">
          <RateCardContent>
            <RateCardHeader>
              <RateCardTitle>{item.title}</RateCardTitle>
              <Badge variant={item.tone}>{item.status}</Badge>
              <Badge variant="outline">{item.region}</Badge>
            </RateCardHeader>
            <RateCardDetail>
              <RateCardDetailItem label="Duration">{item.duration}</RateCardDetailItem>
              <RateCardDetailItem label="Valid">{item.valid}</RateCardDetailItem>
            </RateCardDetail>
          </RateCardContent>
          <RateCardPrice amount={item.amount} period={item.period} />
          <RateCardAction>
            <Button variant="outline" size="sm">
              <Pencil data-icon="inline-start" />
              Edit
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" size="icon-sm" aria-label={`More for ${item.title}`} />}>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>View revisions</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </RateCardAction>
        </RateCard>
      ))}
    </section>
  )
}

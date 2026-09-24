import { Check } from "lucide-react"

import {
  Badge,
  Button,
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
  RateCardTitle,
  Theme
} from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16, width: "100%" }}>
      <RateCard variants="row">
        <RateCardContent>
          <RateCardHeader>
            <RateCardTitle>อัตราค่าบริการถ่ายภาพนอกสถานที่สำหรับงานอีเวนต์ขนาดใหญ่และงานแต่งงาน</RateCardTitle>
            <Badge variant="pending">รออนุมัติ</Badge>
          </RateCardHeader>
          <RateCardDescription>
            รวมค่าเดินทางในเขตกรุงเทพฯ และปริมณฑล ช่างภาพสองคน พร้อมไฟล์ต้นฉบับทั้งหมดภายในเจ็ดวันทำการ
          </RateCardDescription>
        </RateCardContent>
        <RateCardPrice prefix="เริ่มต้น" amount="฿1,234,567.89" period="/ วัน" />
        <RateCardAction>
          <Button variant="outline" size="sm">
            แก้ไข
          </Button>
        </RateCardAction>
      </RateCard>
      <RateCard variants="card" style={{ maxWidth: 320 }}>
        <RateCardHeader>
          <RateCardTitle>Price on request</RateCardTitle>
        </RateCardHeader>
        <RateCardPrice amount="Contact us" />
        <RateCardAction>
          <Button variant="outline" disabled>
            Unavailable
          </Button>
        </RateCardAction>
      </RateCard>
      <Theme mode="dark" style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: 16,
            padding: 24,
            background: "#141414"
          }}>
          <RateCard variants="plan">
            <RateCardHeader>
              <RateCardTitle>Hobby</RateCardTitle>
            </RateCardHeader>
            <RateCardPrice amount="Free" />
            <RateCardFeatureList aria-label="Hobby includes">
              <RateCardFeature icon={<Check size={16} />}>One project</RateCardFeature>
            </RateCardFeatureList>
            <RateCardAction>
              <Button variant="outline">Start</Button>
            </RateCardAction>
          </RateCard>
          <RateCard variants="plan" highlight>
            <RateCardHighlight>Recommended</RateCardHighlight>
            <RateCardHeader>
              <RateCardTitle>Pro</RateCardTitle>
            </RateCardHeader>
            <RateCardPrice amount="฿690" period="/ month" />
            <RateCardFeatureList aria-label="Pro includes">
              <RateCardFeature icon={<Check size={16} />}>Unlimited projects</RateCardFeature>
              <RateCardFeature icon={<Check size={16} />}>Priority support</RateCardFeature>
            </RateCardFeatureList>
            <RateCardAction>
              <Button>Upgrade</Button>
            </RateCardAction>
          </RateCard>
          <RateCard variants="card">
            <RateCardHeader>
              <RateCardTitle>Add-on: rush delivery</RateCardTitle>
            </RateCardHeader>
            <RateCardDetail>
              <RateCardDetailItem label="Turnaround">24 hours</RateCardDetailItem>
            </RateCardDetail>
            <RateCardPrice prefix="+" amount="฿2,000" />
          </RateCard>
        </div>
      </Theme>
    </div>
  )
}

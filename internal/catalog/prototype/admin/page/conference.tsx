import { PrototypeMedia } from "@catalog-prototype/shared/support"
import { useState } from "react"

import * as UI from "@bridge/ui"

const pass = [
  {
    id: "summit",
    title: "Summit pass",
    price: "$499",
    period: "/ attendee",
    detail: [
      ["Access", "All session"],
      ["Valid", "14–15 Oct 2026"]
    ]
  },
  {
    id: "workshop",
    title: "Workshop add-on",
    price: "$149",
    period: "/ seat",
    detail: [
      ["Access", "Hands-on lab"],
      ["Seat", "30 max"]
    ]
  }
] as const

function Registration({ onDone }: { onDone: () => void }) {
  return (
    <UI.Card>
      <UI.CardHeader>
        <UI.CardTitle>Register attendee</UI.CardTitle>
        <UI.CardDescription>Answer two question to reserve a pass.</UI.CardDescription>
      </UI.CardHeader>
      <UI.CardContent>
        <UI.Questionnaire
          onSubmit={(event) => {
            event.preventDefault()
            onDone()
          }}>
          <UI.QuestionnaireProgress />
          <UI.QuestionnaireItem name="track" required>
            <UI.QuestionnaireTitle>Which track?</UI.QuestionnaireTitle>
            <UI.QuestionnaireChoices>
              <UI.QuestionnaireChoice value="platform">
                Platform
                <UI.QuestionnaireChoiceDescription>Infra, reliability, security</UI.QuestionnaireChoiceDescription>
              </UI.QuestionnaireChoice>
              <UI.QuestionnaireChoice value="product">
                Product
                <UI.QuestionnaireChoiceDescription>Design, growth, analytics</UI.QuestionnaireChoiceDescription>
              </UI.QuestionnaireChoice>
            </UI.QuestionnaireChoices>
            <UI.QuestionnaireError>Choose a track.</UI.QuestionnaireError>
          </UI.QuestionnaireItem>
          <UI.QuestionnaireItem name="diet">
            <UI.QuestionnaireTitle>Dietary requirement</UI.QuestionnaireTitle>
            <UI.QuestionnaireInput placeholder="Optional" />
          </UI.QuestionnaireItem>
          <UI.QuestionnaireActions>
            <UI.QuestionnairePrevious />
            <UI.QuestionnaireSkip />
            <UI.QuestionnaireNext />
            <UI.QuestionnaireSubmit>Reserve</UI.QuestionnaireSubmit>
          </UI.QuestionnaireActions>
        </UI.Questionnaire>
      </UI.CardContent>
    </UI.Card>
  )
}

function Badge() {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-6">
      <UI.SuccessBurst />
      <UI.Heading as={UI.WAIHeading.H2}>
        <UI.FlipText>You are registered</UI.FlipText>
      </UI.Heading>
      <UI.TicketCard frontLabel="Show badge" backLabel="Show check-in code">
        <UI.TicketCardFront>
          <div className="grid grid-cols-1 gap-3">
            <UI.TicketCover>
              <UI.ResponsiveImage decorative src={PrototypeMedia.IMAGE} />
            </UI.TicketCover>
            <UI.Large>Acme Summit 2026</UI.Large>
            <dl className="grid grid-cols-1 gap-2">
              <UI.DetailItem>
                <UI.DetailItemLabel>Attendee</UI.DetailItemLabel>
                <UI.DetailItemContent>Alex Kim</UI.DetailItemContent>
              </UI.DetailItem>
              <UI.DetailItem>
                <UI.DetailItemLabel>Venue</UI.DetailItemLabel>
                <UI.DetailItemContent>Queen Sirikit National Convention Center</UI.DetailItemContent>
              </UI.DetailItem>
            </dl>
            <UI.StatusStamp tone="success">Confirmed</UI.StatusStamp>
          </div>
        </UI.TicketCardFront>
        <UI.TicketCardBack>
          <div className="grid grid-cols-1 justify-items-center gap-3">
            <UI.QrCode value="https://acme.io/summit/checkin/AK-0192" title="Check-in QR code" />
            <UI.Small>AK-0192</UI.Small>
          </div>
        </UI.TicketCardBack>
      </UI.TicketCard>
    </div>
  )
}

export function ConferencePage() {
  const [done, setDone] = useState(false)
  return (
    <UI.Page width={UI.PageWidth.content}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageEyebrow>Event</UI.PageEyebrow>
          <UI.PageTitle>Acme Summit 2026</UI.PageTitle>
          <UI.PageMeta>
            <UI.StatusStamp tone="pending">Registration open</UI.StatusStamp>
          </UI.PageMeta>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="grid grid-cols-1 content-start gap-4">
            {pass.map((item) => (
              <UI.RateCard key={item.id} variants="row">
                <UI.RateCardHeader>
                  <UI.RateCardTitle>{item.title}</UI.RateCardTitle>
                </UI.RateCardHeader>
                <UI.RateCardContent>
                  <UI.RateCardDetail>
                    {item.detail.map(([label, value]) => (
                      <UI.RateCardDetailItem key={label} label={label}>
                        {value}
                      </UI.RateCardDetailItem>
                    ))}
                  </UI.RateCardDetail>
                </UI.RateCardContent>
                <UI.RateCardPrice amount={item.price} period={item.period} />
              </UI.RateCard>
            ))}
          </div>
          {done ? <Badge /> : <Registration onDone={() => setDone(true)} />}
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}

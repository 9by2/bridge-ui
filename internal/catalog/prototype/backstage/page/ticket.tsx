import { PrototypeMedia } from "@catalog-prototype/shared/support"
import { CheckIcon } from "lucide-react"
import { Fragment, useState } from "react"

import * as UI from "@bridge/ui"

const tier = [
  {
    id: "ga",
    title: "General admission",
    price: 1800,
    feature: ["Standing zone", "Entry from 17:00"],
    highlight: false
  },
  { id: "vip", title: "VIP", price: 4500, feature: ["Front zone", "Early entry", "Merch pack"], highlight: true },
  {
    id: "meet",
    title: "Meet & greet",
    price: 7900,
    feature: ["VIP zone", "Photo with band", "Signed vinyl"],
    highlight: false
  }
] as const
const CheckoutStep = { TIER: 0, PAYMENT: 1, DONE: 2 } as const
const step = [
  { title: "Ticket", description: "Choose tier and quantity" },
  { title: "Payment", description: "PromptPay or card" },
  { title: "Done", description: "Receive e-ticket" }
] as const
const baht = (value: number) => `฿${value.toLocaleString("en-US")}`

function Checkout({ current }: { current: number }) {
  return (
    <UI.WizardStep aria-label="Checkout">
      {step.map((item, index) => {
        const state = index < current ? "completed" : index === current ? "current" : "upcoming"
        return (
          <Fragment key={item.title}>
            <UI.WizardStepItem state={state}>
              <UI.WizardStepIndicator state={state}>{index + 1}</UI.WizardStepIndicator>
              <UI.WizardStepLabel>
                <UI.WizardStepTitle>{item.title}</UI.WizardStepTitle>
                <UI.WizardStepDescription>{item.description}</UI.WizardStepDescription>
              </UI.WizardStepLabel>
            </UI.WizardStepItem>
            {index < step.length - 1 ? <UI.WizardStepConnector state={state} /> : null}
          </Fragment>
        )
      })}
    </UI.WizardStep>
  )
}

function TierPicker({ onChoose }: { onChoose: (id: string) => void }) {
  return (
    <section aria-label="Ticket tier" className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {tier.map((item) => (
        <UI.RateCard key={item.id} variants="plan" highlight={item.highlight}>
          {item.highlight ? <UI.RateCardHighlight>Most popular</UI.RateCardHighlight> : null}
          <UI.RateCardHeader>
            <UI.RateCardTitle>{item.title}</UI.RateCardTitle>
          </UI.RateCardHeader>
          <UI.RateCardPrice amount={baht(item.price)} period="/ ticket" />
          <UI.RateCardFeatureList aria-label={`${item.title} include`}>
            {item.feature.map((feature) => (
              <UI.RateCardFeature key={feature} icon={<CheckIcon aria-hidden="true" />}>
                {feature}
              </UI.RateCardFeature>
            ))}
          </UI.RateCardFeatureList>
          <UI.RateCardAction>
            <UI.Button variant={item.highlight ? "default" : "outline"} onClick={() => onChoose(item.id)}>
              Choose {item.title}
            </UI.Button>
          </UI.RateCardAction>
        </UI.RateCard>
      ))}
    </section>
  )
}

function Payment({ tierId, onPay }: { tierId: string; onPay: () => void }) {
  const [quantity, setQuantity] = useState(2)
  const [merch, setMerch] = useState(1)
  const chosen = tier.find((item) => item.id === tierId) ?? tier[0]
  const total = chosen.price * quantity + 650 * merch
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="grid grid-cols-1 content-start gap-3">
        <UI.ProductItem>
          <UI.ProductItemContent>
            <UI.TypographyLabel>{chosen.title}</UI.TypographyLabel>
            <UI.Muted>{baht(chosen.price)} each</UI.Muted>
          </UI.ProductItemContent>
          <UI.ProductItemAction>
            <UI.QuantityStepper
              value={quantity}
              min={1}
              max={6}
              decrementLabel="Fewer ticket"
              incrementLabel="More ticket"
              onValueChange={setQuantity}
            />
          </UI.ProductItemAction>
        </UI.ProductItem>
        <UI.ProductItem>
          <UI.ProductItemMedia>
            <UI.ResponsiveImage alt="Tour T-shirt" src={PrototypeMedia.IMAGE} />
          </UI.ProductItemMedia>
          <UI.ProductItemContent>
            <UI.TypographyLabel>Tour T-shirt</UI.TypographyLabel>
            <UI.Muted>฿650 each</UI.Muted>
          </UI.ProductItemContent>
          <UI.ProductItemAction>
            <UI.QuantityStepper
              value={merch}
              min={0}
              max={4}
              decrementLabel="Fewer shirt"
              incrementLabel="More shirt"
              onValueChange={setMerch}
            />
          </UI.ProductItemAction>
        </UI.ProductItem>
      </div>
      <UI.Card>
        <UI.CardHeader>
          <UI.CardTitle>Order summary</UI.CardTitle>
        </UI.CardHeader>
        <UI.CardContent>
          <UI.Receipt>
            <UI.ReceiptRow>
              <dt>
                {chosen.title} × {quantity}
              </dt>
              <dd>{baht(chosen.price * quantity)}</dd>
            </UI.ReceiptRow>
            <UI.ReceiptRow>
              <dt>Tour T-shirt × {merch}</dt>
              <dd>{baht(650 * merch)}</dd>
            </UI.ReceiptRow>
            <UI.ReceiptRow>
              <dt>Total</dt>
              <dd>{baht(total)}</dd>
            </UI.ReceiptRow>
          </UI.Receipt>
          <UI.ReceiptDetail>Price include VAT. Ticket is non-refundable.</UI.ReceiptDetail>
        </UI.CardContent>
        <UI.CardFooter>
          <UI.Button onClick={onPay}>Pay {baht(total)}</UI.Button>
        </UI.CardFooter>
      </UI.Card>
    </div>
  )
}

function ETicket() {
  return (
    <div className="grid grid-cols-1 justify-items-center gap-6">
      <UI.SuccessBurst />
      <UI.Heading as={UI.WAIHeading.H2}>
        <UI.FlipText>Payment complete</UI.FlipText>
      </UI.Heading>
      <UI.TicketCard frontLabel="Show front" backLabel="Show QR">
        <UI.TicketCardFront>
          <div className="grid grid-cols-1 gap-3">
            <UI.TicketCover>
              <UI.ResponsiveImage decorative src={PrototypeMedia.IMAGE} />
            </UI.TicketCover>
            <UI.Large>Polycat Live in Bangkok</UI.Large>
            <UI.Muted>24 Sep 2026 · Impact Arena · Gate B</UI.Muted>
            <UI.StatusStamp tone="success">Confirmed</UI.StatusStamp>
          </div>
        </UI.TicketCardFront>
        <UI.TicketCardBack>
          <div className="grid grid-cols-1 justify-items-center gap-3">
            <UI.QrCode value="https://bridge.limited/ticket/EVT-2041-00017" title="Ticket QR code" />
            <UI.Small>EVT-2041-00017</UI.Small>
          </div>
        </UI.TicketCardBack>
      </UI.TicketCard>
    </div>
  )
}

export function TicketPage() {
  const [current, setCurrent] = useState<number>(CheckoutStep.TIER)
  const [tierId, setTierId] = useState<string>(tier[0].id)
  return (
    <UI.Page width={UI.PageWidth.content}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Box office</UI.PageTitle>
          <UI.PageDescription>Walk-in sale for Polycat Live in Bangkok.</UI.PageDescription>
        </UI.PageHeading>
        <UI.PageAction>
          <UI.Button variant="outline" onClick={() => setCurrent(CheckoutStep.TIER)}>
            Start over
          </UI.Button>
        </UI.PageAction>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-8">
          <Checkout current={current} />
          <UI.WizardStepCounter>
            Step {current + 1} of {step.length}
          </UI.WizardStepCounter>
          {current === CheckoutStep.TIER ? (
            <TierPicker
              onChoose={(id) => {
                setTierId(id)
                setCurrent(CheckoutStep.PAYMENT)
              }}
            />
          ) : current === CheckoutStep.PAYMENT ? (
            <Payment tierId={tierId} onPay={() => setCurrent(CheckoutStep.DONE)} />
          ) : (
            <ETicket />
          )}
        </div>
      </UI.PageContent>
    </UI.Page>
  )
}

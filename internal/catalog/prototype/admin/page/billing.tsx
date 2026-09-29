import { notify } from "@catalog-prototype/shared/console-shell"
import { CheckIcon, CreditCardIcon, DownloadIcon } from "lucide-react"
import { Fragment, useState } from "react"

import * as UI from "@bridge/ui"

const plan = [
  { id: "starter", title: "Starter", price: "$19", feature: ["5 seat", "10 GB storage"], highlight: false },
  { id: "business", title: "Business", price: "$79", feature: ["25 seat", "SSO", "Audit log"], highlight: true },
  {
    id: "enterprise",
    title: "Enterprise",
    price: "Custom",
    feature: ["Unlimited seat", "Data residency", "SLA 99.99%"],
    highlight: false
  }
] as const
const invoice = [
  { id: "INV-2026-009", date: "1 Sep 2026", amount: "$1,975.00", status: "success" },
  { id: "INV-2026-008", date: "1 Aug 2026", amount: "$1,975.00", status: "success" },
  { id: "INV-2026-007", date: "1 Jul 2026", amount: "$1,580.00", status: "partial-success" }
] as const
const upgradeStep = ["Plan", "Seat", "Confirm"] as const

function UpgradeDialog({ planId, onClose }: { planId: string | undefined; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [seat, setSeat] = useState(25)
  const chosen = plan.find((item) => item.id === planId)
  return (
    <UI.Dialog open={chosen !== undefined} onOpenChange={(open) => (open ? undefined : (onClose(), setStep(0)))}>
      <UI.DialogContent>
        <UI.DialogHeader>
          <UI.DialogTitle>Upgrade to {chosen?.title}</UI.DialogTitle>
          <UI.DialogDescription>Change apply immediately and are prorated.</UI.DialogDescription>
        </UI.DialogHeader>
        <UI.WizardStep aria-label="Upgrade">
          {upgradeStep.map((title, index) => {
            const state = index < step ? "completed" : index === step ? "current" : "upcoming"
            return (
              <Fragment key={title}>
                <UI.WizardStepItem state={state}>
                  <UI.WizardStepIndicator state={state}>{index + 1}</UI.WizardStepIndicator>
                  <UI.WizardStepLabel>
                    <UI.WizardStepTitle>{title}</UI.WizardStepTitle>
                  </UI.WizardStepLabel>
                </UI.WizardStepItem>
                {index < upgradeStep.length - 1 ? <UI.WizardStepConnector state={state} /> : null}
              </Fragment>
            )
          })}
        </UI.WizardStep>
        <UI.WizardStepCounter>
          Step {step + 1} of {upgradeStep.length}
        </UI.WizardStepCounter>
        {step === 1 ? (
          <UI.ProductItem>
            <UI.ProductItemContent>
              <UI.TypographyLabel>Seat</UI.TypographyLabel>
              <UI.Muted>{chosen?.price} per seat / month</UI.Muted>
            </UI.ProductItemContent>
            <UI.ProductItemAction>
              <UI.QuantityStepper
                value={seat}
                min={5}
                max={100}
                decrementLabel="Fewer seat"
                incrementLabel="More seat"
                onValueChange={setSeat}
              />
            </UI.ProductItemAction>
          </UI.ProductItem>
        ) : null}
        {step === 2 ? (
          <UI.Receipt>
            <UI.ReceiptRow>
              <dt>{chosen?.title}</dt>
              <dd>{chosen?.price}</dd>
            </UI.ReceiptRow>
            <UI.ReceiptRow>
              <dt>Seat</dt>
              <dd>× {seat}</dd>
            </UI.ReceiptRow>
          </UI.Receipt>
        ) : null}
        <UI.DialogFooter>
          <UI.Button variant="outline" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
            Back
          </UI.Button>
          {step < upgradeStep.length - 1 ? (
            <UI.Button onClick={() => setStep((value) => value + 1)}>Next</UI.Button>
          ) : (
            <UI.Button
              onClick={() => {
                onClose()
                setStep(0)
                notify.success(`Upgraded to ${chosen?.title}`)
              }}>
              Confirm
            </UI.Button>
          )}
        </UI.DialogFooter>
      </UI.DialogContent>
    </UI.Dialog>
  )
}

function PromptPay() {
  return (
    <UI.TicketCard frontLabel="Show payment method" backLabel="Show PromptPay QR">
      <UI.TicketCardFront>
        <div className="grid grid-cols-1 gap-3">
          <UI.TicketCover>
            <UI.ResponsiveImage
              decorative
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%23818cf8'/%3E%3C/svg%3E"
            />
          </UI.TicketCover>
          <UI.Large>Visa •••• 4242</UI.Large>
          <UI.Muted>Expire 08/28 · Default</UI.Muted>
        </div>
      </UI.TicketCardFront>
      <UI.TicketCardBack>
        <div className="grid grid-cols-1 justify-items-center gap-3">
          <UI.QrCode value="00020101021129370016A000000677010111011300668123456785802TH5303764" title="PromptPay QR" />
          <UI.Small>Scan to pay the next invoice with PromptPay</UI.Small>
        </div>
      </UI.TicketCardBack>
    </UI.TicketCard>
  )
}

export function BillingPage() {
  const [upgrade, setUpgrade] = useState<string>()
  return (
    <UI.Page width={UI.PageWidth.content}>
      <UI.PageHeader>
        <UI.PageHeading>
          <UI.PageTitle>Billing</UI.PageTitle>
          <UI.PageDescription>Current plan: Business · 25 seat · renew 1 Oct 2026.</UI.PageDescription>
        </UI.PageHeading>
      </UI.PageHeader>
      <UI.PageContent>
        <div className="grid grid-cols-1 gap-8">
          <section aria-label="Plan" className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plan.map((item) => (
              <UI.RateCard key={item.id} variants="plan" highlight={item.highlight}>
                {item.highlight ? <UI.RateCardHighlight>Current</UI.RateCardHighlight> : null}
                <UI.RateCardHeader>
                  <UI.RateCardTitle>{item.title}</UI.RateCardTitle>
                </UI.RateCardHeader>
                <UI.RateCardPrice amount={item.price} period={item.price === "Custom" ? undefined : "/ seat / month"} />
                <UI.RateCardFeatureList aria-label={`${item.title} include`}>
                  {item.feature.map((feature) => (
                    <UI.RateCardFeature key={feature} icon={<CheckIcon aria-hidden="true" />}>
                      {feature}
                    </UI.RateCardFeature>
                  ))}
                </UI.RateCardFeatureList>
                <UI.RateCardAction>
                  <UI.Button variant={item.highlight ? "default" : "outline"} onClick={() => setUpgrade(item.id)}>
                    {item.highlight ? "Manage seat" : `Choose ${item.title}`}
                  </UI.Button>
                </UI.RateCardAction>
              </UI.RateCard>
            ))}
          </section>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <UI.Card>
              <UI.CardHeader>
                <UI.CardTitle>Invoice</UI.CardTitle>
              </UI.CardHeader>
              <UI.CardContent>
                <UI.Table>
                  <UI.TableHeader>
                    <UI.TableRow>
                      <UI.TableHead>Invoice</UI.TableHead>
                      <UI.TableHead>Date</UI.TableHead>
                      <UI.TableHead>Amount</UI.TableHead>
                      <UI.TableHead>Status</UI.TableHead>
                      <UI.TableHead>
                        <span className="sr-only">Download</span>
                      </UI.TableHead>
                    </UI.TableRow>
                  </UI.TableHeader>
                  <UI.TableBody>
                    {invoice.map((item) => (
                      <UI.TableRow key={item.id}>
                        <UI.TableCell>{item.id}</UI.TableCell>
                        <UI.TableCell>{item.date}</UI.TableCell>
                        <UI.TableCell>{item.amount}</UI.TableCell>
                        <UI.TableCell>
                          <UI.Badge variant={item.status}>
                            {item.status === "success" ? "Paid" : "Partially paid"}
                          </UI.Badge>
                        </UI.TableCell>
                        <UI.TableCell>
                          <UI.Button variant="ghost" size="icon-sm" aria-label={`Download ${item.id}`}>
                            <DownloadIcon aria-hidden="true" />
                          </UI.Button>
                        </UI.TableCell>
                      </UI.TableRow>
                    ))}
                  </UI.TableBody>
                </UI.Table>
              </UI.CardContent>
            </UI.Card>
            <div className="grid grid-cols-1 content-start gap-4">
              <UI.Heading>
                <CreditCardIcon aria-hidden="true" /> Payment method
              </UI.Heading>
              <PromptPay />
            </div>
          </div>
        </div>
      </UI.PageContent>
      <UpgradeDialog planId={upgrade} onClose={() => setUpgrade(undefined)} />
    </UI.Page>
  )
}

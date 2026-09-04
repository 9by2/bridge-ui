import { Button } from "@bridge/ui/app/component/shadcn/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@bridge/ui/app/component/shadcn/dialog"
import { Input } from "@bridge/ui/app/component/shadcn/input"
import { Label } from "@bridge/ui/app/component/shadcn/label"
import type {
  TicketCheckinScanFirstCheckinView,
  TicketCheckinScanTicketView,
  TicketCheckinScanView
} from "@cue/web/app/mapper/ticket-checkin.mapper"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { Scanner } from "@yudiel/react-qr-scanner"
import { AlertCircleIcon, CameraIcon, CameraOffIcon, CheckCircle2Icon, TriangleAlertIcon } from "lucide-react"
import { useCallback, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"

// Kept in local component state only — a same-tab convenience for an operator to double-check
// a recent result, not a source of truth. The server-side scan audit trail remains durable;
// this list is cleared on reload.
const RECENT_SCAN_LIMIT = 20

export interface TicketCheckinScannerComponentProps {
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly isPending: boolean
  readonly leadingAction?: ReactNode | undefined
  readonly trailingAction?: ReactNode | undefined
  readonly statsSection?: ReactNode | undefined
  // Presentation-only kill switch: when true, releases the camera and stops
  // rendering the scanner surface (e.g. the session ended).
  readonly forceCameraOff?: boolean | undefined
  readonly onScan: (scanCode: string) => Promise<TicketCheckinScanView>
  readonly onScanError: (error: unknown) => string | null
  readonly onScanNext?: (() => void) | undefined
}

export function TicketCheckinScannerComponent({
  eyebrow,
  title,
  description,
  isPending,
  leadingAction,
  trailingAction,
  statsSection,
  forceCameraOff,
  onScan,
  onScanError,
  onScanNext
}: TicketCheckinScannerComponentProps) {
  const [lastOutcome, setLastOutcome] = useState<ScanOutcome | null>(null)
  const [cameraEnabled, setCameraEnabled] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [manualCode, setManualCode] = useState("")
  const [recentScans, setRecentScans] = useState<readonly ScanHistoryEntry[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(null)
  const manualCodeInputRef = useRef<HTMLInputElement>(null)
  const nextHistoryIdRef = useRef(0)
  const isCameraActive = cameraEnabled && !forceCameraOff
  const selectedHistoryEntry = recentScans.find((entry) => entry.id === selectedHistoryId) ?? null

  const handleScanNext = useCallback(() => {
    setLastOutcome(null)
    setManualCode("")
    onScanNext?.()
    window.setTimeout(() => manualCodeInputRef.current?.focus(), 0)
  }, [onScanNext])

  function recordOutcome(outcome: ScanOutcome) {
    setLastOutcome(outcome)
    nextHistoryIdRef.current += 1
    const id = nextHistoryIdRef.current
    setRecentScans((entries) => [{ id, outcome }, ...entries].slice(0, RECENT_SCAN_LIMIT))
  }

  async function submitScan(scanCode: string) {
    if (!scanCode || isPending || lastOutcome) return
    try {
      const result = await onScan(scanCode)
      recordOutcome({ kind: "result", result })
    } catch (error) {
      const message = onScanError(error)
      if (message) recordOutcome({ kind: "error", message })
    }
  }

  function handleCameraScan(codes: ReadonlyArray<{ rawValue: string }>) {
    if (lastOutcome) return
    const rawValue = codes[0]?.rawValue?.trim()
    if (rawValue) void submitScan(rawValue)
  }

  function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submitScan(manualCode.trim())
  }

  function handleToggleCamera() {
    if (!isCameraActive) setCameraError(null)
    setCameraEnabled(!isCameraActive && !forceCameraOff)
  }

  function handleCameraError() {
    setCameraEnabled(false)
    setCameraError(m.studio_event_checkin_camera_error())
  }

  function handleManualCodeChange(event: ChangeEvent<HTMLInputElement>) {
    setManualCode(event.currentTarget.value)
  }

  return (
    <section
      className="mx-auto grid w-full max-w-3xl gap-4 py-4 sm:py-6"
      aria-labelledby="ticket-checkin-scanner-title">
      <header className="grid gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {leadingAction ?? <span />}
          {trailingAction}
        </div>
        <div>
          <p className="font-body text-xs font-medium uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
          <h1
            id="ticket-checkin-scanner-title"
            className="font-heading text-2xl font-semibold tracking-tight text-highlight">
            {title}
          </h1>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </header>

      {statsSection}

      {cameraError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive-text">
          <AlertCircleIcon aria-hidden="true" />
          <p>{cameraError}</p>
        </div>
      ) : null}

      {isCameraActive ? (
        <div
          className="relative overflow-hidden border border-white/10 bg-card"
          aria-label={m.studio_event_checkin_camera_label()}>
          <Scanner onScan={handleCameraScan} onError={handleCameraError} paused={isPending || lastOutcome !== null} />
          <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-center">
            <span className="rounded-full bg-background/80 px-3 py-1 font-body text-xs text-highlight backdrop-blur">
              {m.event_checkin_access_camera_prompt()}
            </span>
          </div>
        </div>
      ) : null}

      <div
        role="group"
        aria-label={m.studio_event_checkin_controls_label()}
        className="grid gap-3 border border-border bg-background/95 p-3 backdrop-blur sm:border-white/10 sm:bg-white/[0.03] sm:p-4">
        <Button
          type="button"
          variant="outline"
          size="xl"
          className="rounded-none sm:w-fit"
          onClick={handleToggleCamera}>
          {isCameraActive ? <CameraOffIcon data-icon="inline-start" /> : <CameraIcon data-icon="inline-start" />}
          {isCameraActive ? m.studio_event_checkin_camera_stop() : m.studio_event_checkin_camera_start()}
        </Button>
        <form className="grid gap-2" onSubmit={handleManualSubmit}>
          <Label htmlFor="manual-ticket-code">{m.studio_event_checkin_manual_code_label()}</Label>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <Input
              id="manual-ticket-code"
              name="scanCode"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={manualCode}
              ref={manualCodeInputRef}
              className="h-11 font-number text-base tracking-[0.08em] sm:h-11 sm:text-base"
              disabled={isPending}
              onChange={handleManualCodeChange}
            />
            <Button type="submit" size="xl" disabled={isPending || manualCode.trim().length === 0}>
              {isPending ? m.studio_event_checkin_manual_pending() : m.studio_event_checkin_manual_submit()}
            </Button>
          </div>
        </form>
      </div>

      {recentScans.length > 0 ? <RecentScansSection entries={recentScans} onSelect={setSelectedHistoryId} /> : null}

      <ScanResultDialog outcome={lastOutcome} onClose={handleScanNext} />
      <TicketCheckinHistoryDialog entry={selectedHistoryEntry} onClose={() => setSelectedHistoryId(null)} />
    </section>
  )
}

type ScanOutcome =
  | { readonly kind: "result"; readonly result: TicketCheckinScanView }
  | { readonly kind: "error"; readonly message: string }

interface ScanHistoryEntry {
  readonly id: number
  readonly outcome: ScanOutcome
}

function RecentScansSection({
  entries,
  onSelect
}: {
  readonly entries: readonly ScanHistoryEntry[]
  readonly onSelect: (id: number) => void
}) {
  return (
    <section className="grid gap-2" aria-label={m.studio_event_checkin_recent_title()}>
      <h2 className="font-heading text-sm font-semibold text-highlight">{m.studio_event_checkin_recent_title()}</h2>
      <div className="grid gap-2">
        {entries.map((entry) => (
          <RecentScanRow key={entry.id} entry={entry} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

function RecentScanRow({
  entry,
  onSelect
}: {
  readonly entry: ScanHistoryEntry
  readonly onSelect: (id: number) => void
}) {
  const decision = getScanDecision(entry.outcome)
  const isSuccess = decision.status === "success"
  const isWarning = decision.status === "warning"
  const ticket = entry.outcome.kind === "result" ? entry.outcome.result.ticket : undefined
  const primaryLabel = ticket?.holderName ?? ticket?.publicCode ?? decision.label

  function handleSelect() {
    onSelect(entry.id)
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      className="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span
        className={
          isSuccess
            ? "grid size-8 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground"
            : isWarning
              ? "grid size-8 shrink-0 place-items-center rounded-full bg-warning text-warning-foreground"
              : "grid size-8 shrink-0 place-items-center rounded-full bg-destructive text-destructive-foreground"
        }>
        {isSuccess ? (
          <CheckCircle2Icon aria-hidden="true" className="size-4" />
        ) : isWarning ? (
          <TriangleAlertIcon aria-hidden="true" className="size-4" />
        ) : (
          <AlertCircleIcon aria-hidden="true" className="size-4" />
        )}
      </span>
      <span className="grid gap-0.5">
        <span className="font-medium">{primaryLabel}</span>
        <span className="text-xs text-muted-foreground">{decision.description ?? decision.label}</span>
      </span>
    </button>
  )
}

function TicketCheckinHistoryDialog({
  entry,
  onClose
}: {
  readonly entry: ScanHistoryEntry | null
  readonly onClose: () => void
}) {
  const decision = entry ? getScanDecision(entry.outcome) : null
  const isSuccess = decision?.status === "success"
  const isWarning = decision?.status === "warning"

  // Read-only review of a past scan carries no pending decision, so unlike ScanResultDialog
  // this dialog dismisses normally on outside press and Escape, in addition to Close.
  function handleOpenChange(open: boolean) {
    if (!open) onClose()
  }

  return (
    <Dialog open={entry !== null} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-label={m.studio_event_checkin_recent_detail_label()}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto border-border bg-popover p-0 text-popover-foreground sm:max-w-md">
        {entry && decision ? (
          <>
            <DialogHeader className="gap-0">
              <div className="flex items-center gap-3 bg-muted px-4 py-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background/60">
                  {isSuccess ? (
                    <CheckCircle2Icon aria-hidden="true" />
                  ) : isWarning ? (
                    <TriangleAlertIcon aria-hidden="true" />
                  ) : (
                    <AlertCircleIcon aria-hidden="true" />
                  )}
                </span>
                <DialogTitle className="font-heading text-2xl font-semibold leading-none tracking-tight">
                  {m.studio_event_checkin_recent_detail_label()}
                </DialogTitle>
              </div>
              <DialogDescription className="px-4 pt-4 text-sm text-muted-foreground">
                {m.studio_event_checkin_recent_detail_readonly()}
              </DialogDescription>
            </DialogHeader>
            {decision.description ? <p className="px-4 text-sm font-medium">{decision.description}</p> : null}
            {entry.outcome.kind === "result" && entry.outcome.result.firstCheckin ? (
              <div className="px-4">
                <FirstCheckinContext firstCheckin={entry.outcome.result.firstCheckin} />
              </div>
            ) : null}
            {entry.outcome.kind === "result" && entry.outcome.result.ticket ? (
              <div className="px-4">
                <TicketContext ticket={entry.outcome.result.ticket} />
              </div>
            ) : null}
            <DialogFooter className="mt-4 border-border bg-muted/50">
              <DialogClose render={<Button type="button" variant="outline" size="lg" />}>
                {m.studio_event_checkin_result_close()}
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function ScanResultDialog({
  outcome,
  onClose
}: {
  readonly outcome: ScanOutcome | null
  readonly onClose: () => void
}) {
  const decision = outcome ? getScanDecision(outcome) : null
  const isSuccess = decision?.status === "success"
  const isWarning = decision?.status === "warning"

  // Success or failure, this dialog only closes through the explicit Close action below —
  // never a timer, outside press, or Escape. `onOpenChange` fires for every dismissal
  // attempt Base UI recognizes; only the reason for the explicit Close control reaches
  // `onClose`, and DialogClose is the sole trigger for that reason.
  function handleOpenChange(open: boolean, eventDetails: { readonly reason?: string }) {
    if (!open && eventDetails.reason === "close-press") onClose()
  }

  return (
    <Dialog open={outcome !== null} onOpenChange={handleOpenChange} disablePointerDismissal>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto border-border bg-popover p-0 text-popover-foreground sm:max-w-md">
        {outcome && decision ? (
          <>
            <DialogHeader className="gap-0">
              <div
                className={
                  isSuccess
                    ? "flex items-center gap-3 bg-brand px-4 py-4 text-brand-foreground"
                    : isWarning
                      ? "flex items-center gap-3 bg-warning px-4 py-4 text-warning-foreground"
                      : "flex items-center gap-3 bg-destructive px-4 py-4 text-destructive-foreground"
                }>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-background/20">
                  {isSuccess ? (
                    <CheckCircle2Icon aria-hidden="true" />
                  ) : isWarning ? (
                    <TriangleAlertIcon aria-hidden="true" />
                  ) : (
                    <AlertCircleIcon aria-hidden="true" />
                  )}
                </span>
                <DialogTitle className="font-heading text-3xl font-semibold leading-none tracking-tight">
                  {decision.label}
                </DialogTitle>
              </div>
              {decision.description ? (
                <DialogDescription className="px-4 pt-4 text-sm text-muted-foreground">
                  {decision.description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
            {outcome.kind === "result" && outcome.result.firstCheckin ? (
              <div className="px-4">
                <FirstCheckinContext firstCheckin={outcome.result.firstCheckin} />
              </div>
            ) : null}
            {outcome.kind === "result" && outcome.result.ticket ? (
              <div className="px-4">
                <TicketContext ticket={outcome.result.ticket} />
              </div>
            ) : null}
            <DialogFooter className="mt-4 border-border bg-muted/50">
              <DialogClose
                render={
                  <Button type="button" variant={isSuccess ? "default" : isWarning ? "warning" : "outline"} size="lg" />
                }>
                {m.studio_event_checkin_result_close()}
              </DialogClose>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

function getScanDecision(outcome: ScanOutcome) {
  if (outcome.kind === "error")
    return { label: m.studio_event_checkin_result_failed(), status: "failed" as const, description: outcome.message }
  if (outcome.result.accepted)
    return { label: m.studio_event_checkin_result_success(), status: "success" as const, description: null }
  if (outcome.result.failureReason === "duplicate_checkin")
    return {
      label: m.studio_event_checkin_result_duplicate(),
      status: "warning" as const,
      description: outcome.result.failureReasonLabel ?? m.studio_event_checkin_result_generic_failure()
    }
  return {
    label: m.studio_event_checkin_result_failed(),
    status: "failed" as const,
    description: outcome.result.failureReasonLabel ?? m.studio_event_checkin_result_generic_failure()
  }
}

function FirstCheckinContext({ firstCheckin }: { readonly firstCheckin: TicketCheckinScanFirstCheckinView }) {
  return (
    <section
      className="grid gap-1 rounded-xl bg-warning/10 p-4 text-sm"
      aria-label={m.studio_event_checkin_first_checkin_title()}>
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-warning">
        {m.studio_event_checkin_first_checkin_title()}
      </p>
      <p className="text-base font-semibold text-foreground">{firstCheckin.atLabel}</p>
      {firstCheckin.byLabel ? <p className="text-sm text-muted-foreground">{firstCheckin.byLabel}</p> : null}
    </section>
  )
}

function TicketContext({ ticket }: { readonly ticket: TicketCheckinScanTicketView }) {
  return (
    <section
      className="grid gap-4 rounded-xl bg-background/95 p-4 text-foreground"
      aria-label={m.studio_event_checkin_ticket_context_label()}>
      <dl className="grid grid-cols-1 gap-4 text-sm">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {m.studio_event_checkin_ticket_zone_seat()}
          </dt>
          <dd className="mt-1 text-xl font-semibold">{ticket.zoneName}</dd>
          <dd className="text-sm text-muted-foreground">{ticket.seatLabel}</dd>
        </div>
        <div className="border-t pt-4">
          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {m.studio_event_checkin_ticket_name()}
          </dt>
          <dd className="mt-1 text-lg font-semibold">{ticket.holderName}</dd>
        </div>
        <div className="border-t pt-4">
          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {m.studio_event_checkin_ticket_benefit()}
          </dt>
          <dd className="mt-1 font-medium">{ticket.benefitNote}</dd>
        </div>
        <div className="border-t pt-4">
          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {m.studio_event_checkin_ticket_ticket()}
          </dt>
          <dd className="mt-1 font-medium">{ticket.ticketTypeName}</dd>
          <dd className="font-number text-xs text-muted-foreground">{ticket.publicCode}</dd>
        </div>
        {ticket.detail ? (
          <div className="border-t pt-4">
            <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {m.studio_event_checkin_ticket_detail()}
            </dt>
            <dd className="mt-1 font-medium">{ticket.detail}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  )
}

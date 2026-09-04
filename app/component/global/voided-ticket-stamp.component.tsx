import { m } from "@cue/web/shared/i18n/runtime/messages"
import { cn } from "cn"

export const RedactedTicketCode = "••••••••"

export function VoidedTicketStampCard({ className }: { readonly className?: string | undefined }) {
  return (
    <div
      role="status"
      aria-label={m.ticket_detail_voided_notice()}
      className={cn(
        "relative border border-border bg-secondary px-5 pt-5 pb-5 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300",
        className
      )}>
      <span className="pointer-events-none absolute top-4 right-4 rotate-[-12deg] rounded-sm border-2 border-brand px-1.5 py-0.5 text-xs font-extrabold tracking-[0.12em] text-brand">
        {m.not_found_event_stamp()}
      </span>
      <div className="flex items-start justify-between gap-4 pr-14">
        <div>
          <p className="font-body text-[0.72rem] tracking-wide text-highlight/45 uppercase">
            {m.not_found_event_label()}
          </p>
          <p className="mt-1 font-heading text-base font-semibold text-highlight">—</p>
        </div>
        <div className="text-right">
          <p className="font-body text-[0.72rem] tracking-wide text-highlight/45 uppercase">
            {m.not_found_event_code_label()}
          </p>
          <p className="mt-1 font-number text-base font-semibold text-highlight">{RedactedTicketCode}</p>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="relative my-4 border-t border-dashed border-border before:absolute before:top-1/2 before:-left-[1.375rem] before:size-3.5 before:-translate-y-1/2 before:rounded-full before:border before:border-border before:bg-background after:absolute after:top-1/2 after:-right-[1.375rem] after:size-3.5 after:-translate-y-1/2 after:rounded-full after:border after:border-border after:bg-background"
      />
      <p className="font-body text-sm leading-6 text-pretty text-highlight/70">{m.ticket_detail_voided_notice()}</p>
    </div>
  )
}

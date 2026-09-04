import { MarkdownPreviewComponent } from "@bridge/ui/app/component/global/markdown-preview.component"
import { Badge } from "@bridge/ui/app/component/shadcn/badge"
import { Field, FieldDescription, FieldLabel } from "@bridge/ui/app/component/shadcn/field"
import { Switch } from "@bridge/ui/app/component/shadcn/switch"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { cn } from "cn"
import { CheckCircle2Icon, ChevronDownIcon } from "lucide-react"

export interface AgreementDocumentComponentProps {
  readonly id: string
  readonly name: string
  readonly markdown: string
  readonly required: boolean
  readonly accepted: boolean
  readonly expanded: boolean
  readonly onAcceptedChange: (agreementId: string, accepted: boolean) => void
  readonly onToggleExpanded: (agreementId: string) => void
}

export function AgreementDocumentComponent({
  accepted,
  expanded,
  id,
  markdown,
  name,
  onAcceptedChange,
  onToggleExpanded,
  required
}: AgreementDocumentComponentProps) {
  const titleId = `${id}-agreement-title`
  const acceptLabel = m.event_detail_agreement_accept_label({ name })
  const badgeLabel = required ? m.event_detail_agreement_badge_required() : m.event_detail_agreement_badge_optional()

  function handleAcceptedChange(checked: boolean) {
    onAcceptedChange(id, checked)
  }

  function handleToggle() {
    onToggleExpanded(id)
  }

  return (
    <div className="border-b py-3 last:border-b-0" aria-labelledby={titleId}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 text-left">
        <span className="flex min-w-0 items-center gap-2">
          {accepted ? <CheckCircle2Icon className="size-4 shrink-0 text-brand" aria-hidden="true" /> : null}
          <h3
            id={titleId}
            data-testid="agreement-document-title"
            className="truncate font-heading text-base font-semibold text-highlight">
            {name}
          </h3>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <Badge variant={required ? "default" : "secondary"}>{badgeLabel}</Badge>
          <ChevronDownIcon
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-150 motion-reduce:transition-none",
              expanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </span>
      </button>
      {expanded ? (
        <div className="mt-3 grid gap-3">
          <MarkdownPreviewComponent markdown={markdown} />
          <Field>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel>{acceptLabel}</FieldLabel>
              <Switch checked={accepted} onCheckedChange={handleAcceptedChange} aria-label={acceptLabel} />
            </div>
            <FieldDescription>
              {required
                ? m.event_detail_agreement_required_description()
                : m.event_detail_agreement_optional_description()}
            </FieldDescription>
          </Field>
        </div>
      ) : null}
    </div>
  )
}

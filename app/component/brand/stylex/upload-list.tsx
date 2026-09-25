import * as stylex from "@stylexjs/stylex"
import { useRef, useState, type ComponentProps, type ReactNode } from "react"
import type { DropzoneOptions, FileRejection } from "react-dropzone"

import { DropArea } from "./drop-area"
import { token } from "./token.stylex"
import { UploadPreview, UploadPreviewVariant } from "./upload-preview"
import { UploadIssueCode, type UploadIssue, type UploadValidator } from "./upload-validation"

export {
  UploadIssueCode,
  composeUploadValidation,
  uploadValidation,
  type UploadAccept,
  type UploadIssue,
  type UploadValidationContext,
  type UploadValidationItem,
  type UploadValidationMessage,
  type UploadValidationOption,
  type UploadValidator
} from "./upload-validation"

type ValueOf<T> = T[keyof T]

export const UploadChangeReason = { append: "append", replace: "replace", remove: "remove", clear: "clear" } as const
export type UploadChangeReason = ValueOf<typeof UploadChangeReason>

export const UploadListLayout = { list: "list", grid: "grid" } as const
export type UploadListLayout = ValueOf<typeof UploadListLayout>

/**
 * Default item presentation. `none` hides items (and `renderItem`) while selection still runs;
 * `row` forces rows; `thumbnail` forces square tiles, which always sit in the grid track because a
 * full-width square tile is unusable. Omitted: row for list, tile for grid.
 */
export const UploadListPreview = { none: "none", row: "row", thumbnail: "thumbnail" } as const
export type UploadListPreview = ValueOf<typeof UploadListPreview>

/** `none` (default): report through callbacks only. `inline`: also render the latest issues in `role="alert"`. */
export const UploadIssueDisplay = { none: "none", inline: "inline" } as const
export type UploadIssueDisplay = ValueOf<typeof UploadIssueDisplay>

export type UploadRejection = { file: File; errors: FileRejection["errors"] }
export type UploadAttachment = {
  id: string
  name: string
  type: string
  size: number
  description?: string
  thumbnail?: { src: string; alt: string }
  transfer?: ComponentProps<typeof UploadPreview>["transfer"]
} & ({ file: File; url?: never } | { url: string; file?: never })

/** Second `onValueChange` argument: why the value changed and which attachment were added or removed. */
export type UploadChange = { reason: UploadChangeReason; attachment: UploadAttachment[] }
export type UploadIssueEvent = { accepted: File[]; rejected: File[] }
export type UploadItemHelper = {
  remove: () => void
  clear: () => void
  preview?: () => void
  layout: UploadListLayout
}

export type UploadListCopy = {
  choose: string
  remove: (name: string) => string
  preview: (name: string) => string
  size: (size: number) => string
  rejected: (name: string) => string
  removed: (name: string) => string
  selected: (count: number) => string
  retry?: string
  cancel?: string
}

export type UploadListProps = {
  value: UploadAttachment[]
  onValueChange: (value: UploadAttachment[], change: UploadChange) => void
  onPreview?: (attachment: UploadAttachment) => void
  /** Every issue: react-dropzone rejection, count/byte limit and `validate` output. Never toasts (DEC-002). */
  onIssue?: (issue: UploadIssue[], event: UploadIssueEvent) => void
  /** @deprecated Use `onIssue`. Still fires with per-file rejections for back-compat. */
  onReject?: (rejections: UploadRejection[]) => void
  onRetry?: (attachment: UploadAttachment) => void
  onCancel?: (attachment: UploadAttachment) => void
  /** Composable validator. See `uploadValidation` and `composeUploadValidation`. */
  validate?: UploadValidator
  issueDisplay?: UploadIssueDisplay
  layout?: UploadListLayout
  preview?: UploadListPreview
  /** `false` enables single-file replace mode: a new selection replaces the value (reason `replace`). */
  multiple?: boolean
  renderEmpty?: () => ReactNode
  renderItem?: (attachment: UploadAttachment, helper: UploadItemHelper) => ReactNode
  maxCount?: number
  maxTotalSize?: number
  disabled?: boolean
  accept?: DropzoneOptions["accept"]
  maxSize?: number
  children: ReactNode
  copy: UploadListCopy
}

const style = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: 12 },
  list: { display: "flex", flexDirection: "column", gap: 8, listStyleType: "none", padding: 0, margin: 0 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
    gap: 8,
    listStyleType: "none",
    padding: 0,
    margin: 0
  },
  message: { margin: 0 },
  issue: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    margin: 0,
    paddingInlineStart: 16,
    color: token.destructive,
    fontSize: "var(--bridge-font-size-sm, 0.75em)"
  }
})

type SelectionResult = {
  next: UploadAttachment[]
  added: UploadAttachment[]
  removed: UploadAttachment[]
  issue: UploadIssue[]
  rejection: UploadRejection[]
  accepted: File[]
  rejected: File[]
}

function toAttachment(file: File): UploadAttachment {
  return { id: crypto.randomUUID(), name: file.name, type: file.type, size: file.size, file }
}

function resolveSelection(
  file: File[],
  dropzoneRejection: readonly FileRejection[],
  option: {
    value: UploadAttachment[]
    replace: boolean
    maxCount: number
    maxTotalSize: number
    validate?: UploadValidator
    rejectedCopy: (name: string) => string
  }
): SelectionResult {
  const base = option.replace ? [] : [...option.value]
  const issue: UploadIssue[] = dropzoneRejection.flatMap((item) =>
    item.errors.map((error) => ({ code: error.code, message: error.message, file: item.file }))
  )
  const rejection: UploadRejection[] = dropzoneRejection.map((item) => ({ file: item.file, errors: item.errors }))
  const validated = option.validate?.(file, { value: base }) ?? []
  issue.push(...validated)
  const blocked = new Set(validated.flatMap((item) => (item.file ? [item.file] : [])))
  for (const item of validated)
    if (item.file) rejection.push({ file: item.file, errors: [{ code: item.code, message: item.message }] })
  const added: UploadAttachment[] = []
  let size = base.reduce((total, item) => total + item.size, 0)
  for (const item of file) {
    if (blocked.has(item)) continue
    const code =
      base.length + added.length >= option.maxCount
        ? UploadIssueCode.tooManyFiles
        : size + item.size > option.maxTotalSize
          ? UploadIssueCode.totalSizeExceeded
          : undefined
    if (code) {
      const message = option.rejectedCopy(item.name)
      issue.push({ code, message, file: item })
      rejection.push({ file: item, errors: [{ code, message }] })
      blocked.add(item)
      continue
    }
    added.push(toAttachment(item))
    size += item.size
  }
  return {
    next: [...base, ...added],
    added,
    removed: option.replace && added.length ? option.value : [],
    issue,
    rejection,
    accepted: file.filter((item) => !blocked.has(item)),
    rejected: [...dropzoneRejection.map((item) => item.file), ...file.filter((item) => blocked.has(item))]
  }
}

function UploadIssueList({ issue }: { issue: UploadIssue[] }) {
  if (!issue.length) return null
  const unique = [
    ...new Map(issue.map((item) => [`${item.code}:${item.file?.name ?? ""}:${item.message}`, item])).entries()
  ]
  return (
    <ul role="alert" data-slot="upload-issue" {...stylex.props(style.issue)}>
      {unique.map(([key, item]) => (
        <li key={key}>{item.message}</li>
      ))}
    </ul>
  )
}

export function UploadList({
  value,
  onValueChange,
  onPreview,
  onIssue,
  onReject,
  onRetry,
  onCancel,
  validate,
  issueDisplay = UploadIssueDisplay.none,
  layout = UploadListLayout.list,
  preview,
  multiple = true,
  renderEmpty,
  renderItem,
  maxCount = Infinity,
  maxTotalSize = Infinity,
  disabled,
  accept,
  maxSize,
  copy,
  children
}: UploadListProps) {
  const root = useRef<HTMLDivElement>(null)
  const [message, setMessage] = useState("")
  const [latestIssue, setLatestIssue] = useState<UploadIssue[]>([])
  const replace = !multiple
  const focusDropArea = () => root.current?.querySelector<HTMLElement>('[data-slot="drop-area"]')?.focus()
  const remove = (item: UploadAttachment) => {
    onValueChange(
      value.filter((entry) => entry.id !== item.id),
      { reason: UploadChangeReason.remove, attachment: [item] }
    )
    setMessage(copy.removed(item.name))
    focusDropArea()
  }
  const clear = () => {
    onValueChange([], { reason: UploadChangeReason.clear, attachment: value })
    focusDropArea()
  }
  const variant =
    preview === UploadListPreview.thumbnail || (!preview && layout === UploadListLayout.grid)
      ? UploadPreviewVariant.tile
      : UploadPreviewVariant.row
  return (
    <div ref={root} data-slot="upload-list" data-layout={layout} {...stylex.props(style.root)}>
      <DropArea
        label={copy.choose}
        disabled={disabled}
        accept={accept}
        maxSize={maxSize}
        multiple={multiple}
        onDrop={(file, dropzoneRejection) => {
          const result = resolveSelection(file, dropzoneRejection, {
            value,
            replace,
            maxCount,
            maxTotalSize,
            validate,
            rejectedCopy: copy.rejected
          })
          if (result.added.length)
            onValueChange(result.next, {
              reason: replace && value.length ? UploadChangeReason.replace : UploadChangeReason.append,
              attachment: result.added
            })
          if (result.rejection.length) onReject?.(result.rejection)
          if (result.issue.length) onIssue?.(result.issue, { accepted: result.accepted, rejected: result.rejected })
          setLatestIssue(result.issue)
          setMessage(
            [copy.selected(result.added.length), ...result.rejection.map((item) => copy.rejected(item.file.name))].join(
              ". "
            )
          )
        }}>
        {children}
      </DropArea>
      {issueDisplay === UploadIssueDisplay.inline ? <UploadIssueList issue={latestIssue} /> : null}
      {value.length === 0 && renderEmpty ? renderEmpty() : null}
      {preview === UploadListPreview.none ? null : (
        <ul
          {...stylex.props(
            layout === UploadListLayout.grid || variant === UploadPreviewVariant.tile ? style.grid : style.list
          )}>
          {value.map((item) => (
            <li key={item.id}>
              {renderItem ? (
                renderItem(item, {
                  remove: () => remove(item),
                  clear,
                  preview: onPreview ? () => onPreview(item) : undefined,
                  layout
                })
              ) : (
                <UploadPreview
                  variant={variant}
                  name={item.name}
                  type={item.type}
                  description={item.description ?? copy.size(item.size)}
                  thumbnail={item.thumbnail}
                  transfer={item.transfer}
                  disabled={disabled}
                  previewAction={
                    onPreview ? { label: copy.preview(item.name), onClick: () => onPreview(item) } : undefined
                  }
                  retryAction={onRetry && copy.retry ? { label: copy.retry, onClick: () => onRetry(item) } : undefined}
                  cancelAction={
                    onCancel && copy.cancel ? { label: copy.cancel, onClick: () => onCancel(item) } : undefined
                  }
                  removeAction={{ label: copy.remove(item.name), onClick: () => remove(item) }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <p role="status" aria-atomic="true" {...stylex.props(style.message)}>
        {message}
      </p>
    </div>
  )
}

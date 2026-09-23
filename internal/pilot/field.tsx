import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

const style = stylex.create({
  title: { lineHeight: "20px" },
  root: { display: "flex", width: "100%", gap: 8 },
  vertical: { flexDirection: "column" },
  horizontal: { flexDirection: "row", alignItems: "center" },
  responsive: { flexDirection: { default: "column", "@container (min-width: 28rem)": "row" } },
  label: {
    display: "flex",
    width: "fit-content",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "1.375"
  },
  error: { color: token.errorText, fontSize: 14, lineHeight: "20px", fontWeight: 400 },
  list: {
    margin: 0,
    marginInlineStart: 16,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    listStyleType: "disc"
  },
  group: { display: "flex", flexDirection: "column", width: "100%", gap: 20, containerType: "inline-size" },
  content: { display: "flex", flexDirection: "column", flex: 1, gap: 2, lineHeight: "1.375" },
  description: { color: token.mutedForeground, fontSize: 14, lineHeight: "1.5", margin: 0 },
  set: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    borderWidth: 0,
    borderStyle: "solid",
    margin: 0,
    padding: 0
  },
  legend: { marginBottom: 6, padding: 0, fontWeight: 500, fontSize: 16 },
  legendLabel: { fontSize: 14 },
  separator: { position: "relative", marginBlock: -8, height: 20, fontSize: 14 },
  line: { position: "absolute", top: "50%", width: "100%", height: 1, backgroundColor: token.border },
  separatorContent: {
    position: "relative",
    marginInline: "auto",
    display: "block",
    width: "fit-content",
    backgroundColor: token.background,
    paddingInline: 8,
    color: token.mutedForeground
  }
})

export function Field({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<"div"> & { orientation?: "vertical" | "horizontal" | "responsive" | null }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      {...props}
      className={[stylex.props(style.root, orientation && style[orientation]).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function FieldLabel({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      {...props}
      className={[stylex.props(style.label).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function FieldError({
  className,
  children,
  errors,
  ...props
}: ComponentProps<"div"> & { errors?: Array<{ message?: string } | undefined> }) {
  const uniqueErrors = [...new Map(errors?.map((error) => [error?.message, error])).values()]
  const content =
    children ||
    (!errors?.length ? null : uniqueErrors.length === 1 ? (
      uniqueErrors[0]?.message
    ) : (
      <ul {...stylex.props(style.list)}>
        {uniqueErrors.map((error) => error?.message && <li key={error.message}>{error.message}</li>)}
      </ul>
    ))
  if (!content) return null
  return (
    <div
      role="alert"
      data-slot="field-error"
      {...props}
      className={[stylex.props(style.error).className, className].filter(Boolean).join(" ")}>
      {content}
    </div>
  )
}
export function FieldGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      {...props}
      className={[stylex.props(style.group).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function FieldContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function FieldTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      {...props}
      className={[stylex.props(style.label, style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function FieldSet({ className, ...props }: ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      {...props}
      className={[stylex.props(style.set).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function FieldLegend({
  className,
  variant = "legend",
  ...props
}: ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      {...props}
      className={[stylex.props(style.legend, variant === "label" && style.legendLabel).className, className]
        .filter(Boolean)
        .join(" ")}
    />
  )
}
export function FieldSeparator({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      {...props}
      className={[stylex.props(style.separator).className, className].filter(Boolean).join(" ")}>
      <div role="none" {...stylex.props(style.line)} />
      {children && (
        <span data-slot="field-separator-content" {...stylex.props(style.separatorContent)}>
          {children}
        </span>
      )}
    </div>
  )
}

import * as stylex from "@stylexjs/stylex"
import { cn } from "cn"
import type { ReactNode } from "react"
import { useDropzone } from "react-dropzone"
import type { DropzoneOptions } from "react-dropzone"

const styles = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    minHeight: "10rem",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    padding: "1.5rem",
    textAlign: "center"
  },
  inline: { minHeight: "5rem", flexDirection: "row", textAlign: "start", padding: "1rem" },
  compact: { minHeight: "2.5rem", flexDirection: "row", padding: "0.5rem", gap: "0.5rem" }
})

export function DropArea({
  children,
  label,
  className,
  disabled,
  layout = "stacked",
  ...options
}: DropzoneOptions & {
  children: ReactNode
  label: string
  className?: string
  layout?: "stacked" | "inline" | "compact"
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ disabled, ...options })
  return (
    <div
      {...getRootProps({ role: "button", "aria-label": label, "aria-disabled": disabled })}
      data-slot="drop-area"
      data-active={isDragActive}
      data-rejected={isDragReject}
      className={cn(
        stylex.props(styles.root, layout === "inline" && styles.inline, layout === "compact" && styles.compact)
          .className,
        "cursor-pointer rounded-xl border border-dashed border-input outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:border-primary data-[active=true]:bg-accent data-[rejected=true]:border-destructive aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        className
      )}>
      <input {...getInputProps({ "aria-label": label, disabled, style: { display: "none" } })} />
      {children}
    </div>
  )
}

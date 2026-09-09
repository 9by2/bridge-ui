import * as stylex from "@stylexjs/stylex"
import type { ReactNode } from "react"
import { useDropzone, type DropzoneOptions } from "react-dropzone"

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    minHeight: "10rem",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
    textAlign: "center",
    cursor: { default: "pointer", ':is([aria-disabled="true"])': "not-allowed" },
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: {
      default: token.input,
      ':is([data-active="true"])': token.primary,
      ':is([data-rejected="true"])': token.destructive
    },
    outline: "none",
    boxShadow: { default: "none", ":focus-visible": `0 0 0 2px ${token.ring}` },
    backgroundColor: { default: "transparent", ':is([data-active="true"])': token.accent },
    opacity: { default: 1, ':is([aria-disabled="true"])': 0.5 }
  },
  inline: { minHeight: "5rem", flexDirection: "row", textAlign: "start", padding: 16 },
  compact: { minHeight: "2.5rem", flexDirection: "row", padding: 8, gap: 8 }
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
      className={[
        stylex.props(style.root, layout === "inline" && style.inline, layout === "compact" && style.compact).className,
        className
      ]
        .filter(Boolean)
        .join(" ")}>
      <input {...getInputProps({ "aria-label": label, disabled, style: { display: "none" } })} />
      {children}
    </div>
  )
}

import { cn } from "cnfast"
import type { ComponentPropsWithoutRef } from "react"

export type StudioStatusTone = "success" | "pending" | "destructive" | "neutral"

const StudioStatusToneClass: Record<StudioStatusTone, string> = {
  success: "bg-brand text-brand-foreground",
  pending: "bg-warning text-warning-foreground",
  destructive: "bg-destructive/20 text-destructive-text",
  neutral: "bg-white/[0.06] text-highlight/70"
}

export function StudioStatusPill({
  className,
  tone,
  ...props
}: ComponentPropsWithoutRef<"span"> & { readonly tone: StudioStatusTone }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center px-2 font-body text-xs font-medium whitespace-nowrap",
        StudioStatusToneClass[tone],
        className
      )}
      {...props}
    />
  )
}

export function StudioEventStatusTone(status: string): StudioStatusTone {
  if (status === "published") return "success"
  if (status === "draft") return "pending"
  return "neutral"
}

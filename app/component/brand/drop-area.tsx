import { cn } from "cn"
import type { ReactNode } from "react"
import { useDropzone } from "react-dropzone"
import type { DropzoneOptions } from "react-dropzone"

export function DropArea({
  children,
  label,
  className,
  disabled,
  ...options
}: DropzoneOptions & {
  children: ReactNode
  label: string
  className?: string
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ disabled, ...options })
  return (
    <div
      {...getRootProps({ role: "button", "aria-label": label, "aria-disabled": disabled })}
      data-slot="drop-area"
      data-active={isDragActive}
      data-rejected={isDragReject}
      className={cn(
        "relative flex min-h-40 w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-input p-6 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring data-[active=true]:border-primary data-[active=true]:bg-accent data-[rejected=true]:border-destructive aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        className
      )}>
      <input {...getInputProps({ "aria-label": label, disabled, style: { display: "none" } })} />
      {children}
    </div>
  )
}

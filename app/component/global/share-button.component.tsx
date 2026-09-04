import { cn } from "cnfast"
import { Share2Icon } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"

export interface ShareButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> {
  readonly ariaLabel: string
}

export function ShareButton({ ariaLabel, className, type = "button", ...props }: ShareButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn("flex size-11 items-center justify-center rounded-lg text-highlight", className)}
      {...props}>
      <Share2Icon className="size-4" aria-hidden="true" />
    </button>
  )
}

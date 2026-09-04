import cn from "cnfast"
import { LoaderCircleIcon } from "lucide-react"
import type { ComponentPropsWithRef } from "react"

export function LoadingSpinnerComponent({ className, ...props }: ComponentPropsWithRef<"svg">) {
  return <LoaderCircleIcon className={cn("animate-spin", className)} {...props} />
}

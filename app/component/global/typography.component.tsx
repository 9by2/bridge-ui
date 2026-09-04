import { cn } from "cn"
import type { ComponentPropsWithRef } from "react"

export const WAIHeading = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6"
} as const
type WAIHeading = ValueOf<typeof WAIHeading>
interface ParagraphProps extends ComponentPropsWithRef<"p"> {}
interface HeadingProps extends ComponentPropsWithRef<"h1"> {
  as?: WAIHeading
}
const HeadingClass: Record<WAIHeading, string> = {
  [WAIHeading.H1]: "text-4xl",
  [WAIHeading.H2]: "text-2xl",
  [WAIHeading.H3]: "text-xl",
  [WAIHeading.H4]: "text-lg",
  [WAIHeading.H5]: "",
  [WAIHeading.H6]: ""
}
export function Heading({ as: Tag = WAIHeading.H4, className, children, ...props }: HeadingProps) {
  return (
    <Tag className={cn("text-highlight font-heading", HeadingClass[Tag], className)} {...props}>
      {children}
    </Tag>
  )
}
export function Label({ className, children, ...props }: ParagraphProps) {
  return (
    <span className={cn(className, "")} {...props}>
      {children}
    </span>
  )
}
export function Body({ className, children, ...props }: ParagraphProps) {
  return (
    <p className={cn(className, "leading-[1.3]")} {...props}>
      {children}
    </p>
  )
}

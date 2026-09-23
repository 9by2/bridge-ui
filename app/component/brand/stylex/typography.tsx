import * as stylex from "@stylexjs/stylex"
import type { ComponentProps } from "react"

import { token } from "./token.stylex"

type ValueOf<T> = T[keyof T]

export const WAIHeading = {
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6"
} as const
export type WAIHeading = ValueOf<typeof WAIHeading>

type HeadingProps = ComponentProps<"h1"> & { as?: WAIHeading }

const style = stylex.create({
  heading: { color: token.highlight, fontFamily: token.fontHeading },
  h1: { fontSize: "var(--bridge-font-size-5xl, 2.25em)" },
  h2: { fontSize: "var(--bridge-font-size-3xl, 1.5em)" },
  h3: { fontSize: "var(--bridge-font-size-2xl, 1.25em)" },
  h4: { fontSize: "var(--bridge-font-size-xl, 1.125em)" },
  body: { lineHeight: 1.3 }
})

const headingSize = {
  [WAIHeading.H1]: style.h1,
  [WAIHeading.H2]: style.h2,
  [WAIHeading.H3]: style.h3,
  [WAIHeading.H4]: style.h4,
  [WAIHeading.H5]: undefined,
  [WAIHeading.H6]: undefined
} as const

export function Heading({ as: Tag = WAIHeading.H4, className, ...props }: HeadingProps) {
  return (
    <Tag
      data-slot="heading"
      data-heading-level={Tag}
      {...props}
      className={[stylex.props(style.heading, headingSize[Tag]).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function Label({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="label" {...props} className={[className].filter(Boolean).join(" ")} />
}

export { Label as TypographyLabel }

export function Body({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="body"
      {...props}
      className={[stylex.props(style.body).className, className].filter(Boolean).join(" ")}
    />
  )
}

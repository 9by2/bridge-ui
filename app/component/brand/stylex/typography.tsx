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
  body: { fontSize: "var(--bridge-text-size-lg, 1rem)", lineHeight: 1.3 },
  blockquote: {
    marginBlock: 16,
    marginInline: 0,
    paddingInlineStart: "var(--bridge-unit-16, 16px)",
    borderInlineStartWidth: 2,
    borderInlineStartStyle: "solid",
    borderInlineStartColor: token.border,
    color: token.foreground,
    fontStyle: "italic",
    lineHeight: 1.6
  },
  inlineCode: {
    borderRadius: "var(--bridge-radius-4, 0.25em)",
    paddingInline: "0.3em",
    paddingBlock: "0.1em",
    backgroundColor: token.muted,
    fontFamily: "var(--bridge-font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)",
    fontSize: "0.875em",
    fontWeight: 500
  },
  list: { marginBlock: 12, paddingInlineStart: "var(--bridge-unit-24, 24px)", lineHeight: 1.6 },
  bullet: { listStyleType: "disc" },
  ordered: { listStyleType: "decimal" },
  lead: {
    marginBlock: 0,
    color: token.mutedForeground,
    fontSize: "var(--bridge-font-size-xl, 1.125em)",
    lineHeight: 1.6
  },
  muted: {
    marginBlock: 0,
    color: token.mutedForeground,
    fontSize: "var(--bridge-text-size-base, 0.875rem)",
    lineHeight: 1.5
  },
  small: { fontSize: "var(--bridge-text-size-sm, 0.75rem)", fontWeight: 500, lineHeight: 1.2 },
  large: { fontSize: "var(--bridge-text-size-lg, 1rem)", fontWeight: 600, lineHeight: 1.5 }
})

const join = (...value: (string | undefined | false | null)[]) => value.filter(Boolean).join(" ")

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

export function Blockquote({ className, ...props }: ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="blockquote"
      {...props}
      className={join(stylex.props(style.blockquote).className, className)}
    />
  )
}

export function InlineCode({ className, ...props }: ComponentProps<"code">) {
  return (
    <code data-slot="inline-code" {...props} className={join(stylex.props(style.inlineCode).className, className)} />
  )
}

export type ListProps = (ComponentProps<"ul"> & { ordered?: false }) | (ComponentProps<"ol"> & { ordered: true })

/** Prose list. `ordered` renders `ol` with decimal markers; otherwise `ul` with disc markers. */
export function List(props: ListProps) {
  if (props.ordered) {
    const { ordered: _ordered, className, ...rest } = props
    return (
      <ol
        data-slot="list"
        data-ordered="true"
        {...rest}
        className={join(stylex.props(style.list, style.ordered).className, className)}
      />
    )
  }
  const { ordered: _ordered, className, ...rest } = props
  return <ul data-slot="list" {...rest} className={join(stylex.props(style.list, style.bullet).className, className)} />
}

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="lead" {...props} className={join(stylex.props(style.lead).className, className)} />
}

export function Muted({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="muted" {...props} className={join(stylex.props(style.muted).className, className)} />
}

export function Small({ className, ...props }: ComponentProps<"small">) {
  return <small data-slot="small" {...props} className={join(stylex.props(style.small).className, className)} />
}

export function Large({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="large" {...props} className={join(stylex.props(style.large).className, className)} />
}

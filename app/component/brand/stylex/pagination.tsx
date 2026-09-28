import * as stylex from "@stylexjs/stylex"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { Button } from "./button"

type ValueOf<T> = T[keyof T]

/** Active page treatment: `outline` (default) outlines the current page; `muted` is borderless with a muted fill. */
export const PaginationActiveVariant = { outline: "outline", muted: "muted" } as const
export type PaginationActiveVariant = ValueOf<typeof PaginationActiveVariant>

const style = stylex.create({
  root: { marginInline: "auto", display: "flex", width: "100%", justifyContent: "center" },
  content: {
    display: "flex",
    alignItems: "center",
    gap: "var(--bridge-unit-2, 2px)",
    padding: 0,
    margin: 0,
    listStyleType: "none"
  },
  text: { display: { default: "none", "@media (min-width: 640px)": "block" } },
  ellipsis: { display: "flex", width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  icon: { width: 16, height: 16 },
  hidden: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0
  }
})
export function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      {...props}
      className={[stylex.props(style.content).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function PaginationItem(props: ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}
export function PaginationLink({
  className,
  isActive,
  size = "icon",
  activeVariant = PaginationActiveVariant.outline,
  ...props
}: ComponentProps<"a"> &
  Pick<ComponentProps<typeof Button>, "size"> & { isActive?: boolean; activeVariant?: PaginationActiveVariant }) {
  const muted = isActive && activeVariant === PaginationActiveVariant.muted
  return (
    <Button
      variant={isActive && !muted ? "outline" : "ghost"}
      size={size}
      paginationMuted={muted}
      className={className}
      nativeButton={false}
      render={
        <a
          aria-current={isActive ? "page" : undefined}
          data-slot="pagination-link"
          data-active={isActive}
          data-active-variant={activeVariant}
          {...props}
        />
      }
    />
  )
}
export function PaginationPrevious({
  text = "Previous",
  ...props
}: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to previous page" size="default" {...props}>
      <ChevronLeftIcon data-icon="inline-start" {...stylex.props(style.icon)} />
      <span {...stylex.props(style.text)}>{text}</span>
    </PaginationLink>
  )
}
export function PaginationNext({ text = "Next", ...props }: ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink aria-label="Go to next page" size="default" {...props}>
      <span {...stylex.props(style.text)}>{text}</span>
      <ChevronRightIcon data-icon="inline-end" {...stylex.props(style.icon)} />
    </PaginationLink>
  )
}
export function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      {...props}
      className={[stylex.props(style.ellipsis).className, className].filter(Boolean).join(" ")}>
      <MoreHorizontalIcon {...stylex.props(style.icon)} />
      <span {...stylex.props(style.hidden)}>More pages</span>
    </span>
  )
}

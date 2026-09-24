import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import * as stylex from "@stylexjs/stylex"
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode
} from "react"

import { geometryToken, themeToken, token } from "./token.stylex"

export const rateCardVariant = {
  row: "row",
  card: "card",
  plan: "plan"
} as const

type ValueOf<T> = T[keyof T]
export type RateCardVariant = ValueOf<typeof rateCardVariant>

export type RateCardProps = ComponentProps<"article"> & {
  variants: RateCardVariant
  highlight?: boolean
}

type RateCardContextValue = {
  variants: RateCardVariant
  titleId: string
  registerTitle: (id: string | undefined) => void
}

const RateCardContext = createContext<RateCardContextValue | null>(null)

const style = stylex.create({
  root: {
    position: "relative",
    boxSizing: "border-box",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: geometryToken.surfacePadding,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: themeToken.border,
    borderRadius: geometryToken.surfaceRadius,
    backgroundColor: themeToken.surface,
    color: themeToken.surfaceForeground
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 24,
    rowGap: 12
  },
  plan: { gap: 20, padding: 24 },
  highlight: {
    borderColor: themeToken.primary,
    boxShadow: `0 0 0 1px ${themeToken.primary}`
  },
  header: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, minWidth: 0 },
  title: {
    margin: 0,
    minWidth: 0,
    fontFamily: token.fontHeading,
    fontSize: "var(--bridge-font-size-lg, 1em)",
    fontWeight: 600,
    lineHeight: 1.4,
    overflowWrap: "anywhere"
  },
  planTitle: { fontSize: "var(--bridge-font-size-xl, 1.125em)" },
  highlightLabel: {
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    paddingInline: 8,
    paddingBlock: 2,
    borderRadius: token.shapePill,
    backgroundColor: themeToken.primary,
    color: themeToken.primaryForeground,
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    fontWeight: 600,
    lineHeight: "16px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
  },
  content: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 },
  rowContent: { flexGrow: 1, flexShrink: 1, flexBasis: "16rem" },
  description: {
    margin: 0,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: 1.5,
    color: themeToken.mutedForeground,
    overflowWrap: "anywhere"
  },
  price: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    columnGap: 4,
    minWidth: 0
  },
  rowPrice: { flexShrink: 0, justifyContent: "flex-end" },
  pricePrefix: { fontSize: "var(--bridge-font-size-sm, 0.75em)", color: themeToken.mutedForeground },
  priceAmount: {
    fontFamily: token.fontNumber,
    fontSize: "var(--bridge-font-size-2xl, 1.25em)",
    fontWeight: 600,
    lineHeight: 1.2,
    fontVariantNumeric: "tabular-nums",
    overflowWrap: "anywhere"
  },
  planPriceAmount: { fontSize: "var(--bridge-font-size-5xl, 2.25em)", fontWeight: 700 },
  pricePeriod: { fontSize: "var(--bridge-font-size-base, 0.875em)", color: themeToken.mutedForeground },
  detail: { display: "flex", flexDirection: "column", gap: 6, margin: 0 },
  rowDetail: { flexDirection: "row", flexWrap: "wrap", columnGap: 16, rowGap: 4 },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    minWidth: 0,
    fontSize: "var(--bridge-font-size-base, 0.875em)"
  },
  rowDetailItem: { justifyContent: "flex-start", gap: 6 },
  detailLabel: { color: themeToken.mutedForeground },
  detailValue: { margin: 0, fontWeight: 500, textAlign: "end", overflowWrap: "anywhere" },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    margin: 0,
    padding: 0,
    listStyle: "none"
  },
  feature: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: 1.5,
    overflowWrap: "anywhere"
  },
  featureIcon: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    height: "1.5em",
    color: themeToken.mutedForeground
  },
  action: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 },
  stackAction: { marginTop: "auto", paddingTop: 4 },
  rowAction: { flexShrink: 0, marginInlineStart: "auto" }
})

const classes = (own: string | undefined, value?: string) => [own, value].filter(Boolean).join(" ")

function useRateCard() {
  return useContext(RateCardContext)
}

export function RateCard({
  variants,
  highlight = false,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...prop
}: RateCardProps) {
  const titleId = useId()
  const [registeredTitleId, registerTitle] = useState<string | undefined>()
  const labelledBy = ariaLabelledBy ?? (ariaLabel ? undefined : registeredTitleId)
  const context = useMemo(() => ({ variants, titleId, registerTitle }), [variants, titleId])
  return (
    <RateCardContext value={context}>
      <article
        {...prop}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        data-slot="rate-card"
        data-variants={variants}
        data-highlight={highlight || undefined}
        className={classes(
          stylex.props(
            style.root,
            variants === rateCardVariant.row && style.row,
            variants === rateCardVariant.plan && style.plan,
            highlight && style.highlight
          ).className,
          className
        )}>
        {children}
      </article>
    </RateCardContext>
  )
}

export function RateCardHeader({ className, ...prop }: ComponentProps<"div">) {
  return (
    <div data-slot="rate-card-header" {...prop} className={classes(stylex.props(style.header).className, className)} />
  )
}

export function RateCardTitle({ className, render, id, ...prop }: useRender.ComponentProps<"h3">) {
  const context = useRateCard()
  const resolvedId = id ?? context?.titleId
  const register = context?.registerTitle
  useEffect(() => {
    if (!register) return
    register(resolvedId)
    return () => register(undefined)
  }, [register, resolvedId])
  return useRender({
    defaultTagName: "h3",
    render,
    props: mergeProps<"h3">(
      {
        id: resolvedId,
        className: classes(
          stylex.props(style.title, context?.variants === rateCardVariant.plan && style.planTitle).className,
          className
        )
      },
      prop
    ),
    state: { slot: "rate-card-title" }
  })
}

export function RateCardHighlight({ className, ...prop }: ComponentProps<"span">) {
  return (
    <span
      data-slot="rate-card-highlight"
      {...prop}
      className={classes(stylex.props(style.highlightLabel).className, className)}
    />
  )
}

export function RateCardContent({ className, ...prop }: ComponentProps<"div">) {
  const context = useRateCard()
  return (
    <div
      data-slot="rate-card-content"
      {...prop}
      className={classes(
        stylex.props(style.content, context?.variants === rateCardVariant.row && style.rowContent).className,
        className
      )}
    />
  )
}

export function RateCardDescription({ className, ...prop }: ComponentProps<"p">) {
  return (
    <p
      data-slot="rate-card-description"
      {...prop}
      className={classes(stylex.props(style.description).className, className)}
    />
  )
}

export type RateCardPriceProps = Omit<ComponentProps<"div">, "children"> & {
  amount: ReactNode
  period?: ReactNode
  prefix?: ReactNode
}

export function RateCardPrice({ amount, period, prefix, className, ...prop }: RateCardPriceProps) {
  const variants = useRateCard()?.variants
  return (
    <div
      data-slot="rate-card-price"
      {...prop}
      className={classes(
        stylex.props(style.price, variants === rateCardVariant.row && style.rowPrice).className,
        className
      )}>
      {prefix && <span {...stylex.props(style.pricePrefix)}>{prefix}</span>}
      <span
        data-slot="rate-card-price-amount"
        {...stylex.props(style.priceAmount, variants === rateCardVariant.plan && style.planPriceAmount)}>
        {amount}
      </span>
      {period && <span {...stylex.props(style.pricePeriod)}>{period}</span>}
    </div>
  )
}

export function RateCardDetail({ className, ...prop }: ComponentProps<"dl">) {
  const variants = useRateCard()?.variants
  return (
    <dl
      data-slot="rate-card-detail"
      {...prop}
      className={classes(
        stylex.props(style.detail, variants === rateCardVariant.row && style.rowDetail).className,
        className
      )}
    />
  )
}

export type RateCardDetailItemProps = Omit<ComponentProps<"div">, "children"> & {
  label: ReactNode
  children: ReactNode
}

export function RateCardDetailItem({ label, children, className, ...prop }: RateCardDetailItemProps) {
  const variants = useRateCard()?.variants
  return (
    <div
      data-slot="rate-card-detail-item"
      {...prop}
      className={classes(
        stylex.props(style.detailItem, variants === rateCardVariant.row && style.rowDetailItem).className,
        className
      )}>
      <dt {...stylex.props(style.detailLabel)}>{label}</dt>
      <dd {...stylex.props(style.detailValue)}>{children}</dd>
    </div>
  )
}

export function RateCardFeatureList({ className, ...prop }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="rate-card-feature-list"
      {...prop}
      className={classes(stylex.props(style.featureList).className, className)}
    />
  )
}

export type RateCardFeatureProps = ComponentProps<"li"> & { icon?: ReactNode }

export function RateCardFeature({ icon, children, className, ...prop }: RateCardFeatureProps) {
  return (
    <li data-slot="rate-card-feature" {...prop} className={classes(stylex.props(style.feature).className, className)}>
      {icon && (
        <span aria-hidden="true" {...stylex.props(style.featureIcon)}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </li>
  )
}

export function RateCardAction({ className, ...prop }: ComponentProps<"div">) {
  const variants = useRateCard()?.variants
  return (
    <div
      data-slot="rate-card-action"
      {...prop}
      className={classes(
        stylex.props(style.action, variants === rateCardVariant.row ? style.rowAction : variants && style.stackAction)
          .className,
        className
      )}
    />
  )
}

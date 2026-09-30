import * as stylex from "@stylexjs/stylex"
import { useEffect, useState, type ReactNode } from "react"

import { Button } from "./button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { DataState, DataStateDescription, DataStateTitle } from "./data-state"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "./empty"
import { Skeleton } from "./skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { TableFrame } from "./table-frame"
import { token } from "./token.stylex"

type ValueOf<T> = T[keyof T]

export const DataListStatus = { loading: "loading", error: "error", empty: "empty", ready: "ready" } as const
export type DataListStatus = ValueOf<typeof DataListStatus>

export const DataListVariant = { table: "table", card: "card", auto: "auto" } as const
export type DataListVariant = ValueOf<typeof DataListVariant>

export type DataListColumn<Row> = {
  id: string
  label: ReactNode
  render: (row: Row) => ReactNode
}

const style = stylex.create({
  root: { width: "100%", minWidth: 0 },
  content: { minWidth: 0 },
  cards: { display: "grid" },
  rows: { gap: "var(--bridge-unit-12, 12px)" },
  mobileCard: {
    display: "grid",
    minWidth: 0,
    gap: "var(--bridge-unit-12, 12px)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    padding: "var(--bridge-unit-12, 12px)"
  },
  field: { display: "grid", minWidth: 0, gridTemplateColumns: "minmax(0, 1fr)", gap: 4 },
  label: { color: token.mutedForeground, fontSize: "var(--bridge-font-size-sm, 0.75em)" },
  value: { minWidth: 0, overflowWrap: "anywhere" },
  stack: { display: "flex", minWidth: 0, flexDirection: "column", gap: 2, whiteSpace: "normal" },
  primary: { fontWeight: 500 },
  secondary: { color: token.mutedForeground, fontSize: "var(--bridge-font-size-sm, 0.75em)" },
  action: { display: "flex", justifyContent: "flex-end", whiteSpace: "normal" },
  skeletons: { display: "grid", gap: "var(--bridge-unit-12, 12px)" },
  skeleton: { height: 48, width: "100%" },
  empty: { border: 0, padding: "var(--bridge-unit-24, 24px)" },
  error: { border: 0, minHeight: 160, padding: "var(--bridge-unit-24, 24px)" }
})

export type DataListProps<Row> = {
  status: DataListStatus
  variants?: DataListVariant
  density?: "compact" | "standard"
  framed?: boolean
  title?: ReactNode
  description?: ReactNode
  columns: readonly DataListColumn<Row>[]
  rows: readonly Row[]
  rowKey?: (row: Row, index: number) => string | number
  skeletonRow?: number
  onRetry?: () => void
  retryLabel?: ReactNode
  errorTitle?: ReactNode
  errorDescription?: ReactNode
  emptyTitle?: ReactNode
  emptyDescription?: ReactNode
  emptyAction?: ReactNode
}

export function DataList<Row>({
  status,
  variants = DataListVariant.auto,
  density = "standard",
  framed = true,
  title,
  description,
  columns,
  rows,
  rowKey,
  skeletonRow = 3,
  onRetry,
  retryLabel,
  errorTitle,
  errorDescription,
  emptyTitle,
  emptyDescription,
  emptyAction
}: DataListProps<Row>) {
  const [isNarrow, setIsNarrow] = useState(false)
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const query = window.matchMedia("(max-width: 640px)")
    const update = () => setIsNarrow(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  const heading =
    title || description ? (
      <CardHeader>
        {title ? <CardTitle>{title}</CardTitle> : null}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
    ) : null
  const content = (
    <>
      {status === DataListStatus.loading ? (
        <div
          aria-busy="true"
          role="region"
          aria-label={typeof title === "string" ? title : "Loading list"}
          {...stylex.props(style.skeletons)}>
          {Array.from({ length: Math.max(0, skeletonRow) }, (_, index) => (
            <Skeleton key={index} {...stylex.props(style.skeleton)} />
          ))}
        </div>
      ) : null}
      {status === DataListStatus.error ? (
        <DataState variant="error" onRetry={onRetry} retryLabel={retryLabel} {...stylex.props(style.error)}>
          {errorTitle ? <DataStateTitle>{errorTitle}</DataStateTitle> : null}
          {errorDescription ? <DataStateDescription>{errorDescription}</DataStateDescription> : null}
        </DataState>
      ) : null}
      {status === DataListStatus.empty ? (
        <Empty {...stylex.props(style.empty)}>
          {emptyTitle || emptyDescription ? (
            <EmptyHeader>
              {emptyTitle ? <EmptyTitle>{emptyTitle}</EmptyTitle> : null}
              {emptyDescription ? <EmptyDescription>{emptyDescription}</EmptyDescription> : null}
            </EmptyHeader>
          ) : null}
          {emptyAction}
        </Empty>
      ) : null}
      {status === DataListStatus.ready ? (
        <>
          {variants === DataListVariant.table || (variants === DataListVariant.auto && !isNarrow) ? (
            <div {...stylex.props(style.root)}>
              <TableFrame density={density}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.id}>{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={rowKey?.(row, index) ?? index}>
                        {columns.map((column) => (
                          <TableCell key={column.id}>{column.render(row)}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableFrame>
            </div>
          ) : null}
          {variants === DataListVariant.card || (variants === DataListVariant.auto && isNarrow) ? (
            <div {...stylex.props(style.cards, style.rows)}>
              {rows.map((row, index) => (
                <article
                  key={rowKey?.(row, index) ?? index}
                  aria-label={String(rowKey?.(row, index) ?? `Row ${index + 1}`)}
                  {...stylex.props(style.mobileCard)}>
                  {columns.map((column) => (
                    <div key={column.id} {...stylex.props(style.field)}>
                      <div {...stylex.props(style.label)}>{column.label}</div>
                      <div {...stylex.props(style.value)}>{column.render(row)}</div>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          ) : null}
        </>
      ) : null}
    </>
  )

  return framed ? (
    <Card data-slot="data-list" className={stylex.props(style.root).className}>
      {heading}
      <CardContent {...stylex.props(style.content)}>{content}</CardContent>
    </Card>
  ) : (
    <section data-slot="data-list" {...stylex.props(style.root)}>
      {heading}
      <div {...stylex.props(style.content)}>{content}</div>
    </section>
  )
}

export function TableCellStack({ primary, secondary }: { primary: ReactNode; secondary?: ReactNode }) {
  return (
    <span {...stylex.props(style.stack)}>
      <span {...stylex.props(style.primary)}>{primary}</span>
      {secondary ? <span {...stylex.props(style.secondary)}>{secondary}</span> : null}
    </span>
  )
}

export function TableCellValue({ children, fallback = "-" }: { children: ReactNode; fallback?: ReactNode }) {
  return children === null || children === undefined || children === "" ? <>{fallback}</> : <>{children}</>
}

export function TableCellAction({ children }: { children: ReactNode }) {
  return <span {...stylex.props(style.action)}>{children}</span>
}

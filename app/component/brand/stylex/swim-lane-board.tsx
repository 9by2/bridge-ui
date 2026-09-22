import * as stylex from "@stylexjs/stylex"
import {
  Children,
  Fragment,
  isValidElement,
  useState,
  type ComponentProps,
  type CSSProperties,
  type DragEvent,
  type ReactElement,
  type ReactNode
} from "react"

import { token } from "./token.stylex"

const autoCollapseMode = { empty: "empty", never: "never" } as const
type ValueOf<T> = T[keyof T]
export type SwimLaneBoardAutoCollapse = ValueOf<typeof autoCollapseMode>

export type SwimLaneBoardCoordinate = { laneId?: string; columnId: string; index: number }
export type SwimLaneBoardItemMoveIntent = {
  itemId: string
  source: SwimLaneBoardCoordinate
  destination: SwimLaneBoardCoordinate
  sourceEvent: "pointer"
}
type SwimLaneBoardRow = { id?: string; label: string; count: number; children: ReactNode }

function toCssLength(value: CSSProperties["maxHeight"]) {
  return typeof value === "number" ? `${value}px` : (value ?? "66vh")
}

const style = stylex.create({
  root: {
    overflowX: "auto",
    backgroundColor: token.muted,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    borderRadius: token.shapeSurface,
    boxShadow: "0 12px 32px color-mix(in oklab, black 8%, transparent)"
  },
  matrix: { display: "grid", minWidth: 640, backgroundColor: token.muted },
  single: {
    display: "grid",
    minWidth: 640,
    backgroundColor: token.muted
  },
  corner: {
    position: "sticky",
    top: 0,
    left: 0,
    zIndex: 6,
    paddingTop: 18,
    paddingRight: 14,
    paddingBottom: 18,
    paddingLeft: 14,
    color: token.mutedForeground,
    backgroundColor: token.card,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: token.border,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border
  },
  column: {
    position: "sticky",
    top: 0,
    zIndex: 4,
    minHeight: 68,
    paddingTop: 14,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    backgroundColor: token.card,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: token.border,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: token.border
  },
  firstColumn: { borderLeftWidth: 0 },
  laneColumn: { minHeight: 92 },
  columnName: { color: token.cardForeground, fontSize: 12, fontWeight: 700 },
  toggle: {
    float: "right",
    width: 24,
    height: 24,
    padding: 0,
    borderWidth: 0,
    borderRadius: 6,
    backgroundColor: "transparent",
    color: token.mutedForeground,
    cursor: "pointer",
    fontSize: 18,
    lineHeight: 1
  },
  lane: {
    position: "sticky",
    left: 0,
    zIndex: 3,
    minHeight: 166,
    paddingTop: 14,
    paddingRight: 14,
    paddingBottom: 14,
    paddingLeft: 14,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: token.border,
    backgroundColor: token.card
  },
  rowSeparator: { borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: token.border },
  laneName: { color: token.cardForeground, fontSize: 12, fontWeight: 700 },
  cell: {
    display: "grid",
    alignContent: "start",
    gap: 8,
    minHeight: 166,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    overflowY: "auto",
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: token.border,
    backgroundColor: `color-mix(in oklab, ${token.muted} 45%, ${token.card})`
  },
  firstCell: { borderLeftWidth: 0 },
  item: {
    display: "block",
    width: "100%",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderRadius: "10px",
    backgroundColor: token.card,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.border,
    boxShadow: "0 1px 2px color-mix(in oklab, black 6%, transparent)",
    color: token.cardForeground,
    cursor: "grab",
    fontSize: 12,
    lineHeight: 1.4
  },
  collapsed: {
    position: "relative",
    display: "grid",
    minWidth: 48,
    minHeight: 68,
    padding: 6,
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: token.border,
    backgroundColor: token.card
  },
  compactContent: {
    position: "absolute",
    top: 12,
    left: 12,
    display: "flex",
    alignItems: "center",
    gap: 7,
    whiteSpace: "nowrap",
    transform: "rotate(90deg)",
    transformOrigin: "12px 12px"
  },
  compactToggle: {
    width: 24,
    height: 24,
    padding: 0,
    borderWidth: 0,
    borderRadius: 6,
    backgroundColor: "transparent",
    color: token.mutedForeground,
    cursor: "pointer",
    fontSize: 16,
    lineHeight: 1
  },
  badge: {
    display: "inline-flex",
    width: "max-content",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 7,
    paddingRight: 7,
    borderRadius: token.shapePill,
    backgroundColor: token.secondary,
    color: token.secondaryForeground,
    fontSize: 11,
    fontWeight: 700
  }
})

export type SwimLaneBoardProps = ComponentProps<"section"> & {
  autoCollapse?: SwimLaneBoardAutoCollapse
  collapsedColumnIds?: readonly string[]
  defaultCollapsedColumnIds?: readonly string[]
  label: string
  onCollapsedColumnIdsChange?: (value: readonly string[]) => void
  onItemMove?: (intent: SwimLaneBoardItemMoveIntent) => void
  rowMaxHeight?: CSSProperties["maxHeight"]
}

export type SwimLaneBoardColumnProps = { id: string; label: string; count: number }
export function SwimLaneBoardColumn(_: SwimLaneBoardColumnProps) {
  return null
}

export type SwimLaneBoardLaneProps = { id: string; label: string; count: number; children?: ReactNode }
export function SwimLaneBoardLane(_: SwimLaneBoardLaneProps) {
  return null
}

export type SwimLaneBoardCellProps = { columnId: string; children?: ReactNode }
export function SwimLaneBoardCell(_: SwimLaneBoardCellProps) {
  return null
}

export type SwimLaneBoardItemProps = ComponentProps<"article"> & { id: string }
export function SwimLaneBoardItem({ id, children, className, ...prop }: SwimLaneBoardItemProps) {
  return (
    <article
      {...prop}
      draggable
      data-slot="swim-lane-board-item"
      data-item-id={id}
      onDragStart={(event) => {
        const cell = event.currentTarget.closest<HTMLElement>("[data-swim-lane-board-cell]")
        if (!cell) return
        event.currentTarget.dataset.swimLaneBoardDragging = JSON.stringify({
          laneId: cell.dataset.laneId || undefined,
          columnId: cell.dataset.columnId,
          index: 0
        })
      }}
      className={[stylex.props(style.item).className, className].filter(Boolean).join(" ")}>
      {children}
    </article>
  )
}

function childByType<T>(children: ReactNode, type: unknown) {
  return Children.toArray(children).filter(
    (child): child is ReactElement<T> => isValidElement(child) && child.type === type
  )
}

export function SwimLaneBoard({
  autoCollapse = autoCollapseMode.empty,
  children,
  className,
  collapsedColumnIds: controlledColumnIds,
  defaultCollapsedColumnIds,
  label,
  onCollapsedColumnIdsChange,
  onItemMove,
  rowMaxHeight = "66vh",
  style: inlineStyle,
  ...prop
}: SwimLaneBoardProps) {
  const columns = childByType<SwimLaneBoardColumnProps>(children, SwimLaneBoardColumn)
  const lanes = childByType<SwimLaneBoardLaneProps>(children, SwimLaneBoardLane)
  const directCells = childByType<SwimLaneBoardCellProps>(children, SwimLaneBoardCell)
  const [uncontrolledColumnIds, setUncontrolledColumnIds] = useState<readonly string[]>(
    defaultCollapsedColumnIds ??
      (autoCollapse === autoCollapseMode.empty
        ? columns.filter((column) => column.props.count === 0).map((column) => column.props.id)
        : [])
  )
  const collapsedColumnIds = controlledColumnIds ?? uncontrolledColumnIds
  const hasLane = lanes.length > 0
  const rows: SwimLaneBoardRow[] = hasLane
    ? lanes.map((lane) => ({
        id: lane.props.id,
        label: lane.props.label,
        count: lane.props.count,
        children: lane.props.children
      }))
    : [{ id: undefined, label: "", count: 1, children: directCells }]
  const template = `${hasLane ? "184px " : ""}${columns.map((column) => (collapsedColumnIds.includes(column.props.id) ? "48px" : "minmax(220px, 1fr)")).join(" ")}`
  const toggle = (
    id: string,
    value: readonly string[],
    setValue: (next: readonly string[]) => void,
    onChange?: (next: readonly string[]) => void
  ) => {
    const next = value.includes(id) ? value.filter((valueId) => valueId !== id) : [...value, id]
    setValue(next)
    onChange?.(next)
  }
  const onDrop = (event: DragEvent<HTMLElement>, destination: SwimLaneBoardCoordinate) => {
    event.preventDefault()
    const sourceElement = document.querySelector<HTMLElement>("[data-swim-lane-board-dragging]")
    if (!sourceElement) return
    onItemMove?.({
      itemId: sourceElement.dataset.itemId ?? "",
      source: JSON.parse(sourceElement.dataset.swimLaneBoardDragging ?? "{}"),
      destination,
      sourceEvent: "pointer"
    })
    sourceElement.removeAttribute("data-swim-lane-board-dragging")
  }
  const renderCell = (
    cell: ReactElement<SwimLaneBoardCellProps> | undefined,
    laneId: string | undefined,
    columnId: string,
    single = false,
    gridPosition?: { column: number; row: number }
  ) => {
    const index = 0
    if (collapsedColumnIds.includes(columnId)) return null
    return (
      <div
        key={`${laneId ?? "single"}-${columnId}`}
        data-slot="swim-lane-board-cell"
        data-swim-lane-board-cell
        data-lane-id={laneId}
        data-column-id={columnId}
        style={{
          ...(gridPosition
            ? { gridColumn: gridPosition.column, gridRow: gridPosition.row }
            : single
              ? { gridColumn: columns.findIndex((column) => column.props.id === columnId) + 1, gridRow: 2 }
              : undefined),
          maxHeight: rowMaxHeight
        }}
        aria-label={`${laneId ? `${lanes.find((lane) => lane.props.id === laneId)?.props.label} / ` : ""}${columns.find((column) => column.props.id === columnId)?.props.label}`}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => onDrop(event, { laneId, columnId, index })}
        className={
          stylex.props(
            style.cell,
            single && columns[0]?.props.id === columnId && style.firstCell,
            gridPosition !== undefined && gridPosition.row > 2 && style.rowSeparator
          ).className
        }>
        {cell?.props.children}
      </div>
    )
  }
  const renderColumn = (
    column: ReactElement<SwimLaneBoardColumnProps>,
    single = false,
    gridPosition?: { column: number; rowEnd: number }
  ) => {
    const collapsed = collapsedColumnIds.includes(column.props.id)
    return (
      <div
        key={column.props.id}
        data-slot="swim-lane-board-column"
        style={
          gridPosition
            ? {
                gridColumn: gridPosition.column,
                gridRow: collapsed ? `1 / ${gridPosition.rowEnd}` : 1
              }
            : single
              ? {
                  gridColumn: columns.findIndex((candidate) => candidate.props.id === column.props.id) + 1,
                  gridRow: collapsed ? "1 / span 2" : 1
                }
              : undefined
        }
        className={
          stylex.props(
            collapsed ? style.collapsed : style.column,
            !single && style.laneColumn,
            columns[0]?.props.id === column.props.id && style.firstColumn
          ).className
        }>
        {collapsed ? (
          <span className={stylex.props(style.compactContent).className}>
            <button
              type="button"
              aria-label={`Expand ${column.props.label}`}
              aria-expanded={false}
              onClick={() =>
                toggle(column.props.id, collapsedColumnIds, setUncontrolledColumnIds, onCollapsedColumnIdsChange)
              }
              className={stylex.props(style.compactToggle).className}>
              +
            </button>
            <span className={stylex.props(style.columnName).className}>{column.props.label}</span>
            <span className={stylex.props(style.badge).className}>{column.props.count} items</span>
          </span>
        ) : (
          <>
            <button
              type="button"
              aria-label={`Collapse ${column.props.label}`}
              aria-expanded
              onClick={() =>
                toggle(column.props.id, collapsedColumnIds, setUncontrolledColumnIds, onCollapsedColumnIdsChange)
              }
              className={stylex.props(style.toggle).className}>
              −
            </button>
            <span className={stylex.props(style.columnName).className}>{column.props.label}</span>
          </>
        )}
      </div>
    )
  }
  return (
    <section
      {...prop}
      aria-label={label}
      data-slot="swim-lane-board"
      style={inlineStyle}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}>
      {!hasLane && (
        <div
          className={stylex.props(style.single).className}
          style={{ gridTemplateColumns: template, gridTemplateRows: "68px minmax(248px, auto)" }}>
          {columns.map((column) => renderColumn(column, true))}
          {columns.map((column) =>
            renderCell(
              directCells.find((cell) => cell.props.columnId === column.props.id),
              undefined,
              column.props.id,
              true
            )
          )}
        </div>
      )}
      {hasLane && (
        <div
          className={stylex.props(style.matrix).className}
          style={{
            gridTemplateColumns: template,
            gridTemplateRows: `92px ${rows.map(() => "minmax(166px, auto)").join(" ")}`
          }}>
          <div
            data-slot="swim-lane-board-corner"
            className={stylex.props(style.corner).className}
            style={{ gridColumn: 1, gridRow: 1 }}>
            Lane / status
          </div>
          {columns.map((column, columnIndex) =>
            renderColumn(column, false, { column: columnIndex + 2, rowEnd: rows.length + 2 })
          )}
          {rows.map((lane, laneIndex) => {
            const cells = childByType<SwimLaneBoardCellProps>(lane.children, SwimLaneBoardCell)
            return (
              <Fragment key={lane.id ?? "single"}>
                <div
                  key={`${lane.id ?? "single"}-lane`}
                  data-slot="swim-lane-board-lane"
                  className={stylex.props(style.lane, laneIndex > 0 && style.rowSeparator).className}
                  style={{ gridColumn: 1, gridRow: laneIndex + 2, maxHeight: rowMaxHeight }}>
                  <span className={stylex.props(style.laneName).className}>{lane.label}</span>
                </div>
                {columns.map((column, columnIndex) =>
                  renderCell(
                    cells.find((cell) => cell.props.columnId === column.props.id),
                    lane.id,
                    column.props.id,
                    false,
                    { column: columnIndex + 2, row: laneIndex + 2 }
                  )
                )}
              </Fragment>
            )
          })}
        </div>
      )}
    </section>
  )
}

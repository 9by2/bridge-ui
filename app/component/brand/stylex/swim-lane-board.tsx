import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  pointerWithin,
  useDndContext,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import * as stylex from "@stylexjs/stylex"
import {
  Children,
  createContext,
  Fragment,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
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
  sourceEvent: "pointer" | "keyboard"
}
type SwimLaneBoardRow = { id?: string; label: string; count: number; children: ReactNode }
type SwimLaneBoardItemPosition = SwimLaneBoardCoordinate & { enabled: boolean }
type SwimLaneBoardCellElementProps = ComponentProps<"div"> & {
  "data-lane-id"?: string
  "data-column-id": string
}

const itemPositionContext = createContext<SwimLaneBoardItemPosition>({ columnId: "", index: 0, enabled: false })

function SwimLaneBoardPosition({
  laneId,
  columnId,
  index,
  enabled,
  children
}: SwimLaneBoardItemPosition & { children: ReactNode }) {
  const position = useMemo(() => ({ laneId, columnId, index, enabled }), [laneId, columnId, index, enabled])
  return <itemPositionContext.Provider value={position}>{children}</itemPositionContext.Provider>
}
const pointerDragContext = createContext(false)

const pointerActivationConstraint = { distance: 8 }
const coordinateCollision: CollisionDetection = (argument) =>
  argument.pointerCoordinates ? pointerWithin(argument) : closestCorners(argument)

function toCssLength(value: CSSProperties["maxHeight"]) {
  return typeof value === "number" ? `${value}px` : (value ?? "66vh")
}

function isCoordinate(value: unknown): value is SwimLaneBoardCoordinate {
  if (typeof value !== "object" || value === null) return false
  if (!("columnId" in value) || typeof value.columnId !== "string") return false
  if (!("index" in value) || typeof value.index !== "number") return false
  return !("laneId" in value) || value.laneId === undefined || typeof value.laneId === "string"
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
    fontSize: "var(--bridge-font-size-2xs, 0.625em)",
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
  columnName: { color: token.cardForeground, fontSize: "var(--bridge-font-size-sm, 0.75em)", fontWeight: 700 },
  toggle: {
    float: "right",
    width: 24,
    height: 24,
    padding: 0,
    borderWidth: 0,
    borderRadius: "var(--bridge-radius-6, 0.375em)",
    backgroundColor: "transparent",
    color: token.mutedForeground,
    cursor: "pointer",
    fontSize: "var(--bridge-font-size-xl, 1.125em)",
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
  laneName: { color: token.cardForeground, fontSize: "var(--bridge-font-size-sm, 0.75em)", fontWeight: 700 },
  cell: {
    display: "grid",
    alignContent: "start",
    gap: 8,
    minWidth: 0,
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
    boxSizing: "border-box",
    width: "100%",
    minWidth: 0,
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
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: 1.4
  },
  itemDragging: { opacity: 0.35, cursor: "grabbing" },
  itemOverlay: { cursor: "grabbing", boxShadow: "0 14px 32px color-mix(in oklab, black 20%, transparent)" },
  dropTarget: {
    backgroundColor: `color-mix(in oklab, ${token.primary} 8%, ${token.card})`,
    boxShadow: `inset 0 0 0 2px color-mix(in oklab, ${token.primary} 45%, transparent)`
  },
  dropZone: { outlineWidth: 1, outlineStyle: "dotted", outlineColor: token.primary, outlineOffset: -2 },
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
    borderRadius: "var(--bridge-radius-6, 0.375em)",
    backgroundColor: "transparent",
    color: token.mutedForeground,
    cursor: "pointer",
    fontSize: "var(--bridge-font-size-lg, 1em)",
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
    fontSize: "var(--bridge-font-size-xs, 0.6875em)",
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
function SortableSwimLaneBoardItem({ id, children, className, style: inlineStyle, ...prop }: SwimLaneBoardItemProps) {
  const position = useContext(itemPositionContext)
  const pointerDragging = useContext(pointerDragContext)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data: {
      type: "item",
      itemId: id,
      coordinate: { laneId: position.laneId, columnId: position.columnId, index: position.index },
      overlay: (
        <article
          data-slot="swim-lane-board-item-overlay"
          data-item-id={id}
          style={inlineStyle}
          className={[stylex.props(style.item, style.itemOverlay).className, className].filter(Boolean).join(" ")}>
          {children}
        </article>
      )
    }
  })

  return (
    <article
      {...prop}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      data-slot="swim-lane-board-item"
      data-item-id={id}
      data-dragging={isDragging}
      style={{
        ...inlineStyle,
        transform: isDragging && pointerDragging ? undefined : CSS.Translate.toString(transform),
        transition
      }}
      className={[stylex.props(style.item, isDragging && style.itemDragging).className, className]
        .filter(Boolean)
        .join(" ")}>
      {children}
    </article>
  )
}

export function SwimLaneBoardItem({ id, children, className, ...prop }: SwimLaneBoardItemProps) {
  const position = useContext(itemPositionContext)
  if (position.enabled)
    return (
      <SortableSwimLaneBoardItem id={id} className={className} {...prop}>
        {children}
      </SortableSwimLaneBoardItem>
    )

  return (
    <article
      {...prop}
      data-slot="swim-lane-board-item"
      data-item-id={id}
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

function SortableSwimLaneBoardCell({
  coordinate,
  itemIds,
  children,
  cellProps
}: {
  coordinate: Omit<SwimLaneBoardCoordinate, "index">
  itemIds: string[]
  children: ReactNode
  cellProps: SwimLaneBoardCellElementProps
}) {
  const { active } = useDndContext()
  const id = `swim-lane-board-cell:${coordinate.laneId ?? ""}:${coordinate.columnId}`
  const { isOver, setNodeRef } = useDroppable({
    id,
    data: { type: "cell", coordinate: { ...coordinate, index: itemIds.length } }
  })

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      <div
        {...cellProps}
        ref={setNodeRef}
        data-slot="swim-lane-board-cell"
        data-swim-lane-board-cell
        data-over={isOver}
        data-drop-zone={active !== null}
        className={[
          cellProps.className,
          stylex.props(active !== null && style.dropZone, isOver && style.dropTarget).className
        ]
          .filter(Boolean)
          .join(" ")}>
        {children}
      </div>
    </SortableContext>
  )
}

function InteractiveSwimLaneBoard({
  children,
  onDragEnd
}: {
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
}) {
  const [overlay, setOverlay] = useState<ReactNode>(null)
  const [pointerDragging, setPointerDragging] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: pointerActivationConstraint }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragStart = (event: DragStartEvent) => {
    const pointer = !(event.activatorEvent instanceof KeyboardEvent)
    setPointerDragging(pointer)
    setOverlay(pointer ? (event.active.data.current?.overlay ?? null) : null)
  }
  const finishDrag = (event: DragEndEvent) => {
    setOverlay(null)
    setPointerDragging(false)
    onDragEnd(event)
  }
  const cancelDrag = () => {
    setOverlay(null)
    setPointerDragging(false)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={coordinateCollision}
      onDragStart={onDragStart}
      onDragCancel={cancelDrag}
      onDragEnd={finishDrag}>
      <pointerDragContext.Provider value={pointerDragging}>{children}</pointerDragContext.Provider>
      <DragOverlay adjustScale={false} dropAnimation={null}>
        {overlay}
      </DragOverlay>
    </DndContext>
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
  const dragEnabled = typeof onItemMove === "function"
  const hasLane = lanes.length > 0
  const rows: SwimLaneBoardRow[] = hasLane
    ? lanes.map((lane) => ({
        id: lane.props.id,
        label: lane.props.label,
        count: lane.props.count,
        children: lane.props.children
      }))
    : [{ id: undefined, label: "", count: 1, children: directCells }]
  const collapsedId = new Set(collapsedColumnIds)
  const template = `${hasLane ? "184px " : ""}${columns.map((column) => (collapsedId.has(column.props.id) ? "48px" : "minmax(220px, 1fr)")).join(" ")}`
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
  const onDragEnd = (event: DragEndEvent) => {
    if (!onItemMove || !event.over) return
    const activeData = event.active.data.current
    const overData = event.over.data.current
    if (activeData?.type !== "item" || (overData?.type !== "item" && overData?.type !== "cell")) return

    const source = activeData.coordinate
    const destination = overData.coordinate
    if (!isCoordinate(source) || !isCoordinate(destination)) return
    if (
      source.laneId === destination.laneId &&
      source.columnId === destination.columnId &&
      source.index === destination.index
    )
      return

    onItemMove({
      itemId: String(event.active.id),
      source,
      destination,
      sourceEvent: event.activatorEvent instanceof KeyboardEvent ? "keyboard" : "pointer"
    })
  }
  const renderCell = (
    cell: ReactElement<SwimLaneBoardCellProps> | undefined,
    laneId: string | undefined,
    columnId: string,
    single = false,
    gridPosition?: { column: number; row: number }
  ) => {
    if (collapsedColumnIds.includes(columnId)) return null
    const item = childByType<SwimLaneBoardItemProps>(cell?.props.children, SwimLaneBoardItem)
    const itemIds = item.map((child) => child.props.id)
    const content = Children.map(cell?.props.children, (child) => {
      if (!isValidElement<SwimLaneBoardItemProps>(child) || child.type !== SwimLaneBoardItem) return child
      const index = item.findIndex((candidate) => candidate.props.id === child.props.id)
      return (
        <SwimLaneBoardPosition
          key={child.props.id}
          laneId={laneId}
          columnId={columnId}
          index={index}
          enabled={dragEnabled}>
          {child}
        </SwimLaneBoardPosition>
      )
    })
    const key = `${laneId ?? "single"}-${columnId}`
    const cellProps: SwimLaneBoardCellElementProps = {
      "data-lane-id": laneId,
      "data-column-id": columnId,
      role: "group",
      tabIndex: 0,
      style: {
        ...(gridPosition
          ? { gridColumn: gridPosition.column, gridRow: gridPosition.row }
          : single
            ? { gridColumn: columns.findIndex((column) => column.props.id === columnId) + 1, gridRow: 2 }
            : undefined),
        maxHeight: rowMaxHeight
      },
      "aria-label": `${laneId ? `${lanes.find((lane) => lane.props.id === laneId)?.props.label} / ` : ""}${columns.find((column) => column.props.id === columnId)?.props.label}`,
      className: stylex.props(
        style.cell,
        single && columns[0]?.props.id === columnId && style.firstCell,
        gridPosition !== undefined && gridPosition.row > 2 && style.rowSeparator
      ).className
    }
    if (dragEnabled)
      return (
        <SortableSwimLaneBoardCell key={key} coordinate={{ laneId, columnId }} itemIds={itemIds} cellProps={cellProps}>
          {content}
        </SortableSwimLaneBoardCell>
      )

    return (
      <div key={key} {...cellProps} data-slot="swim-lane-board-cell" data-swim-lane-board-cell>
        {content}
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
            <span className={stylex.props(style.badge).className}>{column.props.count}</span>
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
  const board = (
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

  if (!dragEnabled) return board
  return <InteractiveSwimLaneBoard onDragEnd={onDragEnd}>{board}</InteractiveSwimLaneBoard>
}

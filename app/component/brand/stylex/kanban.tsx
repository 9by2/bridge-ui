import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core"
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DraggableAttributes,
  DraggableSyntheticListeners,
  DropAnimation,
  Modifiers,
  UniqueIdentifier
} from "@dnd-kit/core"
import {
  arrayMove,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  type AnimateLayoutChanges
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import * as stylex from "@stylexjs/stylex"
import * as React from "react"
import type { CSSProperties, ReactNode } from "react"
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"

import { geometryToken, themeToken } from "./token.stylex"

const style = stylex.create({
  root: { cursor: "grabbing", userSelect: "none" },
  board: {
    display: "grid",
    gridAutoRows: "1fr",
    gap: geometryToken.layoutGap,
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))"
  },
  column: { display: "flex", flexDirection: "column", minWidth: 0 },
  columnDragging: { opacity: 0.5, zIndex: 50 },
  disabled: { opacity: 0.5 },
  columnHandle: { opacity: 0, transitionProperty: "opacity", transitionDuration: "150ms" },
  item: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: themeToken.border,
    borderRadius: geometryToken.controlRadius,
    backgroundColor: themeToken.surface,
    color: themeToken.surfaceForeground
  },
  itemDragging: {
    opacity: 0.5
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: "var(--bridge-unit-8, 8px)",
    minHeight: 96,
    padding: "var(--bridge-unit-8, 8px)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    borderRadius: geometryToken.controlRadius,
    transitionProperty: "background-color, border-color, box-shadow",
    transitionDuration: "150ms"
  },
  dropZone: {
    position: "relative",
    backgroundColor: `color-mix(in oklab, ${themeToken.muted} 72%, transparent)`,
    borderStyle: "dashed",
    borderColor: themeToken.muted,
    "::after": {
      content: "attr(aria-label)",
      position: "absolute",
      right: 12,
      bottom: 12,
      left: 12,
      color: themeToken.mutedForeground,
      fontSize: "var(--bridge-font-size-xs, 0.6875em)",
      fontWeight: 700,
      textAlign: "center",
      pointerEvents: "none"
    }
  },
  dropTarget: {
    backgroundColor: themeToken.muted,
    borderStyle: "solid",
    borderColor: themeToken.muted,
    boxShadow: `inset 0 0 0 1px ${themeToken.mutedForeground}, 0 0 0 4px color-mix(in oklab, ${themeToken.mutedForeground} 16%, transparent)`
  },
  overlay: {
    cursor: "grabbing"
  },
  handle: { userSelect: "none", touchAction: "none" },
  grabbing: { cursor: "grabbing" },
  grab: { cursor: "grab" }
})

function joinClassName(...value: unknown[]) {
  return value
    .filter((candidate): candidate is string => typeof candidate === "string" && candidate.length > 0)
    .join(" ")
}

// Stable module-level constants — never recreated, won't trigger dnd-kit effects
const measuringConfig = {
  droppable: { strategy: MeasuringStrategy.Always }
}

const pointerActivationConstraint = { distance: 10 }

interface KanbanContextProps<T> {
  columns: Record<string, T[]>
  setColumns: (columns: Record<string, T[]>) => void
  getItemId: (item: T) => string
  columnIds: string[]
  activeId: UniqueIdentifier | null
  setActiveId: (id: UniqueIdentifier | null) => void
  overId: UniqueIdentifier | null
  setOverId: (id: UniqueIdentifier | null) => void
  findContainer: (id: UniqueIdentifier) => string | undefined
  isColumn: (id: UniqueIdentifier) => boolean
  modifiers?: Modifiers
}

const KanbanContext = createContext<KanbanContextProps<any>>({
  columns: {},
  setColumns: () => {},
  getItemId: () => "",
  columnIds: [],
  activeId: null,
  setActiveId: () => {},
  overId: null,
  setOverId: () => {},
  findContainer: () => undefined,
  isColumn: () => false,
  modifiers: undefined
})

const ColumnContext = createContext<{
  attributes: DraggableAttributes | undefined
  listeners: DraggableSyntheticListeners | undefined
  isDragging?: boolean
  disabled?: boolean
}>({
  attributes: undefined,
  listeners: undefined,
  isDragging: false,
  disabled: false
})

const ItemContext = createContext<{
  listeners: DraggableSyntheticListeners | undefined
  isDragging?: boolean
  disabled?: boolean
}>({
  listeners: undefined,
  isDragging: false,
  disabled: false
})

const IsOverlayContext = createContext(false)

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true })

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: { active: { opacity: "0.4" } }
  })
}

export interface KanbanMoveEvent {
  event: DragEndEvent
  activeContainer: string
  activeIndex: number
  overContainer: string
  overIndex: number
}

export interface KanbanRootProps<T> extends Omit<useRender.ComponentProps<"div">, "children"> {
  value: Record<string, T[]>
  onValueChange: (value: Record<string, T[]>) => void
  getItemValue: (item: T) => string
  children: ReactNode
  onMove?: (event: KanbanMoveEvent) => void
  modifiers?: Modifiers
}

function Kanban<T>({
  value,
  onValueChange,
  getItemValue,
  children,
  className,
  render,
  onMove,
  modifiers,
  ...props
}: KanbanRootProps<T>) {
  const columns = value
  const setColumns = onValueChange
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null)

  // Refs so all callbacks read the latest values without being recreated on every render.
  // This breaks the cascade: columns change → callbacks recreate → DndContext re-registers → loop.
  const columnsRef = useRef(columns)

  const getItemValueRef = useRef(getItemValue)
  const onMoveRef = useRef(onMove)

  useLayoutEffect(() => {
    columnsRef.current = columns
    getItemValueRef.current = getItemValue
    onMoveRef.current = onMove
  }, [columns, getItemValue, onMove])

  // Sensor config objects are stable module-level constants, so useSensors result is stable.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: pointerActivationConstraint }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const columnIds = useMemo(() => Object.keys(columns), [columns])

  // isColumn only depends on columnIds (the keys, not the item arrays). Column keys don't
  // change when items are moved, so columnIds array values are stable during drags.
  const isColumn = useCallback((id: UniqueIdentifier) => columnIds.includes(String(id)), [columnIds])

  // findContainer reads columnsRef so it doesn't need columns or getItemValue in its deps.
  const findContainer = useCallback(
    (id: UniqueIdentifier) => {
      if (isColumn(id)) return String(id)
      const cols = columnsRef.current
      const getId = getItemValueRef.current

      return Object.keys(cols).find((key) => (cols[key] ?? []).some((item) => getId(item) === id))
    },
    [isColumn]
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id)
    setOverId(null)
  }, [])

  // RAF refs throttle onDragOver: we only process the latest event per animation frame.
  // This prevents React from receiving dozens of setState calls per frame during rapid drags,
  // which is what causes "Maximum update depth exceeded".
  const dragOverRafRef = useRef<number | null>(null)
  const pendingDragOverRef = useRef<DragOverEvent | null>(null)

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      setOverId(event.over?.id ?? null)
      if (onMoveRef.current) return

      // Always capture the latest event; only one RAF runs at a time.
      pendingDragOverRef.current = event
      if (dragOverRafRef.current !== null) return

      dragOverRafRef.current = requestAnimationFrame(() => {
        dragOverRafRef.current = null
        const latestEvent = pendingDragOverRef.current

        pendingDragOverRef.current = null
        if (!latestEvent) return

        const { active, over } = latestEvent

        if (!over) return
        if (isColumn(active.id)) return

        const activeContainer = findContainer(active.id)
        const overContainer = findContainer(over.id)

        // Only reorder within the same column during drag. Cross-column moves are
        // committed in onDragEnd instead — moving an item to another column unmounts
        // its DOM node and remounts it, which releases pointer capture and causes the
        // drag to end prematurely when the kanban is rendered inside an iframe.
        if (!activeContainer || !overContainer || activeContainer !== overContainer) return

        const cols = columnsRef.current
        const getId = getItemValueRef.current
        const activeItems = cols[activeContainer] ?? []
        const activeIndex = activeItems.findIndex((item: T) => getId(item) === active.id)
        const overIndex = activeItems.findIndex((item: T) => getId(item) === over.id)

        if (activeIndex === overIndex) return

        setColumns({
          ...cols,
          [activeContainer]: arrayMove(activeItems, activeIndex, overIndex)
        })
      })
    },
    [findContainer, isColumn, setColumns]
  )

  const flushPendingDragOver = useCallback(() => {
    if (dragOverRafRef.current !== null) {
      cancelAnimationFrame(dragOverRafRef.current)
      dragOverRafRef.current = null
    }

    pendingDragOverRef.current = null
  }, [])

  const handleDragCancel = useCallback(() => {
    flushPendingDragOver()
    setActiveId(null)
    setOverId(null)
  }, [flushPendingDragOver])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      flushPendingDragOver()

      const { active, over } = event

      setActiveId(null)
      setOverId(null)

      if (!over) return

      if (onMoveRef.current && !isColumn(active.id)) {
        const cols = columnsRef.current
        const getId = getItemValueRef.current
        const activeContainer = findContainer(active.id)
        const overContainer = findContainer(over.id)

        if (activeContainer && overContainer) {
          const activeIndex = (cols[activeContainer] ?? []).findIndex((item: T) => getId(item) === active.id)

          const overIndex = isColumn(over.id)
            ? (cols[overContainer] ?? []).length
            : (cols[overContainer] ?? []).findIndex((item: T) => getId(item) === over.id)

          onMoveRef.current({ event, activeContainer, activeIndex, overContainer, overIndex })
        }

        return
      }

      if (isColumn(active.id) && isColumn(over.id)) {
        const cols = columnsRef.current
        const keys = Object.keys(cols)
        const activeIndex = keys.indexOf(String(active.id))
        const overIndex = keys.indexOf(String(over.id))

        if (activeIndex !== overIndex) {
          const newOrder = arrayMove(keys, activeIndex, overIndex)
          const newColumns: Record<string, T[]> = {}

          newOrder.forEach((key) => {
            newColumns[key] = cols[key] ?? []
          })

          setColumns(newColumns)
        }

        return
      }

      const activeContainer = findContainer(active.id)
      const overContainer = findContainer(over.id)

      if (!activeContainer || !overContainer) return

      const cols = columnsRef.current
      const getId = getItemValueRef.current
      const activeItems = cols[activeContainer] ?? []
      const activeIndex = activeItems.findIndex((item: T) => getId(item) === active.id)

      if (activeIndex < 0) return

      if (activeContainer === overContainer) {
        const overIndex = (cols[overContainer] ?? []).findIndex((item: T) => getId(item) === over.id)

        if (activeIndex !== overIndex) {
          setColumns({
            ...cols,
            [activeContainer]: arrayMove(activeItems, activeIndex, overIndex)
          })
        }

        return
      }

      const overItems = cols[overContainer] ?? []

      const overIndex = isColumn(over.id) ? overItems.length : overItems.findIndex((item: T) => getId(item) === over.id)

      const newActiveItems = [...activeItems]
      const newOverItems = [...overItems]
      const [movedItem] = newActiveItems.splice(activeIndex, 1)

      if (movedItem) newOverItems.splice(overIndex, 0, movedItem)

      setColumns({ ...cols, [activeContainer]: newActiveItems, [overContainer]: newOverItems })
    },
    [findContainer, isColumn, setColumns, flushPendingDragOver]
  )

  // Stable getItemId wrapper so context consumers don't re-render when the parent
  // passes a new inline arrow function reference.
  const stableGetItemId = useCallback((item: T) => getItemValueRef.current(item), [])

  const contextValue = useMemo(
    () => ({
      columns,
      setColumns,
      getItemId: stableGetItemId,
      columnIds,
      activeId,
      setActiveId,
      overId,
      setOverId,
      findContainer,
      isColumn,
      modifiers
    }),
    [columns, setColumns, stableGetItemId, columnIds, activeId, overId, findContainer, isColumn, modifiers]
  )

  const defaultProps = {
    "data-slot": "kanban",
    "data-dragging": activeId !== null,
    className: joinClassName(stylex.props(activeId !== null && style.root).className, className),
    children
  }

  return (
    <KanbanContext.Provider value={contextValue}>
      <DndContext
        sensors={sensors}
        modifiers={modifiers}
        measuring={measuringConfig}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}>
        {useRender({
          defaultTagName: "div",
          render,
          props: mergeProps<"div">(defaultProps, props)
        })}
      </DndContext>
    </KanbanContext.Provider>
  )
}

export type KanbanBoardProps = useRender.ComponentProps<"div">

function KanbanBoard({ className, render, ...props }: KanbanBoardProps) {
  const { columnIds } = useContext(KanbanContext)

  const defaultProps = {
    "data-slot": "kanban-board",
    className: joinClassName(stylex.props(style.board).className, className),
    children: props.children
  }

  return (
    <SortableContext items={columnIds} strategy={rectSortingStrategy}>
      {useRender({
        defaultTagName: "div",
        render,
        props: mergeProps<"div">(defaultProps, props)
      })}
    </SortableContext>
  )
}

export interface KanbanColumnProps extends useRender.ComponentProps<"div"> {
  value: string
  disabled?: boolean
}

function KanbanColumn({ value, className, render, disabled, ...props }: KanbanColumnProps) {
  const isOverlay = useContext(IsOverlayContext)
  const { activeId, isColumn } = useContext(KanbanContext)

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges
  })

  const isColumnDragging = activeId ? isColumn(activeId) : false

  const inlineStyle: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  const defaultProps = isOverlay
    ? {
        "data-slot": "kanban-column",
        "data-value": value,
        "data-dragging": true,
        className: joinClassName(stylex.props(style.column).className, className),
        children: props.children
      }
    : {
        "data-slot": "kanban-column",
        "data-value": value,
        "data-dragging": isSortableDragging,
        "data-disabled": disabled,
        ref: setNodeRef,
        style: inlineStyle,
        className: joinClassName(
          stylex.props(style.column, isSortableDragging && style.columnDragging, disabled && style.disabled).className,
          className
        ),
        children: props.children
      }
  const node = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props)
  })
  const columnContext = useMemo(
    () =>
      isOverlay
        ? { attributes: undefined, listeners: undefined, isDragging: true, disabled: false }
        : { attributes, listeners, isDragging: isColumnDragging, disabled },
    [isOverlay, attributes, listeners, isColumnDragging, disabled]
  )

  return <ColumnContext.Provider value={columnContext}>{node}</ColumnContext.Provider>
}

export interface KanbanColumnHandleProps extends useRender.ComponentProps<"div"> {
  cursor?: boolean
}

function KanbanColumnHandle({ className, render, cursor = true, ...props }: KanbanColumnHandleProps) {
  const { attributes, listeners, isDragging, disabled } = useContext(ColumnContext)

  const defaultProps = {
    "data-slot": "kanban-column-handle",
    "data-dragging": isDragging,
    "data-disabled": disabled,
    suppressHydrationWarning: true,
    ...attributes,
    ...listeners,
    className: joinClassName(
      stylex.props(style.columnHandle, cursor && (isDragging ? style.grabbing : style.grab)).className,
      className
    ),
    children: props.children
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props)
  })
}

export interface KanbanItemProps extends useRender.ComponentProps<"div"> {
  value: string
  disabled?: boolean
}

function KanbanItem({ value, className, render, disabled, ...props }: KanbanItemProps) {
  const isOverlay = useContext(IsOverlayContext)
  const { activeId, isColumn } = useContext(KanbanContext)

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging: isSortableDragging
  } = useSortable({
    id: value,
    disabled: disabled || isOverlay,
    animateLayoutChanges
  })

  const isItemDragging = activeId ? !isColumn(activeId) : false

  const inlineStyle: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform)
  }

  const defaultProps = isOverlay
    ? {
        "data-slot": "kanban-item",
        "data-value": value,
        "data-dragging": true,
        className: joinClassName(stylex.props(style.item).className, className),
        children: props.children
      }
    : {
        "data-slot": "kanban-item",
        "data-value": value,
        "data-dragging": isSortableDragging,
        "data-disabled": disabled,
        suppressHydrationWarning: true,
        ref: setNodeRef,
        style: inlineStyle,
        ...attributes,
        className: joinClassName(
          stylex.props(style.item, isSortableDragging && style.itemDragging, disabled && style.disabled).className,
          className
        ),
        children: props.children
      }
  const node = useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props)
  })
  const itemContext = useMemo(
    () =>
      isOverlay
        ? { listeners: undefined, isDragging: true, disabled: false }
        : { listeners, isDragging: isItemDragging, disabled },
    [isOverlay, listeners, isItemDragging, disabled]
  )

  return <ItemContext.Provider value={itemContext}>{node}</ItemContext.Provider>
}

export interface KanbanItemHandleProps extends useRender.ComponentProps<"div"> {
  cursor?: boolean
}

function KanbanItemHandle({ className, render, cursor = true, ...props }: KanbanItemHandleProps) {
  const { listeners, isDragging, disabled } = useContext(ItemContext)

  const defaultProps = {
    "data-slot": "kanban-item-handle",
    "data-dragging": isDragging,
    "data-disabled": disabled,
    ...listeners,
    className: joinClassName(
      stylex.props(style.handle, cursor && (isDragging ? style.grabbing : style.grab)).className,
      className
    ),
    children: props.children
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props)
  })
}

export interface KanbanColumnContentProps extends useRender.ComponentProps<"div"> {
  value: string
}

function KanbanColumnContent({ value, className, render, ...props }: KanbanColumnContentProps) {
  const { columns, getItemId, activeId, overId, findContainer, isColumn } = useContext(KanbanContext)

  const itemIds = useMemo(() => (columns[value] ?? []).map(getItemId), [columns, getItemId, value])
  const isItemDragging = activeId !== null && !isColumn(activeId)
  const isDropTarget = isItemDragging && overId !== null && findContainer(overId) === value

  const defaultProps = {
    "data-slot": "kanban-column-content",
    "data-drop-zone": isItemDragging,
    "data-drop-target": isDropTarget,
    className: joinClassName(
      stylex.props(style.content, isItemDragging && style.dropZone, isDropTarget && style.dropTarget).className,
      className
    ),
    children: props.children
  }

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      {useRender({
        defaultTagName: "div",
        render,
        props: mergeProps<"div">(defaultProps, props)
      })}
    </SortableContext>
  )
}

export interface KanbanOverlayProps extends Omit<React.ComponentProps<typeof DragOverlay>, "children"> {
  children?: ReactNode | ((params: { value: UniqueIdentifier; variant: "column" | "item" }) => ReactNode)
}

function KanbanOverlay({ children, className, ...props }: KanbanOverlayProps) {
  const { activeId, isColumn, modifiers } = useContext(KanbanContext)
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => setMounted(true), [])

  const variant = activeId ? (isColumn(activeId) ? "column" : "item") : "item"

  const content =
    activeId && children ? (typeof children === "function" ? children({ value: activeId, variant }) : children) : null

  if (!mounted) return null

  return createPortal(
    <DragOverlay
      dropAnimation={dropAnimationConfig}
      modifiers={modifiers}
      className={joinClassName(stylex.props(style.overlay, activeId !== null && style.grabbing).className, className)}
      {...props}>
      <IsOverlayContext.Provider value={true}>{content}</IsOverlayContext.Provider>
    </DragOverlay>,
    document.body
  )
}

export {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanColumnContent,
  KanbanOverlay
}

import * as stylex from "@stylexjs/stylex"
import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
import {
  cloneElement,
  createContext,
  isValidElement,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode
} from "react"

import { Badge } from "./badge"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { token } from "./token.stylex"

type ContextValue = {
  open: boolean
  selectedValues: Set<string>
  items: Map<string, ReactNode>
  toggleValue: (value: string) => void
  onItemAdded: (value: string, label: ReactNode) => void
  allowedNewItem?: boolean
  allowedSelectAll?: boolean
  addNewItem: (value: string) => void
  selectAll: (keys: string[]) => void
}
const Context = createContext<ContextValue | null>(null)
export const MultiSelectValueAppearance = createContext<"outline" | "default">("outline")
const style = stylex.create({
  trigger: {
    height: "auto",
    minHeight: 36,
    width: "fit-content",
    justifyContent: "space-between",
    gap: "var(--bridge-unit-8, 8px)",
    overflow: "hidden",
    borderRadius: 0,
    paddingInline: "var(--bridge-unit-12, 12px)",
    paddingBlock: "var(--bridge-unit-6, 6px)"
  },
  full: { width: "100%" },
  icon: { width: 16, height: 16, flexShrink: 0, opacity: 0.5 },
  placeholder: { minWidth: 0, overflow: "hidden", fontWeight: 400, color: token.mutedForeground },
  value: { display: "flex", width: "100%", gap: "var(--bridge-unit-6, 6px)", overflow: "hidden" },
  wrap: { height: "100%", flexWrap: "wrap" },
  badge: { display: "flex", alignItems: "center", gap: "var(--bridge-unit-4, 4px)" },
  remove: { width: 8, height: 8, color: token.mutedForeground },
  popup: { minWidth: "var(--anchor-width)", backgroundColor: token.background, padding: 0 },
  hidden: { display: "none" },
  check: { marginRight: 8, width: 16, height: 16 },
  unchecked: { opacity: 0 },
  sr: {
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
function useMultiSelectContext() {
  const context = use(Context)
  if (!context) throw new Error("useMultiSelectContext must be used within a MultiSelectContext")
  return context
}
export function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange,
  allowedNewItem,
  allowedSelectAll
}: {
  children: ReactNode
  values?: string[]
  defaultValues?: string[]
  onValuesChange?: (values: string[]) => void
  allowedNewItem?: boolean
  allowedSelectAll?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [internalValues, setInternalValues] = useState(() => new Set(values ?? defaultValues))
  const selectedValues = useMemo(() => (values ? new Set(values) : internalValues), [values, internalValues])
  const [items, setItems] = useState<Map<string, ReactNode>>(() => new Map())
  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((previous) => (previous.get(value) === label ? previous : new Map(previous).set(value, label)))
  }, [])
  const toggleValue = useCallback(
    (value: string) => {
      const next = new Set(selectedValues)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      setInternalValues(next)
      onValuesChange?.([...next])
    },
    [selectedValues, onValuesChange]
  )
  const addNewItem = useCallback(
    (value: string) => {
      onItemAdded(value, value)
      const next = new Set(selectedValues).add(value)
      setInternalValues(next)
      onValuesChange?.([...next])
    },
    [selectedValues, onItemAdded, onValuesChange]
  )
  const selectAll = useCallback(
    (keys: string[]) => {
      const next = new Set(keys.length > 0 && keys.every((key) => selectedValues.has(key)) ? [] : keys)
      setInternalValues(next)
      onValuesChange?.([...next])
    },
    [selectedValues, onValuesChange]
  )
  const context = useMemo(
    () => ({
      open,
      selectedValues,
      items,
      toggleValue,
      onItemAdded,
      allowedNewItem,
      allowedSelectAll,
      addNewItem,
      selectAll
    }),
    [open, selectedValues, items, toggleValue, onItemAdded, allowedNewItem, allowedSelectAll, addNewItem, selectAll]
  )
  return (
    <Context value={context}>
      <Popover open={open} onOpenChange={setOpen} modal>
        {children}
      </Popover>
    </Context>
  )
}
type ValueOf<T> = T[keyof T]
export const MultiSelectTriggerWidth = { intrinsic: "intrinsic", full: "full" } as const
export type MultiSelectTriggerWidth = ValueOf<typeof MultiSelectTriggerWidth>

/** `width="full"` fills the parent row (form field); default `intrinsic` keeps `fit-content`. */
export function MultiSelectTrigger({
  className,
  children,
  asChild = false,
  width = MultiSelectTriggerWidth.intrinsic,
  ...props
}: ComponentPropsWithoutRef<typeof Button> & {
  asChild?: boolean
  className?: string
  width?: MultiSelectTriggerWidth
}) {
  const { open } = useMultiSelectContext()
  const full = width === MultiSelectTriggerWidth.full
  if (
    asChild &&
    isValidElement<{
      role?: string
      "aria-expanded"?: boolean | "true" | "false"
      "data-width"?: string
      className?: string
    }>(children)
  )
    return (
      <PopoverTrigger
        render={cloneElement(children, {
          role: children.props.role ?? props.role ?? "combobox",
          "aria-expanded": children.props["aria-expanded"] ?? open,
          "data-width": width,
          className: [children.props.className, full && stylex.props(style.full).className, className]
            .filter(Boolean)
            .join(" ")
        })}
      />
    )
  return (
    <PopoverTrigger
      render={
        <Button
          {...props}
          data-width={width}
          multiSelectTrigger={full ? "full" : true}
          variant={props.variant ?? "outline"}
          role={props.role ?? "combobox"}
          aria-expanded={props["aria-expanded"] ?? open}
          className={className}
        />
      }>
      {children}
      <ChevronsUpDownIcon {...stylex.props(style.icon)} />
    </PopoverTrigger>
  )
}
export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  ...props
}: Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  placeholder?: string
  clickToRemove?: boolean
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff"
}) {
  const appearance = use(MultiSelectValueAppearance)
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext()
  const [overflowAmount, setOverflowAmount] = useState(0)
  const overflowRef = useRef<HTMLSpanElement>(null)
  const shouldWrap = overflowBehavior === "wrap" || (overflowBehavior === "wrap-when-open" && open)
  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      let timeout: ReturnType<typeof setTimeout> | undefined
      const check = () => {
        const overflow = overflowRef.current
        overflow?.style.setProperty("display", "none")
        const elements = node.querySelectorAll<HTMLElement>("[data-selected-item]")
        elements.forEach((child) => child.style.removeProperty("display"))
        let amount = 0
        if (!shouldWrap)
          for (let index = elements.length - 1; index >= 0; index--) {
            if (node.scrollWidth <= node.clientWidth) break
            amount = elements.length - index
            elements.item(index).style.display = "none"
            overflow?.style.removeProperty("display")
          }
        setOverflowAmount(amount)
      }
      const mutation = new MutationObserver(check)
      const resize = new ResizeObserver(() => {
        clearTimeout(timeout)
        timeout = setTimeout(check, 100)
      })
      mutation.observe(node, { childList: true, attributes: true, attributeFilter: ["class", "style"] })
      resize.observe(node)
      check()
      return () => {
        clearTimeout(timeout)
        mutation.disconnect()
        resize.disconnect()
      }
    },
    [shouldWrap]
  )
  if (selectedValues.size === 0 && placeholder) return <span {...stylex.props(style.placeholder)}>{placeholder}</span>
  return (
    <div
      {...props}
      ref={handleResize}
      className={[stylex.props(style.value, shouldWrap && style.wrap).className, className].filter(Boolean).join(" ")}>
      {[...selectedValues]
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            variant={appearance}
            data-selected-item
            key={value}
            className={stylex.props(style.badge).className}
            onClick={
              clickToRemove
                ? (event) => {
                    event.stopPropagation()
                    toggleValue(value)
                  }
                : undefined
            }>
            {items.get(value)}
            {clickToRemove && <XIcon {...stylex.props(style.remove)} />}
          </Badge>
        ))}
      <Badge
        variant="outline"
        ref={overflowRef}
        style={{ display: overflowAmount > 0 && !shouldWrap ? "block" : "none" }}>
        +{overflowAmount}
      </Badge>
    </div>
  )
}
export function MultiSelectContent({
  search = true,
  children,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof Command>, "children"> & {
  search?: boolean | { placeholder?: string; emptyMessage?: string }
  children: ReactNode
}) {
  const canSearch = typeof search === "object" || search
  const { items, allowedNewItem, addNewItem, allowedSelectAll, selectAll, selectedValues, open } =
    useMultiSelectContext()
  const [query, setQuery] = useState("")
  useEffect(() => {
    if (open) setQuery("")
  }, [open])
  const normalized = query.trim()
  const showCreate =
    canSearch &&
    allowedNewItem &&
    normalized.length > 0 &&
    ![...items.keys()].some((key) => key.toLowerCase() === normalized.toLowerCase())
  const keys = [...items.keys()].filter((key) => !normalized || key.toLowerCase().includes(normalized.toLowerCase()))
  const allSelected = keys.length > 0 && keys.every((key) => selectedValues.has(key))
  const create = () => {
    addNewItem(normalized)
    setQuery("")
  }
  return (
    <>
      <div {...stylex.props(style.hidden)}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className={stylex.props(style.popup).className}>
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={typeof search === "object" ? search.placeholder : undefined}
              onKeyDown={(event) => {
                if (event.key === "Enter" && showCreate) {
                  event.preventDefault()
                  create()
                }
              }}
            />
          ) : (
            <button type="button" aria-label="Multi-select menu" {...stylex.props(style.sr)} />
          )}
          <CommandList>
            {allowedSelectAll && (
              <CommandItem onSelect={() => selectAll(keys)}>{allSelected ? "Clear all" : "Select all"}</CommandItem>
            )}
            {canSearch && <CommandEmpty>{typeof search === "object" ? search.emptyMessage : undefined}</CommandEmpty>}
            {showCreate && <CommandItem onSelect={create}>Create "{query}"</CommandItem>}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  )
}
export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}: Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value"> & { value: string; badgeLabel?: ReactNode }) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext()
  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children)
  }, [value, children, onItemAdded, badgeLabel])
  return (
    <CommandItem
      {...props}
      onSelect={() => {
        toggleValue(value)
        onSelect?.(value)
      }}>
      <CheckIcon {...stylex.props(style.check, !selectedValues.has(value) && style.unchecked)} />
      {children}
    </CommandItem>
  )
}
export function MultiSelectGroup(props: ComponentPropsWithoutRef<typeof CommandGroup>) {
  return <CommandGroup {...props} />
}
/** Thin separator between `MultiSelectGroup` blocks. */
export function MultiSelectSeparator(props: ComponentPropsWithoutRef<typeof CommandSeparator>) {
  return <CommandSeparator {...props} />
}

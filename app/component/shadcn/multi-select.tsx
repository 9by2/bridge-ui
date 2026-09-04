"use client"

import { Badge } from "@bridge/ui/app/component/shadcn/badge"
import { Button } from "@bridge/ui/app/component/shadcn/button"
import { cn } from "cn"
import { ChevronsUpDownIcon, CheckIcon, XIcon } from "lucide-react"
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

type MultiSelectContextType = {
  open: boolean
  setOpen: (open: boolean) => void
  selectedValues: Set<string>
  toggleValue: (value: string) => void
  items: Map<string, ReactNode>
  onItemAdded: (value: string, label: ReactNode) => void
  resetItems: () => void
  allowedNewItem?: boolean | undefined
  addNewItem?: (value: string, label?: ReactNode) => void
  allowedSelectAll?: boolean | undefined
  selectAll?: (keysToSelect?: string[]) => void
  clearAll?: () => void
}
const MultiSelectContext = createContext<MultiSelectContextType | null>(null)

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
  const [internalValues, setInternalValues] = useState(() => new Set<string>(values ?? defaultValues))
  const selectedValues = useMemo(() => (values ? new Set(values) : internalValues), [values, internalValues])
  const [items, setItems] = useState<Map<string, ReactNode>>(() => new Map())

  const toggleValue = useCallback(
    (value: string) => {
      const getNewSet = (prev: Set<string>) => {
        const newSet = new Set(prev)
        if (newSet.has(value)) {
          newSet.delete(value)
        } else {
          newSet.add(value)
        }
        return newSet
      }
      setInternalValues(getNewSet)
      onValuesChange?.([...getNewSet(selectedValues)])
    },
    [onValuesChange, selectedValues]
  )

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) return prev
      return new Map(prev).set(value, label)
    })
  }, [])

  const resetItems = useCallback(() => {
    setItems(new Map())
  }, [])

  const addNewItem = useCallback(
    (value: string, label?: ReactNode) => {
      const trimmed = String(value ?? "").trim()
      if (trimmed === "") return

      const existingKey = [...items.keys()].find((key) => key.toLowerCase() === trimmed.toLowerCase())
      const addedKey = existingKey ?? trimmed
      setItems((prev) => {
        if (prev.get(addedKey) === (label ?? trimmed)) return prev
        return new Map(prev).set(addedKey, label ?? trimmed)
      })

      const getNewSet = (prev: Set<string>) => {
        const newSet = new Set(prev)
        newSet.add(addedKey)
        return newSet
      }
      setInternalValues(getNewSet)
      onValuesChange?.([...getNewSet(selectedValues)])
    },
    [items, onValuesChange, selectedValues]
  )

  const selectAll = useCallback(
    (keysToSelect?: string[]) => {
      const keys = keysToSelect ?? [...items.keys()]
      const isAllSelected = keys.length > 0 && keys.every((k) => selectedValues.has(k))
      const getNewSet = (_prev: Set<string>) => {
        const newSet = new Set<string>()
        if (!isAllSelected) {
          keys.forEach((k) => newSet.add(k))
        }
        return newSet
      }
      setInternalValues(getNewSet)
      onValuesChange?.([...getNewSet(selectedValues)])
    },
    [items, onValuesChange, selectedValues]
  )

  const clearAll = useCallback(() => {
    setInternalValues(() => new Set<string>())
    onValuesChange?.([])
  }, [onValuesChange])

  const contextValue = useMemo<MultiSelectContextType>(
    () => ({
      open,
      setOpen,
      selectedValues,
      toggleValue,
      items,
      onItemAdded,
      resetItems,
      allowedNewItem,
      addNewItem,
      allowedSelectAll,
      selectAll,
      clearAll
    }),
    [
      open,
      selectedValues,
      toggleValue,
      items,
      onItemAdded,
      resetItems,
      allowedNewItem,
      addNewItem,
      allowedSelectAll,
      selectAll,
      clearAll
    ]
  )

  return (
    <MultiSelectContext value={contextValue}>
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        {children}
      </Popover>
    </MultiSelectContext>
  )
}

export function MultiSelectTrigger({
  className,
  children,
  asChild = false,
  ...props
}: {
  className?: string
  children?: ReactNode
  asChild?: boolean
} & ComponentPropsWithoutRef<typeof Button>) {
  const { open } = useMultiSelectContext()

  if (asChild && isValidElement(children)) {
    const child = children as any
    return (
      <PopoverTrigger
        render={cloneElement(child, {
          ...child.props,
          role: child.props.role ?? props.role ?? "combobox",
          "aria-expanded": child.props["aria-expanded"] ?? open,
          className: cn(child.props.className, className)
        })}
      />
    )
  }

  return (
    <PopoverTrigger
      render={
        <Button
          {...props}
          variant={props.variant ?? "outline"}
          role={props.role ?? "combobox"}
          aria-expanded={props["aria-expanded"] ?? open}
          className={cn(
            "flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden rounded-none border border-input bg-transparent px-3 py-1.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
            className
          )}
        />
      }>
      {children}
      <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
    </PopoverTrigger>
  )
}

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  ...props
}: {
  placeholder?: string
  clickToRemove?: boolean
  overflowBehavior?: "wrap" | "wrap-when-open" | "cutoff"
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext()
  const [overflowAmount, setOverflowAmount] = useState(0)
  const valueRef = useRef<HTMLDivElement>(null)
  const overflowRef = useRef<HTMLDivElement>(null)

  const shouldWrap = overflowBehavior === "wrap" || (overflowBehavior === "wrap-when-open" && open)

  const checkOverflow = useCallback(() => {
    if (valueRef.current == null) return

    const containerElement = valueRef.current
    const overflowElement = overflowRef.current
    const selectedItemElements = containerElement.querySelectorAll<HTMLElement>("[data-selected-item]")

    if (overflowElement != null) overflowElement.style.display = "none"
    selectedItemElements.forEach((child) => child.style.removeProperty("display"))
    let amount = 0
    for (let i = selectedItemElements.length - 1; i >= 0; i--) {
      const child = selectedItemElements[i]!
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break
      }
      amount = selectedItemElements.length - i
      child.style.display = "none"
      overflowElement?.style.removeProperty("display")
    }
    setOverflowAmount(amount)
  }, [])

  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      valueRef.current = node

      const mutationObserver = new MutationObserver(checkOverflow)
      const observer = new ResizeObserver(debounce(checkOverflow, 100))

      mutationObserver.observe(node, {
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style"]
      })
      observer.observe(node)

      return () => {
        observer.disconnect()
        mutationObserver.disconnect()
        valueRef.current = null
      }
    },
    [checkOverflow]
  )

  if (selectedValues.size === 0 && placeholder) {
    return <span className="min-w-0 overflow-hidden font-normal text-muted-foreground">{placeholder}</span>
  }

  const selectedBadges: ReactNode[] = []
  for (const value of selectedValues) {
    if (!items.has(value)) continue
    selectedBadges.push(
      <Badge
        variant="outline"
        data-selected-item
        className="group flex items-center gap-1"
        key={value}
        onClick={
          clickToRemove
            ? (event: MouseEvent<HTMLElement>) => {
                event.stopPropagation()
                toggleValue(value)
              }
            : undefined
        }>
        {items.get(value)}
        {clickToRemove && <XIcon className="size-2 text-muted-foreground group-hover:text-destructive-text" />}
      </Badge>
    )
  }

  return (
    <div
      {...props}
      ref={handleResize}
      className={cn("flex w-full gap-1.5 overflow-hidden", shouldWrap && "h-full flex-wrap", className)}>
      {selectedBadges}
      <Badge
        style={{
          display: overflowAmount > 0 && !shouldWrap ? "block" : "none"
        }}
        variant="outline"
        ref={overflowRef}>
        +{overflowAmount}
      </Badge>
    </div>
  )
}

export function MultiSelectContent({
  search = true,
  children,
  ...props
}: {
  search?: boolean | { placeholder?: string; emptyMessage?: string }
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<typeof Command>, "children">) {
  const canSearch = typeof search === "object" ? true : search
  const { items, resetItems, allowedNewItem, addNewItem, allowedSelectAll, selectAll, selectedValues, open } =
    useMultiSelectContext()
  const [query, setQuery] = useState("")

  useEffect(() => {
    if (open) {
      resetItems()
      setQuery("")
    }
  }, [open, resetItems])

  const normalizedQuery = query.trim()
  const hasMatch =
    normalizedQuery.length > 0 && [...items.keys()].some((k) => k.toLowerCase() === normalizedQuery.toLowerCase())
  const showCreate = canSearch && !!allowedNewItem && normalizedQuery.length > 0 && !hasMatch

  const allKeys = [...items.keys()]
  const filteredKeys = normalizedQuery
    ? allKeys.filter((k) => k.toLowerCase().includes(normalizedQuery.toLowerCase()))
    : allKeys
  const isAllSelected = filteredKeys.length > 0 && filteredKeys.every((k) => selectedValues.has(k))

  const handleSelectAll = () => {
    selectAll?.(filteredKeys)
  }

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className="min-w-(--anchor-width) p-0">
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={typeof search === "object" ? search.placeholder : undefined}
              onKeyDown={(e: any) => {
                if (e.key === "Enter" && showCreate) {
                  e.preventDefault()
                  addNewItem?.(normalizedQuery, normalizedQuery)
                  setQuery("")
                }
              }}
            />
          ) : (
            <button type="button" aria-label="Multi-select menu" className="sr-only" />
          )}
          <CommandList>
            {allowedSelectAll && (
              <CommandItem onSelect={handleSelectAll}>{isAllSelected ? "Clear all" : "Select all"}</CommandItem>
            )}
            {canSearch && <CommandEmpty>{typeof search === "object" ? search.emptyMessage : undefined}</CommandEmpty>}
            {showCreate && (
              <CommandItem
                onSelect={() => {
                  addNewItem?.(normalizedQuery, normalizedQuery)
                  setQuery("")
                }}>
                Create "{query}"
              </CommandItem>
            )}
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
}: {
  badgeLabel?: ReactNode
  value: string
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext()
  const isSelected = selectedValues.has(value)

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
      <CheckIcon className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")} />
      {children}
    </CommandItem>
  )
}

export function MultiSelectGroup(props: ComponentPropsWithoutRef<typeof CommandGroup>) {
  return <CommandGroup {...props} />
}

function useMultiSelectContext() {
  const context = use(MultiSelectContext)
  if (context == null) {
    throw new Error("useMultiSelectContext must be used within a MultiSelectContext")
  }
  return context
}

function debounce<T extends (...args: never[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

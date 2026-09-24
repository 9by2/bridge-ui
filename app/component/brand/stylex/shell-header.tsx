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

import { token } from "./token.stylex"

const style = stylex.create({
  root: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    boxSizing: "border-box",
    display: "flex",
    width: "100%",
    minWidth: 0,
    height: 64,
    flexShrink: 0,
    alignItems: "center",
    gap: 12,
    paddingInline: { default: 24, "@media (max-width: 640px)": 16 },
    backgroundColor: token.background,
    borderBottomColor: token.border,
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    color: token.foreground
  },
  title: {
    minWidth: 0,
    flex: 1,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-2xl, 1.25em)",
    lineHeight: "28px",
    fontWeight: 600,
    color: token.foreground
  },
  action: {
    display: "flex",
    minWidth: 0,
    maxWidth: "50%",
    flex: "0 1 auto",
    alignItems: "center",
    gap: 8,
    marginInlineStart: "auto"
  }
})

export function ShellHeader({ className, ...props }: ComponentProps<"header">) {
  return (
    <header
      data-slot="shell-header"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function ShellHeaderTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="shell-header-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}

export function ShellHeaderAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="shell-header-action"
      {...props}
      className={[stylex.props(style.action).className, className].filter(Boolean).join(" ")}
    />
  )
}

type ShellHeaderActionEntry = { id: string; node: ReactNode }
type ShellHeaderActionControl = { set: (id: string, node: ReactNode) => void; clear: (id: string) => void }
// State and stable control are split so publishers never re-subscribe when the action changes.
const ShellHeaderActionState = createContext<readonly ShellHeaderActionEntry[] | null>(null)
const ShellHeaderActionControlContext = createContext<ShellHeaderActionControl | null>(null)

/** Owns the injected header action. Mount once around the shell and its routes. */
export function ShellHeaderActionProvider({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<readonly ShellHeaderActionEntry[]>([])
  const control = useMemo<ShellHeaderActionControl>(
    () => ({
      set: (id, node) =>
        setEntry((current) =>
          current.some((item) => item.id === id)
            ? current.map((item) => (item.id === id ? { id, node } : item))
            : [...current, { id, node }]
        ),
      clear: (id) => setEntry((current) => current.filter((item) => item.id !== id))
    }),
    []
  )
  return (
    <ShellHeaderActionControlContext value={control}>
      <ShellHeaderActionState value={entry}>{children}</ShellHeaderActionState>
    </ShellHeaderActionControlContext>
  )
}

/**
 * Publish `node` as the shell header action while the calling component is mounted.
 * The most recently mounted publisher wins; unmount clears it. No-op outside a provider.
 */
export function useShellHeaderAction(node: ReactNode) {
  const control = useContext(ShellHeaderActionControlContext)
  const id = useId()
  useEffect(() => {
    control?.set(id, node)
  }, [control, id, node])
  useEffect(() => () => control?.clear(id), [control, id])
}

/** Renders the injected action inside `ShellHeaderAction`; renders nothing when empty. */
export function ShellHeaderActionSlot(props: ComponentProps<"div">) {
  const entry = useContext(ShellHeaderActionState)
  const node = entry?.at(-1)?.node
  if (node === undefined || node === null) return null
  return <ShellHeaderAction {...props}>{node}</ShellHeaderAction>
}

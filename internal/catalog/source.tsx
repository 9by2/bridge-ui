import { useState } from "react"

export function Source({ load, label = "View code" }: { load: () => Promise<string>; label?: string }) {
  const [source, setSource] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  return (
    <details
      className="code-panel"
      onToggle={(event) => {
        const expanded = event.currentTarget.open
        setOpen(expanded)
        if (expanded && source === null)
          void load()
            .then(setSource)
            .catch(() => setSource("Source unavailable."))
      }}>
      <summary>{label}</summary>
      {open && (
        <>
          <div className="code-header">
            <span>Exact preview source</span>
            <button
              disabled={source === null}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(source ?? "")
                  setCopied(true)
                } catch {
                  setCopied(false)
                }
              }}>
              {copied ? "Copied" : "Copy code"}
            </button>
          </div>
          <pre tabIndex={0}>
            <code>{source ?? "Loading source..."}</code>
          </pre>
        </>
      )}
    </details>
  )
}

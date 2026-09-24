import * as UI from "@bridge/ui"

const example = [
  { size: UI.SpinnerSize.sm, label: "Small" },
  { size: UI.SpinnerSize.default, label: "Default" },
  { size: UI.SpinnerSize.lg, label: "Large" }
] as const

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {example.map((item) => (
        <div key={item.size} className="flex items-center gap-2 text-sm">
          <UI.Spinner size={item.size} aria-label={`${item.label} loading`} />
          <span>{item.label}</span>
        </div>
      ))}
      <UI.Button disabled>
        <UI.Spinner size={UI.SpinnerSize.sm} aria-label="Saving" />
        Saving
      </UI.Button>
    </div>
  )
}

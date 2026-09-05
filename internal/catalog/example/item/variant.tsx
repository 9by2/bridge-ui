import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="w-full max-w-lg space-y-6">
      {(["default", "outline", "muted"] as const).map((variant) => (
        <section key={variant} className="space-y-2">
          <h3 className="text-sm font-semibold capitalize">{variant}</h3>
          <UI.Item variant={variant}>
            <UI.ItemContent>
              <UI.ItemTitle>Design review</UI.ItemTitle>
              <UI.ItemDescription>Review the latest draft and leave feedback.</UI.ItemDescription>
            </UI.ItemContent>
            <UI.ItemActions>
              <UI.Button variant="outline" size="sm">
                Open
              </UI.Button>
            </UI.ItemActions>
          </UI.Item>
        </section>
      ))}
    </div>
  )
}

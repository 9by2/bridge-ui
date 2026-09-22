import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <section className="w-full max-w-md space-y-2">
      <p className="text-sm text-muted-foreground">line variant with chevron trigger</p>
      <UI.Collapsible variant="line">
        <UI.CollapsibleTrigger showChevron>Details</UI.CollapsibleTrigger>
        <UI.CollapsibleContent>Shared details</UI.CollapsibleContent>
      </UI.Collapsible>
    </section>
  )
}

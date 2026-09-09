import { Collapsible as Primitive } from "@base-ui/react/collapsible"

export function Collapsible(props: Primitive.Root.Props) {
  return <Primitive.Root data-slot="collapsible" {...props} />
}
export function CollapsibleTrigger(props: Primitive.Trigger.Props) {
  return <Primitive.Trigger data-slot="collapsible-trigger" {...props} />
}
export function CollapsibleContent(props: Primitive.Panel.Props) {
  return <Primitive.Panel data-slot="collapsible-content" {...props} />
}

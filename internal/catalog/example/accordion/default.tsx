import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Accordion defaultValue={["item"]}>
      <UI.AccordionItem value="item">
        <UI.AccordionTrigger>Can I reuse this?</UI.AccordionTrigger>
        <UI.AccordionContent>Yes, across company applications.</UI.AccordionContent>
      </UI.AccordionItem>
    </UI.Accordion>
  )
}

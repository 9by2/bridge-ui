import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ProductItem>
      <strong>Caller product</strong>
      <UI.QuantityStepper
        value={2}
        min={1}
        max={3}
        decrementLabel="Decrease quantity"
        incrementLabel="Increase quantity"
        onValueChange={() => {}}
      />
    </UI.ProductItem>
  )
}

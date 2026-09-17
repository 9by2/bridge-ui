import { useState } from "react"

import * as UI from "@bridge/ui"

export default function Example() {
  const [value, setValue] = useState(2)
  return (
    <UI.ProductItem>
      <strong>Caller product</strong>
      <UI.QuantityStepper
        value={value}
        min={1}
        max={3}
        decrementLabel="Decrease quantity"
        incrementLabel="Increase quantity"
        onValueChange={setValue}
      />
    </UI.ProductItem>
  )
}

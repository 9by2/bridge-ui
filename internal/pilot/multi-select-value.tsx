import type { ComponentProps } from "react"

import { MultiSelectValue as Value, MultiSelectValueAppearance } from "./multi-select"

export function MultiSelectValue(props: ComponentProps<typeof Value>) {
  return (
    <MultiSelectValueAppearance value="default">
      <Value {...props} />
    </MultiSelectValueAppearance>
  )
}

import { BackstageConsole } from "@catalog-prototype/backstage/index"

import * as UI from "@bridge/ui"

// Bridge studio Backstage Console: every public component family composed into one multi-page prototype with
// package defaults. Use the sidebar or ⌘K to switch page.
export default function Example() {
  return (
    <UI.Theme>
      <BackstageConsole />
    </UI.Theme>
  )
}

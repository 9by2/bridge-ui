import { AdminConsole } from "@catalog-prototype/admin/index"

import * as UI from "@bridge/ui"

// Generic SaaS Admin Console: every public component family composed into one multi-page prototype with package
// defaults. Use the sidebar or ⌘K to switch page.
export default function Example() {
  return (
    <UI.Theme>
      <AdminConsole />
    </UI.Theme>
  )
}

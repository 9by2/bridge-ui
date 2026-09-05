import { toast } from "sonner"

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-3">
      <UI.SonnerToaster />
      <UI.Button
        variant="outline"
        onClick={() => toast("Notification", { description: "Your change is ready to review." })}>
        Default
      </UI.Button>
      <UI.Button variant="outline" onClick={() => toast.success("Change saved")}>
        Success
      </UI.Button>
      <UI.Button variant="outline" onClick={() => toast.error("Unable to save")}>
        Error
      </UI.Button>
      <UI.Button variant="outline" onClick={() => toast.warning("Storage nearly full")}>
        Warning
      </UI.Button>
      <UI.Button variant="outline" onClick={() => toast.info("New update available")}>
        Info
      </UI.Button>
      <UI.Button
        variant="outline"
        onClick={() =>
          toast("Item archived", { action: { label: "Undo", onClick: () => toast.success("Item restored") } })
        }>
        Action
      </UI.Button>
      <UI.Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1200)), {
            loading: "Saving change...",
            success: "Change saved",
            error: "Unable to save"
          })
        }>
        Promise
      </UI.Button>
    </div>
  )
}

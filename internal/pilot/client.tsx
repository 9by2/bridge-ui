import { hydrateRoot } from "react-dom/client"

import { Fixture } from "./fixture"

const root = document.getElementById("root")
if (!root) throw new Error("Missing fixture root")
hydrateRoot(root, <Fixture mode={document.documentElement.dataset.theme === "dark" ? "dark" : "light"} />, {
  onRecoverableError(error) {
    console.error("Hydration failure", error)
  }
})
document.documentElement.dataset.hydrated = "true"

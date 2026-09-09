import { createRoot } from "react-dom/client"

import { Comparison } from "./comparison"

const root = document.getElementById("root")
if (!root) throw new Error("Missing comparison root")
const query = new URLSearchParams(location.search)
createRoot(root).render(
  <Comparison candidate={query.get("candidate") === "true"} mode={query.get("theme") === "dark" ? "dark" : "light"} />
)

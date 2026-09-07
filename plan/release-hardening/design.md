# Design

Exercise the packed package in isolated Bun/Vite fixture. Measure repeated preview navigation against a collected baseline rather than a single heap sample. Test direct public entry and root import with bundler graph evidence, not only output string search.

```tsx
import { Button } from "@bridge/ui/button"
```

Keep generated source updates CLI-owned; upstream accessibility defect needs a reproducible case and compatible upstream fix. StyleX extraction follows this phase, then registry prerelease validation; migration waits for every foundation gate.

Installed verification expands each export wildcard from packed declaration output, typechecks all 71 public entry with `skipLibCheck: false`, and imports each JavaScript entry in Bun. Build rewrites source alias in emitted declaration to relative package-local import without touching generated source.

Chromium lifecycle regression navigates Button -> TsChart Sankey -> Button eight times using hash navigation without document reload. Cycle three is the warm baseline. Each later post-GC sample allows less than 2 MB heap growth, at most two extra documents and fewer than 500 extra DOM nodes. This is a retained-resource regression budget, not total-process memory proof. Three isolated repeat runs passed before adding the check to the full suite.

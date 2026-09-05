# Design

Private Preview owns iframe lifecycle. Private Source owns on-demand source loading. Public package builds split ESM entry with component subpath for direct import. Verify Button-only bundle excludes chart dependency.

```tsx
import { Button } from "@bridge/ui/button"
```

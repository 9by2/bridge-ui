# Design

Compile package-owned StyleX through the same compiler in catalog and package build. Keep generated Tailwind source CLI-owned during the transition. Publish precompiled JavaScript and one CSS entry; consumer requires no StyleX transform.

```tsx
import { DropArea } from "@bridge/ui/drop-area"
import "@bridge/ui/style.css"
```

Resolve registry project from the authenticated GitLab API. Publish only a uniquely versioned prerelease to a non-latest tag after local verification, then install into an isolated fixture. Never persist credential in repository or log.

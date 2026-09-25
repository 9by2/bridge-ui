---
"@bridge/ui": patch
---

Stop text sizes compounding inside containers and bound SwimLaneBoard lane width.

- New root-relative `--bridge-text-size-{xs,sm,md,base,lg}` tokens. `Body` (1rem), `Large`, `Muted`, `Small`, `Badge`, `StatusStamp`, `DetailItemLabel`, TimelineStep description/time, and WizardStep description/counter use them, so nested text never drops below 12px.
- `SwimLaneBoardItem` uses the 0.875rem body size instead of `0.75em`; nested children keep their own size. Count badges and the corner label render at 12px.
- `SwimLaneBoard` adds `columnMinWidth` / `columnMaxWidth` (default `min(18rem, 82vw)` / `20rem`). Expanded lanes no longer stretch to fill the board.

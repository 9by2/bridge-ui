# Design: Nested Text Size

## Overview

A second token family, `--bridge-text-size-*`, is rem-based and declared next to the em font-size scale in `component.css`. Text-role components read it through `var(--bridge-text-size-sm, 0.75rem)`, so their size does not depend on the container they sit in. Headings keep the em scale.

## Components

| Component                                                                                  | Token                              |
| ------------------------------------------------------------------------------------------ | ---------------------------------- |
| Small, Badge, StatusStamp, TimelineStepTime, WizardStepCounter, SwimLaneBoard badge/corner | `--bridge-text-size-sm` 0.75rem    |
| WizardStepDescription                                                                      | `--bridge-text-size-md` 0.8125rem  |
| Muted, TimelineStepDescription, DetailItemLabel, SwimLaneBoardItem                         | `--bridge-text-size-base` 0.875rem |
| Large, Body                                                                                | `--bridge-text-size-lg` 1rem       |

## Example Code

```tsx
<SwimLaneBoard label="Board" columnMinWidth="16rem" columnMaxWidth={320}>
  ...
</SwimLaneBoard>
// expanded track: minmax(min(18rem, 82vw), 20rem)
```

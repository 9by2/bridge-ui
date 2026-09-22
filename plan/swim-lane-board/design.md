# Design: Swim Lane Board

## Overview

`SwimLaneBoard` derives its coordinate matrix from compound `Column`, `Lane`, `Cell`, and `Item` children. It owns only UI state and emits move intentions. StyleX uses Bridge semantic tokens so `Theme` supplies dark/light behavior.

## Components

| Component             | Responsibility                             | Location                                         |
| --------------------- | ------------------------------------------ | ------------------------------------------------ |
| `SwimLaneBoard`       | Coordinates collapse state and move intent | `app/component/brand/stylex/swim-lane-board.tsx` |
| `SwimLaneBoardColumn` | Status metadata and collapse control       | `app/component/brand/stylex/swim-lane-board.tsx` |
| `SwimLaneBoardLane`   | Optional row grouping and collapse control | `app/component/brand/stylex/swim-lane-board.tsx` |
| `SwimLaneBoardCell`   | Coordinate-specific item collection        | `app/component/brand/stylex/swim-lane-board.tsx` |
| `SwimLaneBoardItem`   | Draggable caller content and item identity | `app/component/brand/stylex/swim-lane-board.tsx` |

## Example Code

```tsx
<SwimLaneBoard label="CRM pipeline" onItemMove={saveMove}>
  <SwimLaneBoardColumn id="new" label="New" count={3} />
  <SwimLaneBoardColumn id="won" label="Won" count={0} />
  <SwimLaneBoardLane id="enterprise" label="Enterprise" count={3}>
    <SwimLaneBoardCell columnId="new">
      <SwimLaneBoardItem id="deal-1">Acme</SwimLaneBoardItem>
    </SwimLaneBoardCell>
  </SwimLaneBoardLane>
</SwimLaneBoard>
```

## Risks & Mitigations

| Risk                            | Mitigation                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------- |
| CSS grid reflows after collapse | Each lane is an isolated row grid; compact columns use stable coordinate columns. |
| Theme divergence                | Use `token` semantic colors exclusively; browser catalog covers light/dark.       |

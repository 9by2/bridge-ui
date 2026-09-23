# Design: React Doctor Kanban Correctness

## Overview

Call context and render hooks once per column or item render. Choose overlay props and provider values after hooks run. Synchronize event callback refs after commit so discarded renders cannot update drag handlers.

## Components

| Component                 | Responsibility                            | Location                                |
| ------------------------- | ----------------------------------------- | --------------------------------------- |
| Kanban                    | Drag callbacks and latest committed props | `app/component/brand/stylex/kanban.tsx` |
| KanbanColumn / KanbanItem | Overlay and sortable rendering            | `app/component/brand/stylex/kanban.tsx` |

## Example Code

```tsx
const context = useContext(KanbanContext)
const node = useRender({ defaultTagName: "div", render, props: mergeProps(defaultProps, props) })
return <ItemContext.Provider value={itemContext}>{node}</ItemContext.Provider>
```

## Risks & Mitigations

| Risk                         | Mitigation                                  |
| ---------------------------- | ------------------------------------------- |
| Overlay loses drag semantics | Run existing Kanban drag and overlay tests. |

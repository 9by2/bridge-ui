# Design: Catalog Consumer Parity

## Overview

Make the catalog cascade identical to a consumer, move every component-owned style out of examples into package defaults or explicit variants, and prove parity against an independent fixture built from `dist/`.

## Components

| Component        | Responsibility                                 | Location                                        |
| ---------------- | ---------------------------------------------- | ----------------------------------------------- |
| Catalog cascade  | Consumer layer order                           | `internal/catalog/index.html`                   |
| Static guard     | Forbid component-styling className in examples | `test/internal/catalog-consumer-parity.test.ts` |
| Consumer fixture | Same JSX, dist package, consumer CSS           | `test/fixture/consumer-parity/`                 |
| Browser parity   | Catalog vs fixture computed styles             | `test/browser/consumer-parity.test.ts`          |

## Example Code

```tsx
// Consumer and example write the same thing; no padding classes.
<SidebarHeader>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg">…</SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarHeader>
```

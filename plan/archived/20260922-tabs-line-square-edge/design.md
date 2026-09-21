# Design: Tabs Line Square Edge

## Overview

The line variant already selects transparent active backgrounds and a bottom underline. Its trigger relation needs an explicit zero-radius override to prevent the default rounded style leaking into the horizontal line presentation.

## Components

| Component             | Responsibility                   | Location                              |
| --------------------- | -------------------------------- | ------------------------------------- |
| Tabs trigger relation | Applies the line-specific radius | `app/component/brand/stylex/tabs.tsx` |
| Browser contract      | Reads computed trigger radius    | `test/browser/tab-line.test.ts`       |

## Example Code

```tsx
<TabsList variant="line">
  <TabsTrigger value="assets">Assets</TabsTrigger>
</TabsList>
```

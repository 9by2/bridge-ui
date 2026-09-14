# Design: Tabs Line Cleanup

## Overview

The trigger base has no border. The `line` ancestor relation adds only bottom-border width and applies primary color to the active text and underline. Direct SVG children use a fixed 16px square.

## Example

```tsx
<TabsList variant="line">
  <TabsTrigger value="todo">
    <Circle /> Todo
  </TabsTrigger>
</TabsList>
```

# Design: Sidebar Toggle Variant

The side/variant example sets `collapsible="icon"`. Browser coverage toggles the trigger and waits for the 200ms width transition before measuring the icon rail, inset surface, side placement, and overflow.

```tsx
<Sidebar side={side} variant={variant} collapsible="icon" />
```

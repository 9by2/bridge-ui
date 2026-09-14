# Design: Sidebar Example

Each example is isolated by the existing catalog preview frame. This allows one fixed-position Sidebar per document and avoids collisions between configuration samples.

The examples use the same complete shell structure:

```tsx
<SidebarProvider>
  <Sidebar side={side} variant={variant} collapsible={collapsible}>
    ...
  </Sidebar>
  <SidebarInset>...</SidebarInset>
</SidebarProvider>
```

Collapse examples start expanded and expose `SidebarTrigger` so the actual transition can be inspected. Side/variant examples remain expanded to make placement and surface treatment immediately visible.

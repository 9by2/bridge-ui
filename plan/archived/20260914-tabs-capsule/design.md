# Design: Tabs Capsule

## Overview

The capsule list is transparent and content-width. Its trigger is borderless with a fully rounded radius, 10px inline padding, and 4px block padding. Only the active trigger uses the existing active-tab background token.

## Example

```tsx
<TabsList variant="capsule">
  <TabsTrigger value="one">One</TabsTrigger>
  <TabsTrigger value="two">Two</TabsTrigger>
</TabsList>
```

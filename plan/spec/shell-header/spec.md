# Spec: Shell Header

**Spec ID:** `shell-header`
**Proposal:** `shell-header`
**Status:** accepted

## Summary

Defines a compact, token-aware, sticky application shell header and the SidebarInset flex sizing required for correct composition beside a collapsible desktop sidebar.

## Requirements

### REQ-001 Public primitive

`ShellHeader` is a semantic `header` with `data-slot="shell-header"`, border-box sizing, 100% width, zero minimum width, horizontal flex alignment, 64px compact height, responsive padding, sticky top positioning, background and border token styling, suitable stacking, and no flex shrink.

**Acceptance:**

- [x] Public component and computed-style tests verify the contract.

### REQ-002 Title and action

`ShellHeaderTitle` is a compact semantic heading with `data-slot="shell-header-title"`, 18-20px semibold typography, zero minimum width, and safe long-title truncation. `ShellHeaderAction` has `data-slot="shell-header-action"`, automatic inline-start margin, centered compact flex layout, and safe shrinking.

**Acceptance:**

- [x] Title-only, optional action, long-title, and narrow viewport compositions pass.

### REQ-003 SidebarInset sizing

`SidebarInset` keeps its API and includes `position: relative`, `display: flex`, `width: 100%`, `minWidth: 0`, `flex: 1`, column direction, and the background token.

**Acceptance:**

- [x] Expanded and collapsed widths track sidebar gap state.
- [x] Wide descendants do not cause document-level horizontal overflow.

### REQ-004 Sticky and theme behavior

The header remains at viewport top while inset content scrolls and uses package tokens in light and dark themes.

**Acceptance:**

- [x] Browser verification passes for sticky position and both themes.

### REQ-005 Public package path

The package exports the primitive at `@bridge/ui/component/brand/stylex/shell-header` and from the root barrel.

**Acceptance:**

- [x] Packed install, declaration, dynamic import, client build, and SSR build pass.

### REQ-006 Avatar invariant

Avatar root, image, fallback, and root `::after` border remain fully circular at every public size, including when the package square-corner compatibility reset is active.

**Acceptance:**

- [x] Browser computed style reports a full radius for small, default, and large Avatar.

## Schema / API

```tsx
export function ShellHeader(props: ComponentProps<"header">): ReactNode
export function ShellHeaderTitle(props: ComponentProps<"h1">): ReactNode
export function ShellHeaderAction(props: ComponentProps<"div">): ReactNode
```

## Examples

### Application shell

```tsx
<SidebarProvider>
  <Sidebar>{navigation}</Sidebar>
  <SidebarInset>
    <ShellHeader>
      <SidebarTrigger aria-label="Toggle navigation" />
      <ShellHeaderTitle>User</ShellHeaderTitle>
      <ShellHeaderAction>{action}</ShellHeaderAction>
    </ShellHeader>
    <Page>
      <PageContent>{content}</PageContent>
    </Page>
  </SidebarInset>
</SidebarProvider>
```

## Non-Goals

- Replacing or resizing `PageHeader`.
- Owning route state, navigation, copy, or authorization.
- Adding application-specific variants.

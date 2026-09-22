# Spec: Settings Composition

**Spec ID:** `settings-composition`
**Proposal:** `settings-composition`
**Status:** accepted

## Summary

Defines an accessible presentation composition for settings navigation and content. It deliberately accepts caller-owned selected state and setting rows.

## Requirements

### REQ-001: Responsive navigation

`Settings` SHALL lay out its sidebar and content side-by-side from 768px. Below 768px, `SettingsSidebar` SHALL expose its supplied navigation through a labelled dialog trigger.

**Acceptance:**

- [ ] Desktop navigation has a `navigation` landmark.
- [ ] Small-layout navigation is reachable through a button named by the supplied title.

### REQ-002: Navigation activation

`SettingsNavItem` SHALL expose a native button and `isActive` as `aria-current="page"`. Selecting an item in the small-layout picker SHALL close that picker after invoking the caller handler unless the handler prevents its default action.

**Acceptance:**

- [ ] Button handlers remain caller-owned.
- [ ] The picker closes after selecting a navigation item.
- [ ] Preventing selection leaves the picker open.

### REQ-003: Open setting content

`SettingsContent` SHALL provide a `main` landmark and keep children unconstrained so it composes with `SettingItem` and consumer-owned controls.

**Acceptance:**

- [ ] Existing setting composition children render unchanged.

### REQ-004: Optional sidebar identity header

`SettingsSidebarHeader` SHALL accept open caller content, including an avatar and supporting account detail, and render it before the navigation items in desktop and compact dialog layouts.

**Acceptance:**

- [ ] Header content renders before the navigation group.
- [ ] The compact picker retains header content.

### REQ-005: Action composition examples

The catalog SHALL demonstrate `SettingItemAction` with a dialog-backed configuration control and an inline editable setting value.

**Acceptance:**

- [ ] The configuration action opens an accessible dialog.
- [ ] The inline action edits and saves a caller-owned value.
- [ ] The inline action can select a caller-owned value from a dropdown.
- [ ] A destructive action requires alert-dialog confirmation.
- [ ] The time-zone configuration dialog provides searchable command results.

## Schema / API

```tsx
export function Settings(props: ComponentProps<"div">): React.JSX.Element
export function SettingsSidebar(props: ComponentProps<"nav"> & { title: string }): React.JSX.Element
export function SettingsSidebarHeader(props: ComponentProps<"header">): React.JSX.Element
export function SettingsNavItem(props: ComponentProps<"button"> & { isActive?: boolean }): React.JSX.Element
export function SettingsContent(props: ComponentProps<"main">): React.JSX.Element
```

## Non-Goals

- Routing, i18n, or selection state ownership.

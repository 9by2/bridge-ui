# Spec: Breadcrumb Separator Gallery

**Spec ID:** `breadcrumb-separator-gallery`
**Proposal:** `breadcrumb-separator-gallery`
**Status:** accepted

## Summary

The Breadcrumb catalog demonstrates multiple supported forms of caller-provided separator content.

## Requirements

### REQ-001: Separator gallery

The catalog contains a named Breadcrumb example that displays the default separator and multiple custom separators.

**Acceptance:**

- [ ] The gallery includes text, symbol, and icon child content.
- [ ] The default ChevronRight separator remains represented.

### REQ-002: Render contract

`BreadcrumbSeparator` renders both text and element children.

**Acceptance:**

- [ ] A custom textual separator renders.
- [ ] A custom element separator renders.

## Non-Goals

- Restricting separator child content to a fixed variant set.
- Automatic separator generation.

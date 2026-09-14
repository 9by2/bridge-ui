# Proposal: Sidebar Example

## Problem

The Sidebar collapsible and side/variant catalog entries either label configuration names or render clipped fragments. They do not show how each configuration behaves in a complete application shell.

## Scope

- Render each collapsible mode in an isolated full Sidebar shell.
- Render each side and variant combination in an isolated full Sidebar shell.
- Verify configuration and shell geometry in the browser.

## Out Of Scope

- Sidebar public API changes.
- Sidebar spacing, indentation, or collapse behavior changes.

## Success

- Every documented configuration has a dedicated catalog example.
- Every example includes Sidebar, SidebarInset, navigation, trigger, and content.
- Browser checks confirm the requested configuration renders without horizontal overflow.

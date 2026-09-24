# Spec: Shell Header Action

**Spec ID:** `shell-header-action`
**Proposal:** `consumer-gap-close`
**Status:** accepted
**Amends:** [shell-header](../../../spec/shell-header/spec.md)

## Summary

Descendant routes inject header actions into the shell without prop drilling: `ShellHeaderActionProvider`, `useShellHeaderAction()` and `ShellHeaderActionSlot`.

## Requirements

### REQ-001: Set, render, clear

`useShellHeaderAction(node)` publishes `node` while the calling component is mounted; `ShellHeaderActionSlot` renders the latest published node inside a `ShellHeaderAction` container and renders nothing when empty. Unmount clears it. Outside a provider the hook is a no-op.

**Acceptance:**

- [x] A child sets the action, the slot renders it, it updates when the node changes, and it clears on unmount.
- [x] The slot renders nothing without an action.

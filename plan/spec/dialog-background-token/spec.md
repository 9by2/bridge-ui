# Spec: Dialog Background Token

**Spec ID:** `dialog-background-token`
**Proposal:** `dialog-background-token`
**Status:** accepted

## Summary

Defines independent semantic background and foreground colors for Dialog.

## Requirements

### REQ-001: Dialog color pair

`BridgeThemeOverride.color` SHALL accept `dialog` and `dialogForeground`. Dialog popup SHALL use these values when supplied and SHALL otherwise fall back to the surface color pair.

**Acceptance:**

- [x] A scoped Theme passes both Dialog color variables into the Dialog portal.
- [x] An uncustomized Dialog retains the surface pair.

## Non-Goals

- AlertDialog-specific tokens.

# Spec: Dialog Density Padding

**Spec ID:** `dialog-density-padding`
**Proposal:** `dialog-density-padding`
**Status:** accepted

## Summary

Defines density-consistent padding for the owned Dialog content and footer.

## Requirements

### REQ-001: Shared surface inset

`DialogContent` and `DialogFooter` SHALL derive their shared horizontal and bottom geometry from `--bridge-surface-padding`.

**Acceptance:**

- [x] Compact, default, and comfortable Theme density render the footer flush with the dialog edge while retaining the selected surface inset.

## Non-Goals

- New Dialog props.
- AlertDialog changes.

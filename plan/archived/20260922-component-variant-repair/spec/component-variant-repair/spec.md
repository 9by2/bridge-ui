# Spec: Component Variant Repair

**Spec ID:** `component-variant-repair`
**Proposal:** `component-variant-repair`
**Status:** draft

## Requirements

### REQ-001: Visible variant catalog

The Collapsible catalog example identifies the `line` variant in visible supporting copy.

### REQ-002: Responsive ImageCrop

ImageCrop loads ReactCrop's required CSS in package and catalog contexts without overriding media dimensions. Crop overlays and selection geometry use the same aspect-preserving measured box.

### REQ-003: Full-width Table frame

The frame variant has width, minimum width, and flex shrink behavior that keeps it full-width in normal and flex containers.

### REQ-004: Calendar date distinction

Range middle dates form a continuous horizontal track with the same height as centered endpoint controls and half-tracks behind endpoints. Today uses a strong inset ring that does not shift its centered label. Selected dates retain semantic fill and contrast.

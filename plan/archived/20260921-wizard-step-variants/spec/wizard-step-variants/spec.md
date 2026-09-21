# Spec: Wizard Step Variants

**Spec ID:** `wizard-step-variants`
**Proposal:** `wizard-step-variants`
**Status:** accepted

## Summary

WizardStep supports coordinated labeled tracker and segmented bar presentations using its existing compound slots and state model.

## Requirements

### REQ-001: Number tracker

In horizontal orientation, `variant="number"` centers each numbered indicator over its label and places the connector on the indicator centerline.

**Acceptance:**

- [x] The root, item, indicator, and connector retain their documented data attributes.
- [x] Existing completed and error indicator icons remain intact.

### REQ-002: Segmented line

`variant="line"` renders each indicator as a full-width rounded progress segment above its label, and hides inter-item connectors.

**Acceptance:**

- [x] A line indicator never exposes number or icon content.
- [x] Its state controls active, completed, error, and upcoming segment styling.

## Schema / API

```ts
type WizardStepVariant = "number" | "dot" | "line"
```

## Non-Goals

- Interactive navigation or wizard business state.

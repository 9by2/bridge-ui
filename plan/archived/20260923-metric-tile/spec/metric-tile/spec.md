# Spec: Metric tile

**Spec ID:** `metric-tile`
**Proposal:** `metric-tile`
**Status:** accepted

`MetricTile` accepts required `variants: "standard" | "featured" | "compact"`, required `label` and `value` React nodes, optional `description` and decorative `icon` nodes, and optional `loading`. The card is noninteractive. Loading requires a caller-supplied `loadingLabel` and exposes a status instead of a misleading zero. Consumers pass localized copy and formatted values. Every variant appears by name in the catalog and customization documentation. Layout and responsive grid remain consumer-owned.

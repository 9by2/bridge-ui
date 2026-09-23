# Spec: Brand Color Variable

**Spec ID:** `brand-color-variable`
**Proposal:** `brand-color-variable`
**Status:** accepted

## Requirements

Brand color usages in owned recipes resolve `--bridge-color-brand`, `--bridge-color-brand-foreground`, `--bridge-color-brand-text`, `--bridge-color-brand-accent`, and `--bridge-color-brand-accent-foreground` before their existing mode-specific StyleX defaults. The public names survive static CSS extraction. A host may apply an override to the Theme root or a descendant; it must supply legible contrast pairs.

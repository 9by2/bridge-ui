# Decisions: Compact Page Spacing

| ID      | Title                                             | Status   |
| ------- | ------------------------------------------------- | -------- |
| DEC-001 | Keep default page spacing unchanged               | accepted |
| DEC-002 | Provide compact, comfortable, and default density | accepted |
| DEC-003 | Require opt-in dynamic padding                    | accepted |

---

### DEC-001: Keep default page spacing unchanged

**GIVEN** consumers rely on the current responsive page gutters

**WHEN** compact layout is needed

**THEN** expose it as the opt-in `spacing="compact"` variant with 16px padding.

---

### DEC-002: Provide compact, comfortable, and default density

**GIVEN** page layouts need a density between 16px compact spacing and wide default desktop gutters

**WHEN** a consumer selects `spacing="comfortable"`

**THEN** apply consistent 24px padding at every viewport size.

---

### DEC-003: Require opt-in dynamic padding

**GIVEN** responsive padding unexpectedly overrides selected layout density

**WHEN** a page needs breakpoint-specific gutters

**THEN** the consumer explicitly enables `isDynamicPadding`; all other pages retain static spacing.

---

### DEC-004: Compare full compositions in the catalog

**GIVEN** Page styling needs visual review before further enhancement

**WHEN** a catalog visitor selects the spacing example

**THEN** each supported spacing configuration renders the same complete Page child composition for direct comparison.

---

### DEC-005: Use a compact Page title scale

**GIVEN** the previous Page title dominated the surrounding composition

**WHEN** Page is rendered at desktop or mobile widths

**THEN** its title uses a 32px desktop scale and a 26px mobile scale.

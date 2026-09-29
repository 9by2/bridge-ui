# Decisions: Console Prototype

| ID      | Title                         | Status   |
| ------- | ----------------------------- | -------- |
| DEC-001 | Catalog family placement      | accepted |
| DEC-002 | Two prototypes, each complete | accepted |
| DEC-003 | Default setting definition    | accepted |
| DEC-004 | No changeset                  | accepted |

---

### DEC-001: Catalog family placement

**GIVEN** the catalog already builds, inventories and browser-tests examples with the consumer cascade
**WHEN** adding a multi-page prototype
**THEN** it is catalog family `prototype` (`default`, `admin`), rendered full-bleed, with page modules under
`internal/catalog/prototype/` and in-memory page state.

### DEC-002: Two prototypes, each complete

**GIVEN** the user asked for both a Bridge studio Backstage and a generic admin prototype
**WHEN** measuring coverage
**THEN** each prototype (its own pages + shared shell) must use every one of the 97 catalog families.

### DEC-003: Default setting definition

**GIVEN** "DEFAULT setting"
**WHEN** composing package components
**THEN** no appearance className/style is passed to a `UI.*` component, no nested `Theme` override except the Settings
page density/RTL preview that demonstrates the Theme and Direction families; variant/size props are allowed only where
they express meaning (e.g. destructive, status tone).

### DEC-004: No changeset

**GIVEN** the change is catalog-only
**WHEN** shipping
**THEN** no package changeset unless a package defect is fixed.

### DEC-005: Caller grid track

**GIVEN** a caller layout grid without explicit columns creates an `auto` track sized to its widest child
**WHEN** a featured MetricTile value sat in that track at 390px
**THEN** prototype layout grids declare `grid-cols-1` (a shrinkable track); no package change is needed because the
package component already sets `minWidth: 0`.

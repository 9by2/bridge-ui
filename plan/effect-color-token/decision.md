# Decisions: Effect Color Token

| ID      | Title                                       | Status                |
| ------- | ------------------------------------------- | --------------------- |
| DEC-001 | One shadow color, recipe-owned alpha        | accepted              |
| DEC-002 | Generated Shadcn and engine literals remain | superseded by DEC-005 |
| DEC-003 | Calendar colored event text auto-contrasts  | accepted              |

---

### DEC-001: One shadow color, recipe-owned alpha

**GIVEN** owned recipes use 5–28% black shadow steps
**WHEN** a consumer retints elevation
**THEN** expose one `--bridge-color-shadow` (default `black`) and derive each step with `color-mix(in oklab, shadow N%, transparent)`; no per-component shadow variable.

---

### DEC-002: Generated Shadcn and engine literals remain

**GIVEN** AGENTS.md forbids manual edits under `app/component/shadcn/` and Recharts emits literal `stroke` attributes
**WHEN** scanning for non-token colors
**THEN** leave them; document as exceptions. Color picker palette and value default are user data, not theme color.

---

### DEC-003: Calendar colored event text auto-contrasts

**GIVEN** `event.color` is any consumer color and the prior text was fixed `#fff`
**WHEN** rendering a colored all-day event
**THEN** derive black/white text from the event color lightness via relative color syntax.

---

### DEC-004: Effect variables have no stylesheet default

**GIVEN** portals render a nested `[data-bridge-theme]` root and `component.css` declares defaults on every such root
**WHEN** a host sets `--bridge-color-shadow` on an outer Theme root
**THEN** the nested portal root would reset it; so backdrop/shadow/scrollbar keep defaults only in `var()` fallbacks and inherit through portals, matching the existing `--bridge-color-*` pattern.

---

### DEC-005: Patch generated Shadcn through the guarded refresh

**GIVEN** generated `bg-black/10` backdrops and `bg-white` slider thumb must never be hand-edited
**WHEN** the user asks to patch generated source too
**THEN** add replacements to `cmd/refresh-shadcn-doctor.ts` (Shadcn CLI registry overwrite): `bg-black/10` → `bg-overlay`, `bg-white` → `bg-background`. Catalog `global.css` maps `--overlay` and the Tailwind `--shadow-*` scale to `--bridge-color-backdrop` / `--bridge-color-shadow`, pre-mixing each alpha step (`--shadow-color-N`) because Tailwind collapses `color-mix` inside `@theme` shadows. The refresh became idempotent (skip already-applied replacement) to fix a pre-existing duplicate `toggle-group` context on re-run. Recharts attributes stay literal.

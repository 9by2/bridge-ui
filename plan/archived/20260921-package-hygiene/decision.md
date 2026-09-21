# Decision

### DEC-001: Retain Tailwind only for catalog reference source

**GIVEN** generated Shadcn catalog examples still use Tailwind classes while
published presentation resolves to owned StyleX modules
**WHEN** building the package
**THEN** omit the Tailwind Bun plugin from package build and retain the Vite
Tailwind plugin only for the private catalog.

### DEC-002: Report verified behavior, not volatile inventory totals

**GIVEN** hand-maintained package, catalog, and component counts diverge as
the export surface changes
**WHEN** documenting current package state
**THEN** describe the inventory verifier and packed-package export verification
without claiming volatile totals.

### DEC-003: Close historical foundation gaps explicitly

**GIVEN** immutable `@bridge/ui@0.6.0` consumer proof passes
**WHEN** documenting current readiness
**THEN** retain historical detail only in the archived foundation record and
state that the focus-sentinel review and state/visual coverage gate passed.

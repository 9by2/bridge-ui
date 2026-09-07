# Decision

### DEC-005: Hidden Guard Geometry And Portal Context

**GIVEN** a hidden focus sentinel must retain its tab stop but must not act as a pointer target
**WHEN** styling the package
**THEN** make only aria-hidden Base UI guards zero-area and pointer-inert, retaining upstream focus handler and tab index. Axe may classify the guard as incomplete; explicit keyboard verification remains required. This supersedes DEC-004's assumption that no package-owned correction is available, not its prohibition on removing focus behavior.

**GIVEN** the example's menu is portaled outside the preview main landmark
**WHEN** demonstrating the action menu
**THEN** supply a named region through the supported popup render prop rather than altering generated source or disabling the region rule.

### DEC-004: Preserve Focus Navigation

**GIVEN** Base UI 1.8.0 focus guard produces `aria-hidden-focus` and the body portal produces `region` in an unfiltered axe scan
**WHEN** reproducing the open-menu failure
**THEN** keep the scan failing explicitly, remove the broad expected-failure annotation, and verify actual keyboard navigation separately. Do not remove tab stop, mutate generated DOM, or exclude axe rule to manufacture release readiness.

Upstream evidence: https://github.com/mui/base-ui/issues/4668 and https://github.com/mui/base-ui/pull/2676 explain why removing focus-guard tab stop breaks focus management. No compatible upstream correction was identified. This task remains blocked, not complete.

### DEC-003: Declaration Resolution First

**GIVEN** emitted declaration retains private source alias and the existing fixture skips declaration checking
**WHEN** hardening the release
**THEN** fix and verify installed declaration resolution before memory measurement. Rewrite emitted alias only; generated source remains CLI-owned.

**GIVEN** the catalog now passes its smoke suite but memory and bundle proof are narrow
**WHEN** preparing release
**THEN** prioritize repeated lifecycle and packed-export checks over another example expansion.

**GIVEN** measured line/function coverage does not establish branch coverage
**WHEN** reporting readiness
**THEN** enforce each coverage dimension and keep unmet foundation gate explicit.

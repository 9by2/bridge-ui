# Task

- [x] Verify every public export and declaration from a Bun-installed tarball, including internal declaration import resolution.
- [x] Add repeated chart navigation/mount/unmount memory check and establish a reproducible budget.
- [x] Verify tree shaking with consumer dependency graph and compressed size budget; review direct-entry API consistency.
- [x] Cover brand interaction, cleanup, error and disabled branch; measure all required coverage dimensions.
- [x] Reproduce and fix the expected menu accessibility failure without editing generated source manually.
- [ ] Run full gate, document remaining repository coverage gap, and archive.

## Verification Snapshot

Package declaration regression reproduced before the build fix. Installed tarball resolves 71 public entry paths with declaration checking; JavaScript import, Vite client and SSR build pass. Chromium memory check passed three isolated repeat runs, then the full browser suite reported 347 passed (including the existing expected menu failure). Bun test: 14 pass, 513 assertions. Typecheck, lint, boundary and existing tree-shaking check pass. Generated lint warning count remains ten.

Latest: Vitest/V8 enforces 100% statement, branch, function and line coverage for each brand component (five interaction/SSR test cases). Repository-wide coverage remains unmet. Root/direct Button retained graph contains 30 contributing modules, excludes chart/upload dependency, and measures 16,270 / 16,279 gzip bytes under an 18,000-byte regression budget.

The broad menu expected-failure annotation is removed. Full browser run exposed the known axe failure plus an incorrect new modal-Tab assertion; corrected modal-Tab assertion passes the targeted keyboard run. The unfiltered menu axe scan remains a real gate failure. Upstream evidence and constraints are recorded in DEC-004. No archive, commit or release-readiness claim while this blocker remains.

Final combined verification: 347 browser pass, one open-menu axe failure; 14 Bun test pass / 513 assertions; five Vitest test pass with 100% brand coverage in all four metrics. Package install/declaration/client/SSR, typecheck, lint, boundary, formatter and tree-shaking check pass. The full gate and archive task remains unchecked because the accessibility gate is red and repository coverage is still below the foundation requirement.

Superseding menu verification: full browser suite passes after DEC-005. No axe exclusion or expected-failure annotation. Hidden guard keeps tabindex=0 with zero-area pointer-inert styling; keyboard regression verifies focus behavior. Example popup render supplies a named region. Axe incomplete output is attached for manual review. Package/client/SSR and typecheck pass; brand coverage remains 100% in every metric. Repository-wide foundation coverage remains unmet.

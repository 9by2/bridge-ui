# Decision

### DEC-001: Historical Whole-Source Coverage Direction

**GIVEN** scoped brand coverage did not establish package quality
**WHEN** the initial foundation plan was created
**THEN** it required a broad whole-source gate without lowering the 90% floor.

### DEC-002: Static Compilation

**GIVEN** generated Shadcn source is CLI-owned
**WHEN** integrating StyleX
**THEN** publish owned presentation as statically extracted CSS and require no consumer transform.

### DEC-003: Package Runtime Coverage Supersedes Repository Coverage

**GIVEN** command, catalog, generated source, and package runtime have different verification contracts
**WHEN** enforcing numerical coverage
**THEN** measure `app/` and `shared/` package runtime at 90%, exclude generated Shadcn source and the export-only barrel, keep owned component at 100%, and retain command, catalog, accessibility, package, and Bun.WebView as separate mandatory gate.

### DEC-004: Consolidate Promotion Follow-Up

**GIVEN** StyleX public promotion and private registry publication are complete but the exact Bridge Web consumer rerun remains unproven
**WHEN** reconciling active plan
**THEN** track that consumer proof and the final ADHD review only in `foundation-build`; archive the completed promotion implementation record.

### DEC-005: Keep consumer approval blocked on the exact-artifact probe

**GIVEN** Bridge Web's bounded production fixture used the installed registry
`@bridge/ui@0.4.0` artifact on 2026-09-21
**WHEN** the fixture completed production SSR with no browser error or external
network request but reported zero matching Recharts bars and 451px document
width at a 390px viewport
**THEN** record the failed evidence, keep consumer migration and Foundation
approval blocked, and require a passing rerun against the next exact registry
artifact before closing this proposal.

### DEC-006: Share the consumer Recharts runtime

**GIVEN** `ChartContainer` from Bridge UI and `BarChart` from Bridge Web render
through incompatible Recharts v3 and v2 contexts, and the generated chart
family uses Recharts v3 APIs
**WHEN** exporting the ChartContainer composition seam
**THEN** require compatible Recharts v3 as a peer dependency so package and
consumer resolve one runtime instance.

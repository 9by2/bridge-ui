# TsChart Task

- [x] Add failing embedded-chart and wrapper test.
- [x] Fix inline preview loading.
- [x] Add typed TsChart wrapper and inline example.
- [x] Verify browser, package, lint, typecheck and test.
- [x] Document, archive and commit.

Verification: real embedded Treemap, Scatter and Sankey SVG geometry passes; full browser suite passes with the pre-existing expected menu accessibility failure. Repository test, lint, typecheck, boundary, static catalog, package build and packed client/SSR validation pass. TsChart has 100% measured function and line coverage; repository-wide numerical coverage is still not established. The published 0.16.0 React adapter is a separate @tanstack/react-charts dependency, unlike current main documentation. Prior Calendar work is preserved.

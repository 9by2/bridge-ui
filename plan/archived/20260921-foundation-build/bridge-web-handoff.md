# Bridge Web 0.6.0 Proof Handoff

`@bridge/ui@0.6.0` is published. This is the sole remaining external proof
for closing `foundation-build`; do not migrate component families as part of
this task.

## Required Execution

1. Install exact private-registry `@bridge/ui@0.6.0` in Bridge Web with its
   shared Recharts v3 runtime.
2. Regenerate and commit Bridge Web's lockfile.
3. Run `bun cmd/spike-ui-rc.tsx` in Bridge Web against the installed artifact.
4. Retain the generated Bun.WebView report and screenshots under Bridge Web's
   `.eval/` directory.

## Passing Acceptance

- The matching-chart probe finds two mixed bars in every theme and viewport
  scenario.
- At a 390px viewport, document width is at most 390px.
- Production SSR has no browser error and no unexpected network request.

## Return Evidence

Send the report path and command output back to this repository. Update
`evidence.md`, then archive this plan only when all listed acceptance checks
pass.

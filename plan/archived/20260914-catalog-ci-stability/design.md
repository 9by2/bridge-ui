# Design

Compare isolated execution against the complete browser workload on Linux. Inspect request timing and render completion before changing preview behavior. Keep the static catalog build and all existing assertions.

```text
CI trace -> constrained reproduction -> targeted correction -> full catalog verification
```

The existing assertion remains the acceptance boundary:

```ts
await expect(page.locator("svg.ts-chart").first()).toBeVisible()
```

Use `workers: process.env.CI ? 1 : 4` to bound shared-runner contention. Keep default assertion timing and zero retry. A subprocess regression imports the actual config with CI set and unset. `cmd/verify-catalog-readiness.ts` records independent Bun.WebView render evidence for the affected control sequence and histogram.

Enable list and HTML reporting so the existing CI `playwright-report/` artifact path actually exists. List output identifies the active case and duration; HTML retains the review index. This changes reporting only.

## Evidence Boundary

The original trace proves delayed chart completion and unfinished control module requests, not a specific application defect. Four-worker CPU contention reproduces broad timeout failure. One worker bounds that avoidable load, but remote CI must still confirm the exact job symptom is resolved. No hash-routing or chart-data change is justified by the available evidence.

Local verification: 431/431 full macOS CI-mode checks; 30/30 repeated affected checks; Bun.WebView 17/17 readiness cases; 43/43 Bun checks; 144/144 component checks with both coverage gates at 100%; formatting, lint, typecheck, boundary, package build, packed install and tree-shaking pass. Generated source retains 10 lint warnings. Linux verification is recorded separately in `.eval/0914-catalog-ci-stability/`.

Linux Bun 1.4.1 verification also passes the affected-case repeat (30/30), source test (43/43), typecheck, both coverage gates, package build, packed install, and tree-shaking. The full Linux sweep began with a cached Bun 1.4.0 image and a one-CPU limit, later lifted; do not describe that sweep as exact CI-image or full one-CPU parity.

Full Linux sweep passed 431/431 in 30.6 minutes. A subsequent overlapping repeat outlived that sweep's server and failed with connection refused; exclude it from readiness conclusions. Remote job confirmation remains required after push.

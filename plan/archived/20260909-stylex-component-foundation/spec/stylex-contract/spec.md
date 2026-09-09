# StyleX Contract And Acceptance

**Status:** accepted for the complete private candidate. Public export/CSS/registry/consumer clauses continue in `plan/stylex-public-promotion/`.

## Contract

1. Every public component/module is represented in the 70-row baseline matrix. Newly introduced module receives its own inventory, ownership and coverage row.
2. Owned component style is statically compiled in package/catalog; consumer needs only normal React bundling and documented CSS import, not StyleX or Tailwind compilation.
3. Behavior-only module and third-party engine rendering may remain delegated. Every non-StyleX adapter has a scoped selector, justification, test and review owner. Do not market blanket StyleX coverage that excludes difficult cases silently.
4. Generated `app/component/shadcn/` is never hand-edited. Promoted owned implementation preserves agreed public prop, type, helper, ref, render and callback behavior.
5. Root and promoted subpath use the same runtime/context identity. Existing MultiSelectValue and Sonner alias distinctions are preserved deliberately.
6. Canonical theme follows Cue. Isolated usage must not mutate unrelated host typography/reset. Existing global CSS behavior changes only under an explicit reviewed RC contract; scoped portal receives matching theme and direction.
7. Application owns business value, translation, upload, routing, authorization and persistence decision. Package owns accessible presentation and local UI state.
8. No injection of StyleX-generated runtime stylesheet; compiled stylex.props is allowed. Engine dynamic data style has a separately documented CSP/variable policy.

## Acceptance Matrix

| Gate            | Test/evidence                                                      | Pass condition                                                                                                  |
| --------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Inventory       | AST component/export list vs matrix/catalog                        | Exact module + compound slot coverage; no omission hidden by wildcard                                           |
| API             | Declaration client + render ref/event test                         | Root/direct compile; helper returns expected type; callback once; no lost ARIA/native prop                      |
| Behavior        | Same fixture generated vs owned                                    | Same state transition/controlled contract; correction recorded separately                                       |
| StyleX          | Extend `test/internal/stylex.test.ts`                              | Token/state/media/keyframe extracted; no compiler call or injection in package JS                               |
| Compiler parity | Bun-built package vs Vite catalog                                  | Equivalent computed style across theme/state, deterministic CSS layer order                                     |
| SSR             | `production-jsx.test.ts`, executed packed SSR                      | Production React renders; no dev JSX import; stable identifier and no browser-only import crash                 |
| Hydration       | Packed browser fixture on server markup                            | Zero recoverable error, warning or runtime error; interaction still works                                       |
| Context         | Root/direct composition, nested provider and opposite theme portal | One provider instance per intended tree; correct scope, Escape and focus return                                 |
| Chart           | Positive matching-engine and negative mixed-version fixture        | Matching engine renders expected mark count + tooltip/legend; unsupported mix cannot be mistaken for success    |
| Responsive      | 390/1280px, narrow grid/dialog, long/Thai content                  | No unintended page overflow; intentional table/calendar scroll stays in documented container                    |
| Accessibility   | axe open/default + keyboard + manual review                        | No new violation; focus guard/incomplete report reviewed, visible ring/contrast, correct announcement           |
| Visual          | Approved A/B screenshot per applicable state                       | No unexplained geometry/type/token change; review any intentional change instead of auto-updating snapshot      |
| Lifecycle       | Repeated mount/open/close + listener/timer/observer/bitmap check   | No residual portal/scroll lock/subscription; chart heap/DOM check kept with precise scope                       |
| CSS host effect | Sentinel outside/inside theme, before/after both load orders       | Outside scope unchanged for isolated contract; full-global import impact explicitly documented                  |
| Bundle          | Existing tree-shaking command plus CSS/font report                 | Button <=18,000 gzip bytes and <=150,000 raw bytes; no chart/upload retained; report full/shared CSS separately |
| Coverage        | Runtime and per-owned-component V8 report                          | Runtime >=90% each metric; every owned component 100% statement/branch/function/line                            |
| Package         | Tarball install, export/type/font/CSS/ESM/map client check         | Every supported entry resolves without repository alias; React peer not duplicated; no undocumented transform   |
| Registry        | Successor public-promotion proposal                                | Deferred from private candidate; no publication claim                                                           |
| Consumer        | Successor public-promotion proposal                                | Deferred from private candidate; no consumer-migration claim                                                    |

## Test-First Protocol

Declare the test file and failing behavior before each production change. Use Vitest-transformed component tests for StyleX runtime source; Bun internal tests for build/export contracts. Run red where practical, implement the smallest owned change, then run green and screenshot review. A snapshot existence check is not a behavior test. Documentation-only planning uses inventory/link/Mermaid validation instead of production test execution.

Suggested new test target: `test/component/button.test.tsx`, `input.test.tsx`, `field.test.tsx`, `dialog.test.tsx`; `test/browser/stylex-comparison.spec.ts`, `context.spec.ts`, `css-scope.spec.ts`. Extend existing file where overlap is clear rather than duplicating test helpers.

## Full Validation Sequence

Run build-producing work sequentially and preserve log/evidence per command. Use the installed compatible Bun and real Node required by V8 coverage. Catalog is the current Storybook-equivalent gate; do not invent a nonexistent Storybook command.

```bash
bun fmt
bun lint
bun typecheck
bun boundary
bun test
bun coverage:runtime
bun coverage:brand
bun catalog:build
bun catalog:test
bun run build
bun verify:package
bun verify:tree-shaking
```

The final explicit build refreshes `dist/` after any test/catalog operation. Confirm build scripts do not race over shared output. Browser evidence must come from packed output too: source-aliased catalog alone is insufficient. Browser scope begins with installed Chromium/Chrome; add Firefox/WebKit before a cross-browser support claim, including native select/file/media behavior. Record browser version and font readiness.

## Evidence Artifact

Each run records source SHA, RC version/integrity, lockfile digest, Bun/Node/browser, fixture source, viewport/theme/direction/motion, command exit, screenshot, computed style, DOM bound, mark count, error/network log and compressed/uncompressed byte. Keep A/B content equal. Do not overwrite the only pre-StyleX baseline. Current Web report's generic error text predates the final command wording; numeric failure evidence is authoritative for that recorded run.

## Stop And Rollback

Stop a family on lost context, blank chart, hydration recovery, inaccessible focus, unexpected host style, API/helper break or bundle gate failure. Do not suppress warning, patch installed package, remove failing test or lower floor to pass. Revert only the owned implementation commit through normal review; a published RC cannot be overwritten. Publish a corrective RC or return consumer to the previous pinned version. Stable promotion and production migration need separate approval and complete foundation proof.

# Promotion Checkpoint

## Local Implementation

- Accepted candidate copied to owned `app/component/brand/stylex/`; generated Shadcn source untouched.
- Root, `@bridge/ui/button`, `@bridge/ui/component/shadcn/*`, owned upload paths and `@bridge/ui/theme` resolve promoted source.
- Legacy brand upload/drop/multiselect files are compatibility reexports to the owned implementation.
- Build emits promoted direct JavaScript/declaration/source map and no generated Shadcn JavaScript.
- Public `style.css` contains font assets, focus-guard normalization, extracted StyleX and scoped adapter; no Tailwind import/runtime utility output. Current size approximately 77KB raw / 16KB gzip.
- StyleX 0.19 `enableMediaQueryOrder` disabled consistently in Bun/Vite because full multi-entry reorder crashes; computed-style/layer checks pass with source order.

## Verification

- 388 exports / 70 module inventory preserved.
- Source, type, lint and boundary pass.
- Runtime and owned coverage pass at 100% all metrics.
- Full 428 catalog browser suite passes on promoted graph.
- 16 Recharts + 190 TsChart selected suite passes; tooltip dark contrast fixed by wrapping regular catalog in public Theme.
- Packed export/type/client/SSR verification passes.
- Root/direct Button tree shaking passes at about 6.1KB gzip without chart/upload retention.
- Public CSS before/after host load-order sentinel passes; outside typography/color/size unchanged.
- Hidden focus guard keyboard regression and open Axe sweep pass.

## External Gate

Push is blocked by the current shell permission layer. Remote remains at `6416f52`; local CI/spec commits and promotion changes cannot trigger GitLab until pushed. Merge, bot versioning, registry RC install and Bridge Web proof cannot be completed before that remote state exists.

## MR Follow-Up

- MR !4 merged at `313295fd8c5c4c3e4bd3f94c073c4fa22ec0c8f9`; main source/coverage/catalog passed and opened release MR !5 for `0.2.0-rc.2`.
- Font bundling fix `a0a29af` is in MR !6. Its first source job failed because four tests independently built the package in parallel and exceeded Bun's default 5s timeout. CI now builds once before `bun test`; build-inspection tests consume `dist`. Exact clean source sequence completes in 2.02s.
- MR !5 catalog had one distant TsChart lazy-preview timeout after 428 passes. The existing visibility assertion now allows 15s for the distant iframe; full promoted catalog passes locally.
- Do not merge release MR !5 until !6 and this CI follow-up merge and the bot refreshes the release branch.

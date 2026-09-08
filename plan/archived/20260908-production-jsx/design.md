# Design

Source -> Bun build with `jsx: { development: false }` -> split ESM -> installed tarball -> production SSR execution. Keep React external and preserve existing CSS/declaration output. Verification must render, not merely import or compile.

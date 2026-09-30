# DataList Browser Evidence

Run `bun catalog:build` followed by `bun catalog:test`. The `responsive.test.ts` DataList case opens `data-list/default` in Bun.WebView, checks the desktop table and mobile labelled-card layout, verifies the action appears once and confirms no document overflow. It saves desktop and mobile viewport captures in this directory.

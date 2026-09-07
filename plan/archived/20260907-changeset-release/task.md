# Task

- [x] Verify integration and write failing release regression.
- [x] Implement protected-main release automation and retry-safe publication.
- [x] Document feature, RC, promotion and administrator setup.
- [x] Verify locally and archive implementation contract; record live proof as pending.

Local proof: 20 Bun test, 717 assertions; runtime coverage 100%; typecheck, lint (10 generated warning), boundary, catalog and packed client/SSR verification pass. YAML parses locally. Isolated CLI fixture verifies 0.2.0-rc.0 promotion to 0.2.0. Mock publication covers new/retry/denial/install failure/tag conflict for RC and stable. No remote MR, credential change or package publication performed. Live bot permission, runner and registry proof remains pending under gitlab-release. Vite shutdown warning remains non-fatal.

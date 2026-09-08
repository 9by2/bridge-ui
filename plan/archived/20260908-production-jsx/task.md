# Task

- [x] Reproduce production rendering failure with a regression.
- [x] Fix JSX emission and execute packed SSR under production React.
- [x] Run quality gate, add release note and archive contract.

Red/green regression verified. 22 Bun test / 864 assertions pass; lint, typecheck, boundary, runtime/brand coverage, packed client/production SSR and tree-shaking pass. Catalog: 375 passed. Existing generated lint warning and Vite shutdown warning remain. No publication or consumer dependency change performed. A newly published RC must pass the Web compatibility spike before integration approval.

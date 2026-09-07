# Task

- [x] Test and implement viewer with media, PDF fallback and focus restoration.
- [x] Test and implement transfer state and controlled local/remote list with cumulative constraint and removal focus.
- [x] Test and implement crop reposition, zoom, rotation and aspect ratio with separate apply callback.
- [x] Add catalog composition and public export; verify interaction and accessibility.
- [x] Run formatting, lint, typecheck, unit coverage, browser and packed build; archive only after passing.

Verification: 375 browser check pass; 14 Bun test pass with 658 assertions; brand V8 coverage 100% per file in all four metrics; typecheck, lint (existing generated warning only), boundary, tree-shaking and packed client/SSR verification pass. Packed verification resolves 79 public entry. Repository-wide foundation coverage and registry publication remain separate unfinished work.

# Catalog CI Stability

- Run every catalog example, accessibility scan, interaction, visual, and memory check.
- Do not use retry or a longer assertion timeout to hide readiness failure.
- Verification must include constrained Linux execution, not only a macOS or isolated subset pass.
- Preserve trace and actionable diagnostic output on failure.
- CI uses one worker; local default remains four. List and non-opening HTML report are emitted.
- Do not claim remote CI is green without observing its result.

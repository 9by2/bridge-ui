# Decision

**GIVEN** generated Shadcn source is not owned implementation and the user excludes it from unit coverage
**WHEN** repository coverage runs
**THEN** exclude app/component/shadcn/** from the percentage while retaining catalog, accessibility and integration verification. Keep the owned repository floor at 90% and brand coverage at 100%; do not exclude owned command or catalog source to hide a remaining gap.

**GIVEN** Bun-only Linux image maps node to Bun fallback and V8 coverage crashes
**WHEN** verifying in Docker
**THEN** install checksum-verified Node 22.22.0 for Node-shebang tooling while retaining Bun for package management and command orchestration. Capture Linux screenshot baseline separately; do not weaken coverage threshold.

**GIVEN** clean CI cannot resolve tsgo and bunx tries a nonexistent npm package
**WHEN** invoking the compiler
**THEN** use the installed typescript/bin/tsc directly for typecheck and declaration emission. Regression test checks the installed executable contract.

**GIVEN** explicit request for concurrency override and cmd ownership
**WHEN** refining CI
**THEN** load deployment/concurrency.gitlab-ci.yml in both pipeline contexts and relocate internal/script to cmd without dropping lint or coverage scope. Keep stage dependency and package publication lock; concurrency override removes inherited resource mutex, not correctness dependency.

**GIVEN** repository coverage is below the required floor
**WHEN** adding deployment
**THEN** keep it blocking and never mark it allow_failure. Linux visual baseline requires runner verification. No automatic push, tag creation or publication during local setup.

**GIVEN** the company Bun include instantiates Docker/Kubernetes service jobs
**WHEN** GitLab lint rejects the package-only stage layout
**THEN** keep the requested company parent/child structure with the runner-only template and package-specific child job. Both YAML configurations pass remote lint; CI_JOB_TOKEN authenticates project 872 publication.

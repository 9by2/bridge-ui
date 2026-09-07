# Decision

**GIVEN** explicit request for concurrency override and cmd ownership
**WHEN** refining CI
**THEN** load deployment/concurrency.gitlab-ci.yml in both pipeline contexts and relocate internal/script to cmd without dropping lint or coverage scope. Keep stage dependency and package publication lock; concurrency override removes inherited resource mutex, not correctness dependency.

**GIVEN** repository coverage is below the required floor
**WHEN** adding deployment
**THEN** keep it blocking and never mark it allow_failure. Linux visual baseline requires runner verification. No automatic push, tag creation or publication during local setup.

**GIVEN** the company Bun include instantiates Docker/Kubernetes service jobs
**WHEN** GitLab lint rejects the package-only stage layout
**THEN** keep the requested company parent/child structure with the runner-only template and package-specific child job. Both YAML configurations pass remote lint; CI_JOB_TOKEN authenticates project 872 publication.

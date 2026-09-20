# Design

Validate source, coverage, browser and packed build in separate job. Protected prerelease tag matching package version permits manual publication to the project npm registry under next. CI_JOB_TOKEN authenticates only the temporary publish/install workspace.

```sh
git tag v0.1.1-rc.1
```

First change package version to the same prerelease and commit it. No latest release path.

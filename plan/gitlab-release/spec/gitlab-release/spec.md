# GitLab Release Contract

Every branch/MR/tag pipeline runs strict validation. Deployment is manual and only on a protected prerelease tag whose version equals package.json; npm tag is next, never latest. Publish authentication uses CI_JOB_TOKEN and project-local endpoint. Installed registry package must resolve after publication. No credential is committed or retained as an artifact. Actual runner/registry proof remains pending.

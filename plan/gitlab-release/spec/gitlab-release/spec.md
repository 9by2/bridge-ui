# GitLab Release Contract

Repository coverage excludes generated `app/component/shadcn/**` source. Generated component still requires catalog, accessibility and integration verification. Owned source retains the 90% repository floor and brand component retains 100% statement, branch, function and line coverage. Any remaining coverage failure blocks publication.

Every branch/MR/tag pipeline runs strict validation. Deployment is manual and only on a protected prerelease tag whose version equals package.json; npm tag is next, never latest. Publish authentication uses CI_JOB_TOKEN and project-local endpoint. Installed registry package must resolve after publication. No credential is committed or retained as an artifact. Actual runner/registry proof remains pending.

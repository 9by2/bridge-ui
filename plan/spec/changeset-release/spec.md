# Release Contract

Only protected default-branch CI may maintain a release MR or publish. All verification precedes the serialized release job. MR and tag pipelines never publish. Pending Changeset produces a reviewed release MR; release version publication must be idempotent and verify the installed registry package. RC publishes next and stable publishes latest. Git tag follows publication. Pre-mode entry/exit is explicit and reviewed. No automatic version application, remote push or publication during local implementation.

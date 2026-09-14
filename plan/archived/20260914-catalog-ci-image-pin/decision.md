# Decisions: Catalog CI Image Pin

| ID      | Title                  | Status   |
| ------- | ---------------------- | -------- |
| DEC-001 | Pin published manifest | accepted |

---

### DEC-001: Pin published manifest

**GIVEN** the service image contains verified amd64 and arm64 manifests
**WHEN** child verification starts on either runner architecture
**THEN** CI resolves the immutable OCI index digest and does not build or select a mutable tag

# Decisions: Breadcrumb Custom Separator

| ID      | Title                                           | Status   |
| ------- | ----------------------------------------------- | -------- |
| DEC-001 | Use separator children as the customization API | accepted |

---

### DEC-001: Use separator children as the customization API

**GIVEN** `BreadcrumbSeparator` already renders provided children before its ChevronRight fallback.

**WHEN** consumers need a custom separator.

**THEN** they pass content as `BreadcrumbSeparator` children; no new container prop is added.

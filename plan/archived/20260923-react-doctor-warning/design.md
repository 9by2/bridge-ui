# Design: React Doctor Warning Triage

## Overview

Prefer small semantic corrections. Preserve DOM and component public APIs when a rule's recommendation changes behavior. Keep catalog preview isolation compatible with same-origin scripting.

## Example Code

```tsx
<li key={error.message}>{error.message}</li>
```

## Risks & Mitigations

| Risk                                           | Mitigation                                                        |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| Catalog preview sandbox breaks scripts         | Verify browser catalog suite.                                     |
| Changes to native roles change public behavior | Only remove redundant roles; do not change element types blindly. |

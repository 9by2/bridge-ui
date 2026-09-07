# Decision

### DEC-001: Ownership

**GIVEN** local selection and remote attachment coexist
**WHEN** composing upload presentation
**THEN** preserve remote metadata without creating a File; delegate transfer, retry and cancellation to the caller. Accept caller-owned copy and enforce no network upload in package code.

# Decisions: Component Variant Expansion

| ID      | Title                                     | Status   |
| ------- | ----------------------------------------- | -------- |
| DEC-001 | ImageCrop wraps ReactCrop                 | accepted |
| DEC-002 | StatusStamp uses full semantic status set | accepted |
| DEC-003 | Table is canonical framed composition     | accepted |

---

### DEC-001: ImageCrop wraps ReactCrop

**GIVEN** consumers need standard crop geometry, accessibility, and options
**WHEN** ImageCrop is expanded
**THEN** it exposes the `react-image-crop` option and callback contract, with Bridge export behavior layered on it.

---

### DEC-002: StatusStamp uses full semantic status set

**GIVEN** existing neutral, success, warning, and destructive tones are insufficient
**WHEN** a status is displayed
**THEN** `info`, `pending`, `inactive`, and `partial-success` are also public tones.

---

### DEC-003: Table is canonical framed composition

**GIVEN** TableFrame is a table container variant rather than an independent concept
**WHEN** framed responsive tables are composed
**THEN** Table owns frame density, hint, and viewport APIs, while TableFrame exports remain compatible aliases.

---

### DEC-004: Crop selection and file encoding are distinct APIs

**GIVEN** ReactCrop requires caller-owned controlled crop state while file encoding is an optional application workflow
**WHEN** ImageCrop adopts the ReactCrop contract
**THEN** `ImageCrop` wraps ReactCrop and the retained Bridge file editor is exported as `ImageCropEditor`.

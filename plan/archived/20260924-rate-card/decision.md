# Decisions: Rate card

| ID      | Title                           | Status   |
| ------- | ------------------------------- | -------- |
| DEC-001 | Required variants from use case | accepted |
| DEC-002 | Compound parts over prop bag    | accepted |
| DEC-003 | Presentation-only boundary      | accepted |
| DEC-004 | Accessible name from title      | accepted |

---

### DEC-001: Required variants from use case

**GIVEN** Mobbin references split into manage-list rows, bookable service cards and comparable plans
**WHEN** a RateCard renders
**THEN** the consumer selects `row`, `card`, or `plan`; no implicit default, consistent with MetricTile.

### DEC-002: Compound parts over prop bag

**GIVEN** references mix status badge, description, duration, validity, feature list and one or two actions
**WHEN** designing the API
**THEN** expose composable parts (like ProductItem and Card) so each use case omits or reorders parts without new props.

### DEC-003: Presentation-only boundary

**GIVEN** currency, rate status, selection and editing are business state
**WHEN** composing RateCard
**THEN** the package renders caller-supplied formatted nodes; Badge, Button, DropdownMenu and Checkbox are passed as children.

### DEC-004: Accessible name from title

**GIVEN** a grid of similar cards is hard to distinguish with assistive technology
**WHEN** RateCardTitle is present
**THEN** the article is labelled by the title id unless the consumer supplies `aria-label` or `aria-labelledby`.

---

### DEC-005: Stable context value

**GIVEN** react-doctor flags constructed context values
**WHEN** RateCard provides variant and title registration
**THEN** the value is memoized on `variants` and `titleId`; the state setter is stable.

---

### DEC-006: Inline variant from bridge-web queue form

**GIVEN** bridge-web `RateCardMinimalInfo` renders title, BMA/UPC badges, light large price and duration inside a Select trigger and item
**WHEN** RateCard is used inside an interactive control
**THEN** `variants="inline"` renders phrasing-only `span` elements without frame, article or heading semantics so the host control keeps valid content and its own accessible name.

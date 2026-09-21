# Decisions: Wizard Step

| ID      | Title                                                                   | Status   |
| ------- | ----------------------------------------------------------------------- | -------- |
| DEC-001 | New sibling family instead of extending TimelineStep                    | accepted |
| DEC-002 | Horizontal is the default orientation                                   | accepted |
| DEC-003 | Add an `error` state not present on TimelineStepState                   | accepted |
| DEC-004 | Completed step interactivity via `render`, not a built-in click handler | accepted |
| DEC-005 | Singular `WizardStep` naming                                            | accepted |
| DEC-006 | Flex-flow connector geometry instead of absolute positioning            | accepted |

---

### DEC-001: New sibling family instead of extending TimelineStep

**GIVEN** `TimelineStep` is content-forward (vertical feed, connector runs
behind a tall content block, `marginInlineStart: 52`) and a wizard header is
chrome-forward (compact row, content lives in a separate panel)
**WHEN** designing the wizard-step presentation contract
**THEN** implement a new `WizardStep` component family that reuses
`TimelineStep`'s token vocabulary and state grammar, rather than adding
wizard-specific props/branches to `TimelineStep` itself — per `ADHD.md`,
"primitive implementation must not fork."

---

### DEC-002: Horizontal is the default orientation

**GIVEN** Mobbin research shows horizontal is the default for short wizard
forms (3–6 steps) and vertical/sidebar appears once step content is long
(Zillow, Xero)
**WHEN** `WizardStep` renders without an explicit `orientation` prop
**THEN** it defaults to `orientation="horizontal"` — the opposite default
from `TimelineStep`, which defaults to `vertical`.

---

### DEC-003: Add an `error` state not present on TimelineStepState

**GIVEN** wizard steps can fail form validation, a case `TimelineStepState`
(`default | completed | current | upcoming`) does not model
**WHEN** `WizardStepItem` / `WizardStepIndicator` / `WizardStepConnector`
receive `state="error"`
**THEN** the indicator renders a destructive-tone circle with an X icon,
and this state stays specific to `WizardStep`; it is not backported to
`TimelineStep` without a separate proposal.

---

### DEC-004: Completed step interactivity via `render`, not a built-in click handler

**GIVEN** `ADHD.md` requires business state and navigation side effects to
stay in the application container, and `Marker`/`Item` already establish
the `useRender` pattern for optional interactivity
**WHEN** a consumer wants a completed step to be clickable-to-revisit
**THEN** `WizardStepItem` accepts a Base UI `render` prop
(`render={<button onClick={...} />}`) instead of the package owning an
`onStepClick` callback or routing behavior.

---

### DEC-005: Singular `WizardStep` naming

**GIVEN** `AGENTS.md` forbids plural names except variables, and the
Mobbin research/prototype used the plural `Steps*` naming
**WHEN** implementing the production component
**THEN** the exported family is `WizardStep`, `WizardStepItem`,
`WizardStepIndicator`, `WizardStepConnector`, `WizardStepLabel`,
`WizardStepTitle`, `WizardStepDescription`, `WizardStepCounter` — singular,
consistent with `TimelineStep`'s existing naming convention.

---

### DEC-006: Flex-flow connector geometry instead of absolute positioning

**GIVEN** `design.md`'s initial sketch proposed an absolute-positioned
connector (mirroring `TimelineStepConnector`'s formula) anchored with a
`--wizard-step-indicator-size` CSS variable, but `WizardStepItem` lays out
as a flex row (indicator + label side by side) rather than
`TimelineStep`'s block-stacked column
**WHEN** implementing `WizardStepConnector`
**THEN** the connector renders as a normal-flow flex sibling
(`flex: 1 1 auto` horizontally, fixed `height`/`marginInlineStart`
vertically) between `WizardStepItem` elements instead of an
absolutely-positioned overlay — simpler, avoids fragile viewport-relative
`calc()`, and needs no custom property anchor. `TimelineStepConnector`'s
absolute-position formula is unchanged and remains correct for its own
block-stacked layout.

# BridgeUI Agents Rule

**AGENTS MUST NEVER EDIT THIS FILE, EVEN USER ASK FOR.**.

- **ALWAYS** read [ADHD.md](./ADHD.md) before any implementation. It is the source of truth for the north star, package architecture, foundation gate, and migration order.
- **ALWAYS** read [README.md](./README.md) for current project fact and command.
- **ALWAYS** use native `git`. Never use GitButler unless the active branch is already `gitbutler/workspace`.
- **ALWAYS** use singlular except variable name allowed to use plural.
- **ALWAYS** work directly on `main`; do not create a development branch. The automated release branch remains automation-owned.
- **ALWAYS** use Bun as package manager and script runner.
- **ALWAYS** use declarative config like `const AppConfig = { BASE_URL: "base-url" } as const`.
- **ALWAYS** define constant and type via `ValueOf<typeof ...>`.
- **ALWAYS** follow test-first implementation for production code.
- **ALWAYS** create a plan through [create-plan](./.agents/skills/create-plan/SKILL.md) before non-trivial implementation.
- **ALWAYS** keep the active implementation spec under `plan/<proposal>/spec/`. Archive and sync it through [archive-plan](./.agents/skills/archive-plan/SKILL.md) after completion.
- **ALWAYS** run the `bun fmt`, `bun lint`, `bun typecheck`, test, coverage, Storybook check, and package build required by ADHD before commit.
- **ALWAYS** follow commit title pattern: `{{chore|feat|fix|release|...}}({{detail}}): {{short-commit-message}}` short up to 50 characters, additional detail in comment message.
- **ALWAYS** add patch / minor changeset version when update / new component.
- **ALWAYS** relentlessly implement it when user ask for implement. Never stop until fully finished. If decision needed, just ask right away.
- **ALWAYS** provide full context with recommendation when asking question.
- **ALWAYS** use `Bun.WebView` to inspect and verify UX before handoff to user. Evaluation evidence must store in `.eval/{{MMDD}}-{{task}}/` including screen capture, video recording, reproducing step, runner script and etc as needed.
- **ALWAYS** enforce at least 90% statement, branch, function, and line coverage for owned package runtime in app/ and shared/.
- **ALWAYS** exclude generated app/component/shadcn/** and export-only app/index.ts from the runtime coverage percentage.
- **ALWAYS** add a test when an owned component has meaningful behavior that can regress: interaction, state transition, validation, accessibility state, error handling, cleanup, public API, or consumer integration.
- **ALWAYS** retain catalog, accessibility, package, tree-shaking, client, SSR, and Bun.WebView verification as separate required gate.
- **ALWAYS** test an interactive component through its public contract, not its internal implementation path.
- **ALWAYS** add targeted regression test for a fixed defect.
- **ALWAYS** make sure to fully satisfies [/react-doctor](./.agents/skills/react-doctor/SKILL.md)
- **ALWAYS** document how to use each modules in [CUSTOMIZATION.md](./CUSTOMIZATION.md).
- **ALWAYS** design `variants` for each component. Keep asking what this component may use in many usecases by composing into different container, child under others, or other child under it.

- **NEVER** manually edit `app/component/shadcn/`. Add or refresh generated source only through the Shadcn CLI with Bun.
- **NEVER** implement consumer migration in this repository.
- **NEVER** require 100% coverage for every non-generated component.
- **NEVER** add a test only to execute a presentation branch or raise a coverage number.
- **NEVER** test Tailwind, StyleX output, class composition, exact DOM shape, ordinary copy, translation rendering, or visual variant through unit coverage.
- **NEVER** treat generated Shadcn source as owned unit-test scope; verify it through catalog, accessibility, and package integration instead.
- **NEVER** use a coverage threshold as a substitute for behavior, accessibility, or consumer verification.
- **NEVER** exclude owned runtime source merely to make the percentage pass.

## Testing Rules

- **ALWAYS** follow the tdd skill for the general testing workflow.
- **ALWAYS** protect meaningful user behavior React/UI tests such as: interactions, state transitions, validation behavior, navigation, accessibility state, permissions, loading/error behavior
- **ALWAYS** testing business behavior at the Effect/service layer when possible.
- **ALWAYS** state the meaningful user or consumer behavior a test protects.
- **ALWAYS** use the cheapest reliable seam: static test for inventory/build, component test for public behavior, browser test only for browser-only behavior.
- **ALWAYS** add browser coverage for focus, keyboard, portal, browser API, lazy lifecycle, responsive overflow, unique semantic accessibility composition, documented visual contract, or fixed browser defect.
- **ALWAYS** add a new accessibility archetype test when a component introduces materially different semantics or composition.
- **ALWAYS** multiply themes, viewports, variants, or routes only when that dimension can change the asserted behavior.
- **ALWAYS** retain exact visual or CSS measurements only when an accepted spec promises them or a regression requires them.

- **NEVER** apply exhaustive TDD to presentation details.
- **NEVER** add tests solely for: Tailwind classes, StyleX output or class composition, conditional styling, exact DOM structure, snapshots, ordinary translation rendering, copy changes with no behavioral significance
- **NEVER** add a test solely because a catalog example, visual variant, theme, or viewport exists.
- **NEVER** use a browser test to duplicate public behavior already covered reliably through a component test.
- **NEVER** run axe against every catalog fixture by default; test representative semantic archetypes and unique compositions.
- **NEVER** test classes, ordinary DOM shape, ordinary copy, padding, pixel values, font weight, transition duration, or other implementation detail without a documented contract or focused defect regression.
- **NEVER** retain completed migration-parity coverage unless it protects an ongoing public contract.
- **NEVER** delete meaningful test coverage without moving its protected behavior to an equally reliable or cheaper seam.

### Testing Example

Start by naming the protected behavior and selecting the cheapest reliable seam.

| Behavior                              | Preferred seam            | Good test                                                                               | Avoid                                                                                                                     |
| ------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Catalog example exists and compiles   | Static inventory/build    | Verify the example is registered and `bun catalog:build` compiles it                    | Open every example in WebView                                                                                             |
| Component validates invalid input     | Component/public API      | Enter invalid value and assert exposed invalid/error state                              | Assert destructive border class                                                                                           |
| Quantity cannot pass configured bound | Component/public API      | Click increment and `expect(button).toBeDisabled()` at maximum                          | Assert disabled opacity, `expect(button).toBe(...)`, `expect(button).toHaveStyle(...)`, `expect(button).toHaveClass(...)` |
| Dialog restores focus after close     | Browser                   | Open dialog, close it, assert trigger is focused                                        | Assert portal wrapper DOM shape                                                                                           |
| Menu skips hidden focus guard         | Browser regression        | Navigate by keyboard and assert a menu item receives focus                              | Assert focus-guard width/padding                                                                                          |
| Mobile composition remains usable     | Browser                   | Set mobile viewport and assert no document overflow                                     | Assert exact sidebar width                                                                                                |
| Theme token keeps readable contrast   | Browser accessibility     | Audit a representative semantic archetype in each distinct theme                        | Axe-audit every visual fixture                                                                                            |
| Lazy chart releases preview resource  | Browser diagnostic        | Navigate away and assert preview iframe is removed; use memory probe for lifecycle work | Heap-test every routine change                                                                                            |
| Documented visual geometry            | Browser visual/regression | Assert the accepted ratio or use a curated screenshot baseline                          | Assert incidental pixel padding                                                                                           |

```ts
// Component seam: public behavior, not styling.
await user.click(incrementButton)
expect(incrementButton).toBeDisabled()

// Browser seam: focus restoration needs a real browser/portal.
await openDialog.click()
await page.pressKey("Escape")
await expect(openDialog).toBeFocused()

// Static seam: all examples remain discoverable and compilable.
expect(exampleModule).toMatch(/export default function Example|export \{ default \} from/)
```

**Before adding a test, answer:**

1. What meaningful user or consumer behavior can regress?
2. What is the cheapest reliable seam that observes it?
3. Does a new theme, viewport, variant, or fixture change that behavior?
4. Is an exact visual value documented or required by a defect regression?

If these questions do not identify a behavior beyond implementation detail, do not add the test.

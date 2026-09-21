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
- **ALWAYS** relentlessly implement it when user ask for implement. Never stop until fully finished. If decision needed, just ask right away.
- **ALWAYS** provide full context with recommendation when asking question.
- **ALWAYS** use `Bun.WebView` to inspect and verify UX before handoff to user. Evaluation evidence must store in `.eval/{{MMDD}}-{{task}}/` including screen capture, video recording, reproducing step, runner script and etc as needed.
- **ALWAYS** enforce at least 90% statement, branch, function, and line coverage for owned package runtime in app/ and shared/.
- **ALWAYS** exclude generated app/component/shadcn/** and export-only app/index.ts from the runtime coverage percentage.
- **ALWAYS** add a test when an owned component has meaningful behavior that can regress: interaction, state transition, validation, accessibility state, error handling, cleanup, public API, or consumer integration.
- **ALWAYS** retain catalog, accessibility, package, tree-shaking, client, SSR, and Bun.WebView verification as separate required gate.
- **ALWAYS** test an interactive component through its public contract, not its internal implementation path.
- **ALWAYS** add targeted regression test for a fixed defect.

- **NEVER** manually edit `app/component/shadcn/`. Add or refresh generated source only through the Shadcn CLI with Bun.
- **NEVER** implement Bridge Web or Cue migration until every foundation gate in ADHD pass.
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
- **NEVER** apply exhaustive TDD to presentation details.
- **NEVER** add tests solely for: Tailwind classes, StyleX output or class composition, conditional styling, exact DOM structure, snapshots, ordinary translation rendering, copy changes with no behavioral significance

### Testing Example

- Prefer `expect(button).toBeDisabled()` over: `expect(button).toHaveClass("opacity-50")`
- Prefer testing the Effect rule that determines whether an action is allowed instead of exhaustively testing every React styling permutation.
- Translation catalogs, interpolation, fallback behavior, and missing keys may be tested centrally rather than in every component.

### Testing Rule of thumb

Before adding a UI test, ask: `What meaningful user behavior would regress?`. If the answer is only styling, classes, markup, or ordinary translated copy, do not add the test.

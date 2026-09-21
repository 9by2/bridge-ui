# BridgeUI Agents Rule

- Read [ADHD.md](./ADHD.md) before any implementation. It is the source of truth for the north star, package architecture, foundation gate, and migration order.
- Read [README.md](./README.md) for current project fact and command.
- Read [oxlint.config.ts](./oxlint.config.ts) before changing TypeScript. Do not duplicate lint-enforced rule here.
- Use native `git`. Never use GitButler unless the active branch is already `gitbutler/workspace`.
- Work directly on `main`; do not create a development branch. The automated release branch remains automation-owned.
- Always use Bun as package manager and script runner.
- Never use plural except variable name.
- Use `ValueOf<typeof ...>` when a type derive from a constant object.
- Never manually edit `app/component/shadcn/`. Add or refresh generated source only through the Shadcn CLI with Bun.
- Follow test-first implementation for production code.
- Create a plan through [create-plan](./.agents/skills/create-plan/SKILL.md) before non-trivial implementation.
- Keep the active implementation spec under `plan/<proposal>/spec/`. Archive and sync it through [archive-plan](./.agents/skills/archive-plan/SKILL.md) after completion.
- Do not implement Bridge Web or Cue migration until every foundation gate in ADHD pass.
- Before commit, run the repository formatter, `bun lint`, typecheck, test, coverage, Storybook check, and package build required by ADHD.
- Implementation may spawn subagents using `proxy/gpt-5.6-sol` with ultra thinking
- Commit title pattern: `{{chore|feat|fix|release|...}}({{detail}}): {{short-commit-message}}` short up to 50 characters, additional detail in comment message.
- When user ask for implementation or approve plan. Must relentlessly implement it. Never stop until fully finished. If decision needed, just ask right away.
- When asking question, must provide full context with recommendation
- Use `Bun.WebView` to inspect and verify UX before handoff to user. Evaluation evidence must store in `.eval/{{MMDD}}-{{task}}/` including screen capture, video recording, reproducing step, runner script and etc as needed.

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

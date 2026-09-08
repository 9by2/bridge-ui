# Agent Rule

- Read [ADHD.md](./ADHD.md) before any implementation. It is the source of truth for the north star, package architecture, foundation gate, and migration order.
- Read [README.md](./README.md) for current project fact and command.
- Read [oxlint.config.ts](./oxlint.config.ts) before changing TypeScript. Do not duplicate lint-enforced rule here.
- Use native `git`. Never use GitButler unless the active branch is already `gitbutler/workspace`.
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

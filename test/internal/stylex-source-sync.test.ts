import { expect, test } from "bun:test"

test("private pilot and promoted owned source stay byte-identical", async () => {
  for (const file of new Bun.Glob("*.{ts,tsx,css}").scanSync({ cwd: "internal/pilot" })) {
    if (
      ["client.tsx", "comparison.tsx", "comparison-client.tsx", "fixture.tsx", "sidebar.tsx", "ts-chart.tsx"].includes(
        file
      )
    )
      continue
    expect(await Bun.file(`app/component/brand/stylex/${file}`).text(), file).toBe(
      await Bun.file(`internal/pilot/${file}`).text()
    )
  }
})

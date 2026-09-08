import { expect, test } from "bun:test"

test("package output renders with production React", async () => {
  const build = Bun.spawnSync(["bun", "run", "build"], { stdout: "pipe", stderr: "pipe" })
  expect(build.exitCode, build.stderr.toString()).toBe(0)
  const render = Bun.spawnSync(
    [
      "bun",
      "-e",
      `
    import { createElement as h } from "react";
    import { renderToString } from "react-dom/server";
    import { Button, Input, Dialog, DialogTrigger } from "./dist/index.js";
    import { Button as DirectButton } from "./dist/component/shadcn/button.js";
    const html = renderToString(h("main", null,
      h(Button, { disabled: true }, "Disabled"), h(DirectButton, null, "Direct"),
      h(Input, { "aria-label": "Name" }),
      h(Dialog, null, h(DialogTrigger, null, "Open dialog"))));
    if (!html.includes("disabled") || !html.includes("Direct") || !html.includes("Open dialog")) throw new Error("Missing markup");
  `
    ],
    { env: { ...process.env, NODE_ENV: "production" }, stdout: "pipe", stderr: "pipe" }
  )
  expect(render.exitCode, render.stderr.toString()).toBe(0)
  for (const file of new Bun.Glob("**/*.js").scanSync("dist")) {
    expect(await Bun.file(`dist/${file}`).text()).not.toContain("react/jsx-dev-runtime")
  }
}, 30000)

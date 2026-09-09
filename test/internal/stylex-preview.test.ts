import { expect, test } from "bun:test"

import { transformPilotExample } from "../../internal/catalog/pilot-transform"

test("candidate transform only replaces package import in selected example", () => {
  expect(
    transformPilotExample(
      'import { UploadExample } from "@catalog-upload"',
      "/catalog/example/drop-area/compact.tsx?pilot"
    )
  ).toContain('from "@catalog-upload?pilot"')
  expect(transformPilotExample('import * as UI from "@bridge/ui"', "/catalog/upload.tsx?pilot")).toContain(
    'from "@catalog-pilot"'
  )
  const source = 'import * as UI from "@bridge/ui"\nexport default UI.Button'
  expect(transformPilotExample(source, "/catalog/example/button/default.tsx?pilot")).toContain('from "@catalog-pilot"')
  expect(transformPilotExample(source, "/catalog/example/button/default.tsx")).toBeUndefined()
  expect(transformPilotExample(source, "/catalog/vendor/chart/default.tsx?pilot")).toBeUndefined()
  expect(transformPilotExample(source, "/catalog/example/chart/default.tsx?pilot")).toContain('from "@catalog-pilot"')
  expect(transformPilotExample(source, "/catalog/example/button/default.tsx?raw&pilot")).toBeUndefined()
  for (const name of ["skeleton", "spinner", "aspect-ratio", "separator", "textarea"]) {
    expect(transformPilotExample(source, `/catalog/example/${name}/default.tsx?pilot`)).toContain(
      'from "@catalog-pilot"'
    )
  }
})

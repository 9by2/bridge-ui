import { expect, test } from "bun:test"

import { renderToStaticMarkup } from "react-dom/server"

import { MultiSelectValue } from "../../app/component/brand/multi-select-value"
import { MultiSelect } from "../../app/component/shadcn/multi-select"

test("brand multiselect value retains placeholder and badge styling", () => {
  const placeholder = renderToStaticMarkup(
    <MultiSelect>
      <MultiSelectValue placeholder="Choose team" />
    </MultiSelect>
  )
  expect(placeholder).toContain("Choose team")
  const value = renderToStaticMarkup(
    <MultiSelect defaultValues={["design"]}>
      <MultiSelectValue className="custom-value" />
    </MultiSelect>
  )
  expect(value).toContain("bg-primary")
  expect(value).toContain("text-primary-foreground")
  expect(value).toContain("custom-value")
})

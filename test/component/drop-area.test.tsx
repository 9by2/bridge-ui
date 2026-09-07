import { renderToStaticMarkup } from "react-dom/server"
import { expect, test } from "vitest"

import { DropArea } from "../../app/component/brand/drop-area"

test("DropArea forwards copy, file constraint and disabled state", () => {
  for (const disabled of [false, true]) {
    for (const layout of ["stacked", "inline", "compact"] as const) {
      const html = renderToStaticMarkup(
        <DropArea
          label="Choose document"
          layout={layout}
          disabled={disabled}
          accept={{ "text/plain": [".txt"] }}
          multiple={false}
          className="test-area">
          Drop document
        </DropArea>
      )
      expect(html).toContain('data-slot="drop-area"')
      expect(html).toContain('aria-label="Choose document"')
      expect(html).toContain(`aria-disabled="${disabled}"`)
      expect(html).toContain('accept="text/plain,.txt"')
      expect(html).toContain("Drop document")
      expect(html).toContain("test-area")
    }
  }
})

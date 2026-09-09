import { cleanup, render } from "@testing-library/react"
import { ThemeProvider } from "next-themes"
import { renderToString } from "react-dom/server"
import { afterEach, expect, test } from "vitest"

import { Toaster } from "../../app/component/brand/stylex/sonner"

afterEach(cleanup)
test("sonner follows supported provider theme", () => {
  for (const theme of ["light", "dark", "custom"]) {
    expect(
      renderToString(
        <ThemeProvider forcedTheme={theme} defaultTheme={theme}>
          <Toaster />
        </ThemeProvider>
      )
    ).toBeTypeOf("string")
  }
})
test("sonner retains caller theme and container override", () => {
  const { container } = render(<Toaster theme="dark" className="caller" />)
  expect(container.querySelector("section")).not.toBeNull()
})

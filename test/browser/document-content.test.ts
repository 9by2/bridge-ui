import { expect, openPage, pollUntil, runAxe, test } from "./support"

const evidence = ".eval/0929-rich-content-document"

type Pdf = { data: string }
const pdfPageCount = (pdf: Pdf) =>
  (
    Buffer.from(pdf.data, "base64")
      .toString("latin1")
      .match(/\/Type\s*\/Page[^s]/g) ?? []
  ).length

async function waitForImages(page: Awaited<ReturnType<typeof openPage>>) {
  await pollUntil(() =>
    page.evaluate<boolean>(`() => [...document.images].every((image) => image.complete && image.naturalWidth > 0)`)
  )
}

// Protects: the document presentation stays black on white when the app theme is dark (theme independence).
test("document content ignores the application theme", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 1000 })
  for (const theme of ["light", "dark"]) {
    await page.goto(`/?preview&theme=${theme}#document-content/default`)
    await pollUntil(() => page.locator('[data-slot="document-content"]').count())
    await waitForImages(page)
    const color = await page.evaluate<Record<string, string>>(`() => {
      const pick = (selector) => getComputedStyle(document.querySelector(selector))
      return {
        page: pick('[data-slot="document-page"]').backgroundColor,
        text: pick('[data-slot="document-content"] p').color,
        heading: pick('[data-slot="document-content"] h1').color,
        cell: pick('[data-slot="document-content"] td').borderTopColor
      }
    }`)
    expect(color, theme).toEqual({
      page: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      heading: "rgb(0, 0, 0)",
      cell: "rgb(0, 0, 0)"
    })
    await Bun.write(
      `${evidence}/document-a4-${theme}.png`,
      await page.view.screenshot({ encoding: "buffer", format: "png" })
    )
  }
  expect(page.errors).toEqual([])
})

// Protects: zoom scales the page and the frame reserves the scaled size, so zoomed previews never overlap.
test("document page zoom reserves the scaled frame", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1600, height: 1000 })
  for (const route of ["zoom", "letter"]) {
    await page.goto(`/?preview&theme=light#document-content/${route}`)
    await pollUntil(() => page.locator('[data-slot="document-page"]').count())
    await waitForImages(page)
    await Bun.write(
      `${evidence}/document-${route}.png`,
      await page.view.screenshot({ encoding: "buffer", format: "png" })
    )
  }
  await page.goto(`/?preview&theme=light#document-content/zoom`)
  await pollUntil(() => page.locator('[data-slot="document-page"]').count())
  const size = await page.evaluate<{ frame: number; page: number }[]>(`() =>
    [...document.querySelectorAll('[data-slot="document-page-frame"]')].map((frame) => ({
      frame: Math.round(frame.getBoundingClientRect().width),
      page: Math.round(frame.querySelector('[data-slot="document-page"]').getBoundingClientRect().width)
    }))`)
  expect(size.map((item) => item.frame)).toEqual([397, 596, 794])
  expect(size.map((item) => item.page)).toEqual([397, 596, 794])
})

// Protects: page breaks produce real printed pages, and print drops preview chrome (zoom, frame shadow, dashed rule).
test("printing breaks pages at page breaks and drops preview chrome", async () => {
  await using page = await openPage()
  await page.setViewportSize({ width: 1280, height: 1000 })
  for (const [route, expected] of [
    ["default", 2],
    ["pages", 2]
  ] as const) {
    await page.goto(`/?preview&theme=dark#document-content/${route}`)
    await pollUntil(() => page.locator('[data-slot="document-content"]').count())
    await waitForImages(page)
    const pdf = await page.view.cdp<Pdf>("Page.printToPDF", {
      paperWidth: 8.27,
      paperHeight: 11.69,
      printBackground: true,
      preferCSSPageSize: false
    })
    await Bun.write(`${evidence}/document-${route}-print.pdf`, Buffer.from(pdf.data, "base64"))
    expect(pdfPageCount(pdf), route).toBe(expected)
  }
  await page.view.cdp("Emulation.setEmulatedMedia", { media: "print" })
  const printed = await page.evaluate<{ zoom: string; shadow: string; breakBorder: string; image: string }>(`() => {
    const pageStyle = getComputedStyle(document.querySelector('[data-slot="document-page"]'))
    return {
      zoom: pageStyle.zoom,
      shadow: pageStyle.boxShadow,
      breakBorder: getComputedStyle(document.querySelector('[data-slot="document-page-frame"]')).marginTop,
      image: getComputedStyle(document.querySelector('[data-slot="document-image"]')).breakInside
    }
  }`)
  expect(printed).toEqual({ zoom: "1", shadow: "none", breakBorder: "0px", image: "avoid" })
})

// Protects: the document archetype (page article, header/footer, table headers, labelled page break) is accessible.
test("document archetype is accessible", async () => {
  await using page = await openPage()
  await page.goto("/?preview&theme=light#document-content/letter")
  await pollUntil(() => page.locator('[data-slot="document-content"]').count())
  const result = await runAxe(page.view)
  expect(result.violations).toEqual([])
})

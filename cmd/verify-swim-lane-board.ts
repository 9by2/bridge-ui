import assert from "node:assert/strict"
import { mkdir } from "node:fs/promises"
import path from "node:path"

const root = path.resolve(import.meta.dir, "..")
const output = path.join(root, ".eval/0922-swim-lane-board")
const port = 6021
const baseUrl = `http://127.0.0.1:${port}/`
await mkdir(output, { recursive: true })

const preview = Bun.spawn(
  [
    "bunx",
    "vite",
    "preview",
    "--config",
    "vite.config.ts",
    "--port",
    String(port),
    "--strictPort",
    "--host",
    "127.0.0.1"
  ],
  { cwd: root, stdout: "ignore", stderr: "inherit" }
)

try {
  await waitForServer(baseUrl)
  const report = []
  for (const theme of ["light", "dark"]) {
    for (const [name, hash, width, actions] of [
      ["lane-expanded", "default", 1280, []],
      ["lane-column-collapsed", "default", 1280, ["Collapse Backlog"]],
      ["lane-overflow", "overflow", 1280, []],
      ["single-column-collapsed", "single-row", 1280, ["Collapse Inbox"]],
      ["single-mobile-collapsed", "single-row", 390, ["Collapse Inbox"]]
    ] as const) {
      await using view = new Bun.WebView({
        width,
        height: 720,
        backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
      })
      await view.navigate("about:blank")
      await view.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}#swim-lane-board/${hash}` })
      await ready(view, '[data-slot="swim-lane-board"]')
      for (const action of actions)
        await view.evaluate(`(() => document.querySelector(${JSON.stringify(`[aria-label="${action}"]`)})?.click())()`)
      const state = await view.evaluate<{
        boardOverflow: boolean
        documentOverflow: boolean
        compact: number
        border: string
        headerBorder: string
        laneBorder: string
        cellBorder: string
        cornerBottomBorder: string
        firstColumnLeftBorder: string
        lastColumnRightBorder: string
        lastCellBottomBorder: string
        laneControlCount: number
        stickyTop: boolean
        pageStickyTop: boolean
        stickyLeft: boolean
        cellScrollable: boolean
        boardVerticalOverflow: boolean
        rail: Array<{ label: string; box: DOMRect; contentBox: DOMRect | null; hitLabel: string; visible: boolean }>
      }>(`(async () => {
        const board = document.querySelector('[data-slot="swim-lane-board"]')
        const headers = [...board.querySelectorAll('[data-slot="swim-lane-board-column"]')]
        const header = headers.find((item) => item.querySelector('[aria-expanded="true"]')) ?? headers[0]
        const lane = board.querySelector('[data-slot="swim-lane-board-lane"]')
        const cells = [...board.querySelectorAll('[data-slot="swim-lane-board-cell"]')]
        const cell = cells.find((item) => getComputedStyle(item).borderLeftWidth === '1px') ?? cells[0]
        const corner = board.querySelector('[data-slot="swim-lane-board-corner"]')
        const initialHeaderTop = header?.getBoundingClientRect().top ?? 0
        const initialLaneLeft = lane?.getBoundingClientRect().left ?? 0
        board.scrollLeft = board.scrollWidth
        cell.scrollTop = cell.scrollHeight
        const stickyTop = Math.abs((header?.getBoundingClientRect().top ?? 0) - initialHeaderTop) < 1
        const stickyLeft = !lane || Math.abs(lane.getBoundingClientRect().left - initialLaneLeft) < 1
        const originalPaddingTop = document.body.style.paddingTop
        const originalPaddingBottom = document.body.style.paddingBottom
        document.body.style.paddingTop = '320px'
        document.body.style.paddingBottom = '720px'
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const boardTop = board.getBoundingClientRect().top
        window.scrollTo(0, boardTop + 24)
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const pageStickyTop = (header?.getBoundingClientRect().top ?? -1) >= -1
        const rail = headers.map((column) => {
          const button = column.querySelector('button')
          const buttonBox = button?.getBoundingClientRect()
          const hit = buttonBox ? document.elementFromPoint(buttonBox.left + buttonBox.width / 2, buttonBox.top + buttonBox.height / 2) : null
          return {
            label: button?.getAttribute('aria-label') ?? '',
            box: column.getBoundingClientRect().toJSON(),
            contentBox: column.firstElementChild?.getBoundingClientRect().toJSON() ?? null,
            hitLabel: hit?.closest('button')?.getAttribute('aria-label') ?? '',
            visible: Boolean(buttonBox && buttonBox.left >= 0 && buttonBox.right <= innerWidth && buttonBox.top >= 0 && buttonBox.bottom <= innerHeight)
          }
        })
        const result = {
          boardOverflow: board.scrollWidth >= board.clientWidth,
          documentOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          compact: document.querySelectorAll('[aria-expanded="false"]').length,
          border: getComputedStyle(board).border,
          headerBorder: header ? getComputedStyle(header).borderBottom : "",
          laneBorder: lane ? getComputedStyle(lane).borderRight : "not-applicable",
          cellBorder: cell ? getComputedStyle(cell).borderLeft : "",
          cornerBottomBorder: corner ? getComputedStyle(corner).borderBottom : "",
          firstColumnLeftBorder: headers.length > 0 ? getComputedStyle(headers[0]).borderLeft : "",
          lastColumnRightBorder: headers.length > 0 ? getComputedStyle(headers.at(-1)).borderRight : "",
          lastCellBottomBorder: cells.length > 0 ? getComputedStyle(cells.at(-1)).borderBottom : "",
          laneControlCount: board.querySelectorAll('[data-slot="swim-lane-board-lane"] button').length,
          stickyTop,
          pageStickyTop,
          stickyLeft,
          cellScrollable: cell ? cell.scrollHeight > cell.clientHeight && cell.scrollTop > 0 : false,
          boardVerticalOverflow: board.scrollHeight > board.clientHeight,
          rail
        }
        window.scrollTo(0, 0)
        board.scrollLeft = 0
        for (const item of cells) item.scrollTop = 0
        document.body.style.paddingTop = originalPaddingTop
        document.body.style.paddingBottom = originalPaddingBottom
        await new Promise((resolve) => requestAnimationFrame(resolve))
        return result
      })()`)
      if (actions.length > 0) assert.ok(state.compact > 0)
      assert.equal(state.documentOverflow, false)
      assert.match(state.border, /^1px solid/)
      assert.match(state.headerBorder, /^1px solid/)
      assert.match(state.cellBorder, /^1px solid/)
      if (hash !== "single-row") assert.match(state.laneBorder, /^1px solid/)
      if (hash !== "single-row") assert.match(state.cornerBottomBorder, /^1px solid/)
      assert.match(state.firstColumnLeftBorder, /^0px/)
      assert.match(state.lastColumnRightBorder, /^0px/)
      assert.match(state.lastCellBottomBorder, /^0px/)
      assert.equal(state.laneControlCount, 0)
      assert.equal(state.stickyTop, true)
      assert.equal(state.pageStickyTop, true)
      assert.equal(state.stickyLeft, true)
      assert.equal(state.boardVerticalOverflow, false)
      if (hash === "overflow") assert.equal(state.cellScrollable, true)
      for (const rail of state.rail.filter((item) => item.label.startsWith("Expand"))) {
        assert.ok(rail.contentBox)
        assert.ok(rail.contentBox.left >= rail.box.left)
        assert.ok(rail.contentBox.right <= rail.box.right)
        assert.ok(rail.contentBox.top >= rail.box.top)
        assert.ok(rail.contentBox.bottom <= rail.box.bottom)
        if (rail.visible) assert.equal(rail.hitLabel, rail.label)
      }
      await Bun.write(path.join(output, `${name}-${theme}-${width}.png`), await view.screenshot())
      report.push({ name, theme, width, state })
    }

    await using defaultView = new Bun.WebView({
      width: 1280,
      height: 720,
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
    })
    await defaultView.navigate("about:blank")
    await defaultView.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}#swim-lane-board/default` })
    await ready(defaultView, '[data-slot="swim-lane-board"]')
    const defaultMove = await defaultView.evaluate<{
      column: unknown
      row: unknown
    }>(`(async () => {
      let payload
      window.alert = (value) => { payload = JSON.parse(value) }
      const move = async (itemId, code) => {
        payload = undefined
        const item = document.querySelector('[data-item-id="' + itemId + '"]')
        item.focus()
        item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'Space' }))
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const active = item.getAttribute('data-dragging')
        item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code }))
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const over = [...document.querySelectorAll('[data-over="true"]')].map((element) => element.closest('[data-slot="swim-lane-board-cell"]')?.getAttribute('aria-label'))
        item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'Space' }))
        await new Promise((resolve) => setTimeout(resolve, 100))
        return { payload, active, over }
      }
      return { column: await move('PLAT-184', 'ArrowRight') }
    })()`)
    assert.deepEqual(defaultMove.column, {
      active: "true",
      over: [],
      payload: {
        itemId: "PLAT-184",
        source: { laneId: "api", columnId: "backlog", index: 0 },
        destination: { laneId: "api", columnId: "progress", index: 0 },
        sourceEvent: "keyboard"
      }
    })
    await defaultView.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}#swim-lane-board/default` })
    await ready(defaultView, '[data-slot="swim-lane-board"]')
    const rowMove = await defaultView.evaluate<unknown>(`(async () => {
      let payload
      window.alert = (value) => { payload = JSON.parse(value) }
      const item = document.querySelector('[data-item-id="PLAT-176"]')
      item.focus()
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'Space' }))
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const active = item.getAttribute('data-dragging')
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'ArrowDown' }))
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const over = [...document.querySelectorAll('[data-over="true"]')].map((element) => element.closest('[data-slot="swim-lane-board-cell"]')?.getAttribute('aria-label'))
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'Space' }))
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { payload, active, over }
    })()`)
    assert.deepEqual(rowMove, {
      active: "true",
      over: [],
      payload: {
        itemId: "PLAT-176",
        source: { laneId: "api", columnId: "progress", index: 0 },
        destination: { laneId: "experience", columnId: "progress", index: 0 },
        sourceEvent: "keyboard"
      }
    })
    await defaultView.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}#swim-lane-board/default` })
    await ready(defaultView, '[data-slot="swim-lane-board"]')
    const pointerSetup = await defaultView.evaluate<{
      source: { x: number; y: number }
      target: { x: number; y: number }
      width: number[]
    }>(`(() => {
      window.__swimLaneBoardPayload = undefined
      window.alert = (value) => { window.__swimLaneBoardPayload = JSON.parse(value) }
      const source = document.querySelector('[data-item-id="PLAT-184"]').getBoundingClientRect()
      const target = document.querySelector('[data-item-id="PLAT-176"]').getBoundingClientRect()
      return {
        source: { x: source.left + source.width / 2, y: source.top + source.height / 2 },
        target: { x: target.left + target.width / 2, y: target.top + target.height / 2 },
        width: [...document.querySelectorAll('[data-slot="swim-lane-board-cell"]')].map((cell) => cell.getBoundingClientRect().width)
      }
    })()`)
    await defaultView.cdp("Input.dispatchMouseEvent", { type: "mouseMoved", ...pointerSetup.source })
    await defaultView.cdp("Input.dispatchMouseEvent", {
      type: "mousePressed",
      ...pointerSetup.source,
      button: "left",
      buttons: 1,
      clickCount: 1
    })
    for (const progress of [0.08, 0.25, 0.5, 0.75, 1]) {
      await defaultView.cdp("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: pointerSetup.source.x + (pointerSetup.target.x - pointerSetup.source.x) * progress,
        y: pointerSetup.source.y + (pointerSetup.target.y - pointerSetup.source.y) * progress,
        button: "left",
        buttons: 1
      })
      await Bun.sleep(50)
    }
    const pointerDrag = await defaultView.evaluate<{ overlay: boolean; stable: boolean; dropZone: boolean }>(`(() => ({
      overlay: Boolean(document.querySelector('[data-slot="swim-lane-board-item-overlay"]')),
      stable: JSON.stringify([...document.querySelectorAll('[data-slot="swim-lane-board-cell"]')].map((cell) => cell.getBoundingClientRect().width)) === ${JSON.stringify(JSON.stringify(pointerSetup.width))},
      dropZone: [...document.querySelectorAll('[data-slot="swim-lane-board-cell"]')].every((target) => target.getAttribute('data-drop-zone') === 'true' && getComputedStyle(target).outlineStyle === 'dotted')
    }))()`)
    await defaultView.cdp("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      ...pointerSetup.target,
      button: "left",
      buttons: 0
    })
    await Bun.sleep(100)
    const pointerPayload = await defaultView.evaluate<unknown>("window.__swimLaneBoardPayload")
    assert.deepEqual(pointerDrag, { overlay: true, stable: true, dropZone: true })
    assert.deepEqual(pointerPayload, {
      itemId: "PLAT-184",
      source: { laneId: "api", columnId: "backlog", index: 0 },
      destination: { laneId: "api", columnId: "progress", index: 0 },
      sourceEvent: "pointer"
    })
    report.push({
      name: "default-move-intent",
      theme,
      width: 1280,
      state: { ...defaultMove, row: rowMove, pointer: { drag: pointerDrag, payload: pointerPayload } }
    })

    await using view = new Bun.WebView({
      width: 1280,
      height: 720,
      backend: { type: "chrome", url: false, argv: ["--no-sandbox"] }
    })
    await view.navigate("about:blank")
    await view.cdp("Page.navigate", { url: `${baseUrl}?preview&theme=${theme}#swim-lane-board/sortable` })
    await ready(view, '[data-slot="swim-lane-board"]')
    const sortable = await view.evaluate<{
      before: string[]
      after: string[]
      keyboard: boolean
      overlap: boolean
      payload: unknown
    }>(`(async () => {
      let payload
      window.alert = (value) => { payload = JSON.parse(value) }
      const item = [...document.querySelectorAll('[data-slot="swim-lane-board-item"]')].find((element) => element.textContent.includes('Second sortable item'))
      const cells = [...document.querySelectorAll('[data-slot="swim-lane-board-cell"]')]
      const read = () => cells.map((cell) => [...cell.querySelectorAll('[data-slot="swim-lane-board-item"]')].map((element) => element.textContent.trim()).join('|'))
      const before = read()
      item.focus()
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'Space' }))
      await new Promise((resolve) => requestAnimationFrame(resolve))
      const keyboard = item.getAttribute('data-dragging') === 'true'
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'ArrowRight' }))
      await new Promise((resolve) => requestAnimationFrame(resolve))
      item.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, code: 'Space' }))
      await new Promise((resolve) => setTimeout(resolve, 300))
      const doneItem = [...cells[1].querySelectorAll('[data-slot="swim-lane-board-item"]')]
      const box = doneItem.map((element) => element.getBoundingClientRect())
      const overlap = box.some((candidate, index) => box.some((other, otherIndex) => index < otherIndex && candidate.bottom > other.top))
      return { before, after: read(), keyboard, overlap, payload }
    })()`)
    assert.equal(sortable.keyboard, true)
    assert.deepEqual(sortable.payload, {
      itemId: "SORT-2",
      source: { columnId: "todo", index: 1 },
      destination: { columnId: "done", index: 0 },
      sourceEvent: "keyboard"
    })
    assert.notDeepEqual(sortable.after, sortable.before)
    assert.match(sortable.after[1] ?? "", /Second sortable item/)
    assert.equal(sortable.overlap, false)
    await Bun.write(path.join(output, `sortable-${theme}-1280.png`), await view.screenshot())
    report.push({ name: "sortable", theme, width: 1280, state: sortable })
  }
  await Bun.write(path.join(output, "report.json"), JSON.stringify(report, null, 2))
  await Bun.write(
    path.join(output, "README.md"),
    "# Swim lane board evidence\n\nRun `bun catalog:build && bun cmd/verify-swim-lane-board.ts`. Captures expanded, column-collapsed, dense-overflow, no-lane desktop/mobile, and keyboard-sortable layouts in light and dark themes. Assertions cover single edge ownership, absent lane collapse controls, compact control hit targets, row scrolling, sticky top/left headers, optional sortable activation, exact default-example alert payloads for column/lane moves, and post-drop movement.\n"
  )
  console.log(`Verified ${report.length} SwimLaneBoard Bun.WebView cases`)
} finally {
  preview.kill()
  Bun.WebView.closeAll()
}

async function ready(view: Bun.WebView, selector: string) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await view.evaluate(`Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return
    await Bun.sleep(25)
  }
  throw new Error(`Timed out waiting for ${selector}`)
}

async function waitForServer(url: string) {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      if ((await fetch(url)).ok) return
    } catch {}
    await Bun.sleep(50)
  }
  throw new Error(`Timed out waiting for ${url}`)
}

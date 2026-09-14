import { Theme } from "@bridge-owned/theme"
import { Component, Suspense, lazy, useEffect, useState } from "react"
import type { ComponentType, ReactNode } from "react"

import "./preview.css"
import "./shell.css"
import { createRoot } from "react-dom/client"

import { Preview } from "./preview"
import { Source } from "./source"

import "./pilot.css"
import chartInventory from "./vendor/tanstack/catalog-index.json"

const modules = import.meta.glob<{ default: ComponentType }>("./example/*/*.tsx")
const candidate = location.pathname.replace(/\/$/, "") === "/style-x"
const pilotModules = import.meta.glob<{ default: ComponentType }>("./example/*/*.tsx", {
  query: "?pilot"
})
if (candidate) Object.assign(modules, pilotModules)
const sources = import.meta.glob<string>("./example/*/*.tsx", { query: "?raw", import: "default" })
if (candidate)
  for (const key of Object.keys(pilotModules)) {
    const load = sources[key]
    if (load)
      sources[key] = async () =>
        `// Private catalog pilot, not a published import.\n${(await load()).replaceAll('from "@bridge/ui"', 'from "@catalog-pilot"')}`
  }
const uploadSource = () => import("./upload.tsx?raw").then((module) => module.default)
for (const mode of ["inline", "compact", "media", "avatar", "file-list", "document", "transfer", "crop"]) {
  const key = `./example/drop-area/${mode}.tsx`
  const entry = sources[key]
  if (entry)
    sources[key] = async () =>
      `${await entry()}\n// Shared catalog composition (internal/catalog/upload.tsx)\n${await uploadSource()}`
}
const chartSources = import.meta.glob<string>("./vendor/tanstack/cases/*/example.tsx", {
  query: "?raw",
  import: "default"
})
const chartSupport = import.meta.glob<string>(
  ["./vendor/tanstack/cases/**/*.{ts,tsx,css}", "!./vendor/tanstack/cases/*/example.tsx"],
  { query: "?raw", import: "default" }
)
for (const item of chartInventory.cases) {
  const load = chartSources[`./vendor/tanstack/cases/${item.id}/example.tsx`]
  if (load) sources[`./example/ts-chart/${item.id}.tsx`] = load
}
const entries = Object.keys(modules).map((path) => ({
  path,
  name: path.split("/")[2] ?? "",
  example: path.split("/")[3]?.replace(".tsx", "") ?? ""
}))
const names = [...new Set(entries.map((entry) => entry.name))].sort()
const title = (value: string) =>
  value === "ts-chart"
    ? "TsChart"
    : (chartInventory.cases.find((item) => item.id === value)?.title ??
      value
        .split("-")
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join(" "))
const components = Object.fromEntries(Object.entries(modules).map(([path, load]) => [path, lazy(load)]))
const description: Record<string, string> = {
  "drop-area/default":
    "Stacked file selection with a filename status. Accepts one file up to 5 MB; selection does not upload it.",
  "drop-area/inline":
    "Horizontal attachment layout with selected filename and removal. Your application owns the upload callback.",
  "drop-area/compact":
    "Compact attachment control for a form or composer, with selected filename and removal outside the trigger.",
  "drop-area/media":
    "Select a PNG or JPEG to preview it locally before upload. Selecting another image replaces the preview; Remove clears it. Preview URLs are released on replacement or unmount. No upload occurs.",
  "drop-area/avatar":
    "Preview a selected PNG or JPEG in a circular avatar frame. The circle is a visual mask, not a cropped file. Replace or remove the image before your application uploads it.",
  "drop-area/file-list":
    "Select multiple files and review their names before upload. Remove each file independently. This is a file list, not a document-content preview.",
  "drop-area/document":
    "PDF-only selection with filename review, a 5 MB limit and removal. This example does not render PDF pages or upload the document.",
  "drop-area/transfer":
    "Review the selected filename, then explicitly trigger a caller-owned upload callback. The demo reports the received file and size without sending a network request.",
  "drop-area/crop":
    "Preview a PNG or JPEG locally and adjust the center-square crop with zoom. Crop and upload creates a real 256x256 PNG File and passes it to the demo upload callback. No network request is made; preview resources are released on replacement or unmount.",
  dot: "A dotted background with an icon and reset action.",
  icon: "An icon-led empty state with a primary action.",
  muted: "A quiet surface for an empty notification state.",
  borderless: "Page selection without an active border; previous and next update the selection.",
  "range-2": "Select a start and end date across two visible months. Clear the selection to start a new range.",
  "range-4": "Select a date range across four visible months. The calendar wraps into a grid on smaller screens.",
  area: "Filled monotone area for volume over time. Hover to inspect each value.",
  line: "Multiple series with smooth and stepped interpolation, dots and dashed strokes.",
  "bar-stacked": "Stacked series with a shared stackId, rounded top and legend. Remove stackId for grouped bars.",
  "bar-horizontal": "Horizontal category bars with numeric axis and value labels.",
  pie: "Part-to-whole sectors with per-category color, tooltip and legend.",
  donut: "Inner and outer radius, sector spacing and a central total label.",
  radar: "Compare a score across categories on a polar grid.",
  radial: "Circular progress with an explicit domain, start/end angle and rounded background track.",
  scatter: "Numeric X/Y correlation with a Z dimension controlling bubble size.",
  composed: "Area, bar and line combined with a reference threshold and draggable range brush.",
  treemap: "Nested rectangular area represents relative category size.",
  funnel: "Conversion stages with decreasing width and explicit stage labels.",
  sankey: "Weighted flow between named nodes, with configurable link and node spacing.",
  tooltip: "All three indicator styles: dot, line and dashed. Tooltip is shown without requiring hover.",
  default: "The standard composition and starting point for this component.",
  variant: "Compare the appearance of each demonstrated style, from subtle to emphasized.",
  size: "Compare the demonstrated dimensions, spacing and text scale.",
  semantic: "Review the demonstrated enabled, disabled, selected or invalid state.",
  state: "Review the demonstrated lifecycle state, including progress and error feedback.",
  orientation: "Compare the horizontal and vertical layout where supported.",
  side: "Open each trigger to review its placement at the corresponding edge.",
  "item-variant": "Open the menu to compare its default and destructive action styling.",
  "addon-align": "Compare content placed before, after, above or below the input.",
  "button-size": "Compare the compact text and icon button dimensions.",
  media: "Compare the demonstrated text, icon and image treatment.",
  align: "Compare content aligned to the start and end of the layout.",
  legend:
    "Compare label treatment. Chart examples include custom icons, text-only legend, top/bottom placement and theme-specific color.",
  "orientation-and-media": "Compare horizontal icon and vertical image compositions.",
  "align-and-reactions": "Compare message alignment and reaction placement.",
  "orientation-and-variant": "Compare tab styling in horizontal and vertical compositions.",
  "side-and-variant": "Review the demonstrated sidebar side and surface configuration.",
  collapsed: "Compact title-only shell header with the desktop sidebar collapsed.",
  "long-title": "Long route title truncation with a trailing shell action.",
  "menu-button": "Compare sidebar menu button styling and size.",
  collapsible:
    "The documented collapse modes. This existing example labels the modes rather than demonstrating their behavior."
}

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  override render() {
    return this.state.failed ? (
      <p role="alert">This example could not render. Check the browser console.</p>
    ) : (
      this.props.children
    )
  }
}

function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "button/default")
  const [query, setQuery] = useState("")
  const [dark, setDark] = useState(new URLSearchParams(location.search).get("theme") !== "light")
  const [mobile, setMobile] = useState(false)
  const [locale, setLocale] = useState("en")
  const [motion, setMotion] = useState(false)
  const [menu, setMenu] = useState(false)
  const params = new URLSearchParams(location.search)
  const embedded = params.has("preview")
  const [name = "button", example = "default"] = route.split("/")
  const entry = entries.find((item) => item.name === name && item.example === example)
  const pilot = candidate && !!entry && entry.path in pilotModules
  const choices = entries
    .filter((item) => item.name === name)
    .sort((a, b) => (a.example === "default" ? -1 : b.example === "default" ? 1 : a.example.localeCompare(b.example)))
  useEffect(() => {
    const update = () => {
      setRoute(location.hash.slice(1) || "button/default")
      setMenu(false)
    }
    window.addEventListener("hashchange", update)
    return () => window.removeEventListener("hashchange", update)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.dataset.motion = (embedded ? params.get("motion") === "reduced" : motion)
      ? "reduced"
      : "normal"
    document.documentElement.lang = embedded ? (params.get("lang") ?? "en") : locale
    document.title = `${title(name)} / ${candidate ? "StyleX / " : ""}Bridge UI`
  }, [dark, motion, locale, name])
  if (embedded) {
    const Example = entry ? components[entry.path] : undefined
    return (
      <main className={`example-stage ${name === "shell-header" ? "shell-example-stage" : ""}`}>
        <h1 className="preview-heading">{title(name)}</h1>
        <h2 className="preview-heading">{title(example)} example</h2>
        <PreviewBoundary key={route}>
          <Suspense fallback={<p>Loading preview...</p>}>
            {Example ? (
              <Theme mode={dark ? "dark" : "light"} style={{ display: "contents" }}>
                <Example />
              </Theme>
            ) : (
              <p role="alert">Example not found.</p>
            )}
          </Suspense>
        </PreviewBoundary>
      </main>
    )
  }
  const preview = (selected: string, label: string) => (
    <div className="preview-wrap" style={{ maxWidth: mobile ? 390 : undefined }}>
      <Preview
        title={label}
        src={`${candidate ? "/style-x" : "/"}?preview&theme=${dark ? "dark" : "light"}&lang=${locale}&motion=${motion ? "reduced" : "normal"}#${name}/${selected}`}
      />
    </div>
  )
  return (
    <div className="catalog-shell">
      <header className="catalog-header">
        <a className="brand" href="#button/default">
          <span className="brand-mark">b.</span>Bridge <span className="brand-muted">/ ui</span>
        </a>
        <span className="header-note">The shared interface library</span>
        <div className="header-action">
          <a href={`${candidate ? "/" : "/style-x"}?theme=${dark ? "dark" : "light"}${location.hash}`}>
            {candidate ? "Regular preview" : "StyleX preview"}
          </a>
          <span className="version">v0.1.0</span>
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? "Light" : "Dark"}
          </button>
          <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-expanded={menu}>
            Browse
          </button>
        </div>
      </header>
      <aside className={`catalog-sidebar ${menu ? "is-open" : ""}`}>
        <label className="search-label" htmlFor="search">
          Find a component
        </label>
        <input
          id="search"
          className="catalog-search"
          type="search"
          placeholder="Search component..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="nav-caption">
          COMPONENT <span>{names.length}</span>
        </div>
        <nav aria-label="Component">
          {names
            .filter((value) => value.includes(query.toLowerCase().trim().replaceAll(" ", "-")))
            .map((value) => (
              <a key={value} href={`#${value}/default`} aria-current={value === name ? "page" : undefined}>
                {title(value)}
                {value === name && <span aria-hidden="true">↗</span>}
              </a>
            ))}
          {!names.some((value) => value.includes(query.toLowerCase().trim().replaceAll(" ", "-"))) && (
            <p className="empty-search">No match. Try another name.</p>
          )}
        </nav>
        <div className="sidebar-foot">One library. Every interface.</div>
      </aside>
      <main className="catalog-main">
        <div className="breadcrumb">
          Library <span>/</span> Component <span>/</span> {title(name)}
        </div>
        {entry ? (
          <>
            <div className="page-heading">
              <div>
                <div className="eyebrow">{candidate ? "STYLEX PREVIEW" : "BUILD WITH BRIDGE"}</div>
                <h1>{title(name)}</h1>
                <p>Every available example, described and displayed below. No switching required.</p>
                {candidate && (
                  <p role="status">
                    {pilot
                      ? "Private candidate: StyleX plus scoped compatibility CSS. Parity review remains open; example layout retains utility CSS."
                      : "Generated baseline. This component has not migrated to StyleX yet."}
                  </p>
                )}
              </div>
              <a
                className="upstream"
                href={
                  name === "ts-chart"
                    ? "https://tanstack.com/charts/latest"
                    : `https://ui.shadcn.com/docs/components/${name}`
                }
                target="_blank"
                rel="noreferrer">
                {name === "ts-chart" ? "TanStack reference ↗" : "Shadcn reference ↗"}
              </a>
            </div>
            <div className="workspace-toolbar">
              <span>
                {choices.length} example{choices.length === 1 ? "" : "s"} on this page
              </span>
              <div className="toolbar-action">
                <button aria-pressed={mobile} onClick={() => setMobile(!mobile)}>
                  {mobile ? "Mobile" : "Desktop"}
                </button>
              </div>
            </div>
            <div className="preview-setting">
              <span>
                {locale === "th"
                  ? "ตัวอย่างคอมโพเนนต์ที่ใช้ร่วมกัน"
                  : pilot
                    ? "Interactive preview. Uses the private StyleX candidate."
                    : "Interactive preview. Uses the actual package component."}
              </span>
              <label>
                <input type="checkbox" checked={motion} onChange={(event) => setMotion(event.target.checked)} /> Reduced
                motion
              </label>
              <select aria-label="Language" value={locale} onChange={(event) => setLocale(event.target.value)}>
                <option value="en">English</option>
                <option value="th">Thai</option>
              </select>
            </div>
            <div className="inline-example-list">
              {name === "chart" && (
                <section className="inline-example">
                  <h2>Chart option reference</h2>
                  <p>
                    Examples below cover chart families and common configurations, not every possible Recharts prop
                    combination.
                  </p>
                  <dl className="chart-option-reference">
                    <dt>Container</dt>
                    <dd>
                      config, id, className, initialDimension (width and height), and standard div props. Set an
                      explicit height for responsive sizing.
                    </dd>
                    <dt>Series configuration</dt>
                    <dd>
                      Each data key supports label, icon, and either color or theme.light / theme.dark. Series use the
                      generated --color-key CSS variable.
                    </dd>
                    <dt>Tooltip content</dt>
                    <dd>
                      indicator: dot, line, dashed; hideLabel; hideIndicator; nameKey; labelKey; labelFormatter;
                      formatter; color; labelClassName; className. active, payload and label supply the displayed data.
                    </dd>
                    <dt>Tooltip behavior</dt>
                    <dd>
                      Recharts Tooltip controls active, defaultIndex, cursor, position, offset, trigger, shared,
                      filterNull, itemSorter, animation and portal. ChartTooltip passes through the upstream API.
                    </dd>
                    <dt>Legend content</dt>
                    <dd>
                      hideIcon, nameKey, payload, verticalAlign and className. ChartLegend passes through Recharts
                      layout, align, verticalAlign, iconType and formatter controls.
                    </dd>
                    <dt>Chart composition</dt>
                    <dd>
                      Data keys, axis type/domain/tick formatting, grid, reference line/area/dot, label, multiple
                      series, stackId, normalization, interpolation, stroke/fill, radius, margin, brush,
                      synchronization, events and animation are configured on Recharts primitives.
                    </dd>
                  </dl>
                  <p>
                    <a href="https://recharts.github.io/en-US/api/" target="_blank" rel="noreferrer">
                      Full Recharts API reference ↗
                    </a>
                  </p>
                </section>
              )}
              {choices.map((item) => (
                <section className="inline-example" key={item.path} aria-labelledby={`heading-${item.example}`}>
                  <h2 id={`heading-${item.example}`}>{title(item.example)}</h2>
                  <p>
                    {name === "attachment" && item.example === "media"
                      ? "Distinct image, video and file icons identify the attachment type alongside its filename and size."
                      : (chartInventory.cases.find((chart) => name === "ts-chart" && chart.id === item.example)
                          ?.intent ??
                        description[`${name}/${item.example}`] ??
                        description[item.example] ??
                        `Review the ${title(item.example).toLowerCase()} composition below.`)}
                  </p>
                  <div className="preview-card">
                    {preview(item.example, `${title(name)} ${title(item.example)} preview`)}
                  </div>
                  <Source load={sources[item.path] ?? (() => Promise.resolve("Source unavailable."))} />
                  {name === "ts-chart" && chartInventory.cases.some((chart) => chart.id === item.example) && (
                    <details className="code-panel">
                      <summary>Supporting source</summary>
                      <p className="p-4 text-sm">
                        Vendored TanStack v0.16.0 example. Dataset source and attribution:
                        internal/catalog/vendor/tanstack/data. Supporting module is shown below.
                      </p>
                      {Object.entries(chartSupport)
                        .filter(([path]) => path.includes(`/cases/${item.example}/`))
                        .map(([path, load]) => (
                          <Source key={path} label={path.split("/").at(-1)} load={load} />
                        ))}
                    </details>
                  )}
                </section>
              ))}
            </div>
            <section className="quick-start">
              <div>
                <div className="eyebrow">USE IN YOUR APPLICATION</div>
                <h2>One import away.</h2>
                <p>Install the private package from your company registry.</p>
              </div>
              <pre>
                <code>{'import "@bridge/ui/style.css"\nimport * as UI from "@bridge/ui"'}</code>
              </pre>
            </section>
            <footer className="page-footer">
              <span>Bridge UI · Built on Base UI and Shadcn</span>
              <span>
                {choices.length} example{choices.length === 1 ? "" : "s"} available
              </span>
            </footer>
          </>
        ) : (
          <section>
            <h1>Example not found</h1>
            <a href="#button/default">Return to Button</a>
          </section>
        )}
      </main>
    </div>
  )
}

const root = document.getElementById("root")
if (root) createRoot(root).render(<App />)

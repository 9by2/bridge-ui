import { Theme } from "@bridge-owned/theme"
import { Component, Suspense, lazy, useEffect, useState } from "react"
import type { ComponentType, ReactNode } from "react"

import "./preview.css"
import "./shell.css"
import { createRoot } from "react-dom/client"

import { Preview } from "./preview"
import { Source } from "./source"

import "@bridge-owned/adapter.css"
import chartInventory from "./vendor/tanstack/catalog-index.json"

const modules = import.meta.glob<{ default: ComponentType }>("./example/*/*.tsx")
const sources = import.meta.glob<string>("./example/*/*.tsx", { query: "?raw", import: "default" })
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
  "theme/default":
    "The default Theme establishes Bridge UI defaults. Nested Theme boundaries can opt into compact density or scoped product color and geometry values.",
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
  "page/density":
    "Compare Page density: default, none, compact, comfortable, opt-in dynamic padding and the 1480px container variant.",
  "page/width":
    "Compare Page width presets: full, content (80rem), form (48rem) and editor (edge-to-edge). Width sets max-width only; density sets padding.",
  "page/header-slot":
    "Compose PageEyebrow, PageTitle, PageMeta and a full-row PageFilter inside PageHeader, with a DataState retry below.",
  "page/form": "A form page (width form, density compact) ending in a sticky PageFormAction with Cancel and Save.",
  "bridge-calendar/parity":
    "Custom event color, muted cancelled event, renderHoliday with holiday meta, and month drag-hover: drag the chip over a day to highlight it, drop to report a slot. Enter on a focused event activates it.",
  "item/custom-icon":
    "A neutral inline-SVG placeholder mark (no intrinsic size, currentColor) passed into Button, ItemMedia, MetricTile, Marker, Badge, SidebarMenuButton, SettingsNavItem, DataStateMedia and EmptyMedia. Brand icons live in the consumer.",
  "typography/prose":
    "Prose set with mixed Thai and English: Lead, InlineCode, Blockquote, bullet and ordered List, Large, Small, Muted, and a prose table that reuses Table.",
  "responsive-image/fallback":
    "A broken src swaps once to fallbackSrc (no retry loop); a blur placeholder shows until the image loads.",
  "shell-header/action":
    "Routes publish their header action with useShellHeaderAction; ShellHeaderActionSlot renders the latest one and clears it on unmount.",
  "multi-select/separator": "MultiSelectSeparator divides MultiSelectGroup blocks. Open the trigger to review it.",
  "upload-list/validation":
    "Composable validation (type, 2 MB, four files) with inline role=alert issues, grid thumbnail layout, empty slot and a change/issue event log. No toast is fired by the component.",
  "upload-list/single":
    "Single-file replace mode (multiple=false) with a custom renderItem row. Selecting another PDF reports change reason replace.",
  "spinner/size": "Compare Spinner sm, default and lg; an explicit size keeps its dimension inside a Button.",
  "image-crop/selection":
    "Controlled ReactCrop selection with an aspect ratio, circular mask, rule-of-thirds guide, keyboard adjustment, and caller-owned crop state.",
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
  "left-sidebar": "Full shell with flush navigation on the left edge.",
  "left-floating": "Full shell with a separated floating sidebar on the left.",
  "left-inset": "Full shell with left navigation and an inset content surface.",
  "right-sidebar": "Full shell with flush navigation on the right edge.",
  "right-floating": "Full shell with a separated floating sidebar on the right.",
  "right-inset": "Full shell with right navigation and an inset content surface.",
  collapsed: "Compact title-only shell header with the desktop sidebar collapsed.",
  "long-title": "Long route title truncation with a trailing shell action.",
  "menu-button": "Compare sidebar menu button styling and size.",
  "collapsible-offcanvas": "Toggle a full shell to move its sidebar outside the viewport.",
  "collapsible-icon": "Toggle a full shell to retain a compact icon rail.",
  "collapsible-none": "Full shell with persistent navigation and no collapse control."
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

function EmbeddedExample({
  route,
  name,
  example,
  entry,
  dark,
  selectedTheme
}: {
  route: string
  name: string
  example: string
  entry: (typeof entries)[number] | undefined
  dark: boolean
  selectedTheme: string | null
}) {
  const Example = entry ? components[entry.path] : undefined
  const fullPage = name === "shell-header" || (name === "sidebar" && example !== "menu-button")
  const Stage = fullPage ? "div" : "main"
  return (
    <Stage className={`example-stage ${name === "shell-header" ? "shell-example-stage" : ""}`}>
      {fullPage ? (
        <header>
          <h1 className="preview-heading">{title(name)}</h1>
          <h2 className="preview-heading">{title(example)} example</h2>
        </header>
      ) : (
        <>
          <h1 className="preview-heading">{title(name)}</h1>
          <h2 className="preview-heading">{title(example)} example</h2>
        </>
      )}
      <PreviewBoundary key={route}>
        <Suspense fallback={<p>Loading preview...</p>}>
          {Example ? (
            <Theme
              mode={selectedTheme === "cue" || selectedTheme === "future" ? selectedTheme : dark ? "dark" : "light"}
              style={{ display: "contents" }}>
              <Example />
            </Theme>
          ) : (
            <p role="alert">Example not found.</p>
          )}
        </Suspense>
      </PreviewBoundary>
    </Stage>
  )
}

function CatalogSidebar({
  menu,
  query,
  setQuery,
  name
}: {
  menu: boolean
  query: string
  setQuery: (value: string) => void
  name: string
}) {
  const normalizedQuery = query.toLowerCase().trim().replaceAll(" ", "-")
  const matches = names.filter((value) => value.includes(normalizedQuery))
  return (
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
        {matches.map((value) => (
          <a key={value} href={`#${value}/default`} aria-current={value === name ? "page" : undefined}>
            {title(value)}
            {value === name && <span aria-hidden="true">↗</span>}
          </a>
        ))}
        {matches.length === 0 && <p className="empty-search">No match. Try another name.</p>}
      </nav>
      <div className="sidebar-foot">One library. Every interface.</div>
    </aside>
  )
}

function ChartOptionReference() {
  return (
    <section className="inline-example">
      <h2>Chart option reference</h2>
      <p>
        Examples below cover chart families and common configurations, not every possible Recharts prop combination.
      </p>
      <dl className="chart-option-reference">
        <dt>Container</dt>
        <dd>
          config, id, className, initialDimension (width and height), and standard div props. Set an explicit height for
          responsive sizing.
        </dd>
        <dt>Series configuration</dt>
        <dd>
          Each data key supports label, icon, and either color or theme.light / theme.dark. Series use the generated
          --color-key CSS variable.
        </dd>
        <dt>Tooltip content</dt>
        <dd>
          indicator: dot, line, dashed; hideLabel; hideIndicator; nameKey; labelKey; labelFormatter; formatter; color;
          labelClassName; className. active, payload and label supply the displayed data.
        </dd>
        <dt>Tooltip behavior</dt>
        <dd>
          Recharts Tooltip controls active, defaultIndex, cursor, position, offset, trigger, shared, filterNull,
          itemSorter, animation and portal. ChartTooltip passes through the upstream API.
        </dd>
        <dt>Legend content</dt>
        <dd>
          hideIcon, nameKey, payload, verticalAlign and className. ChartLegend passes through Recharts layout, align,
          verticalAlign, iconType and formatter controls.
        </dd>
        <dt>Chart composition</dt>
        <dd>
          Data keys, axis type/domain/tick formatting, grid, reference line/area/dot, label, multiple series, stackId,
          normalization, interpolation, stroke/fill, radius, margin, brush, synchronization, events and animation are
          configured on Recharts primitives.
        </dd>
      </dl>
      <p>
        <a href="https://recharts.github.io/en-US/api/" target="_blank" rel="noreferrer">
          Full Recharts API reference ↗
        </a>
      </p>
    </section>
  )
}

function ExampleSection({
  item,
  name,
  preview
}: {
  item: (typeof entries)[number]
  name: string
  preview: (selected: string, label: string) => ReactNode
}) {
  const copy =
    name === "attachment" && item.example === "media"
      ? "Distinct image, video and file icons identify the attachment type alongside its filename and size."
      : (chartInventory.cases.find((chart) => name === "ts-chart" && chart.id === item.example)?.intent ??
        description[`${name}/${item.example}`] ??
        description[item.example] ??
        `Review the ${title(item.example).toLowerCase()} composition below.`)
  const showSupportingSource = name === "ts-chart" && chartInventory.cases.some((chart) => chart.id === item.example)
  return (
    <section className="inline-example" key={item.path} aria-labelledby={`heading-${item.example}`}>
      <h2 id={`heading-${item.example}`}>{title(item.example)}</h2>
      <p>{copy}</p>
      <div className="preview-card">{preview(item.example, `${title(name)} ${title(item.example)} preview`)}</div>
      <Source load={sources[item.path] ?? (() => Promise.resolve("Source unavailable."))} />
      {showSupportingSource && (
        <details className="code-panel">
          <summary>Supporting source</summary>
          <p className="p-4 text-sm">
            Vendored TanStack v0.16.0 example. Dataset source and attribution: internal/catalog/vendor/tanstack/data.
            Supporting module is shown below.
          </p>
          {Object.entries(chartSupport)
            .filter(([path]) => path.includes(`/cases/${item.example}/`))
            .map(([path, load]) => (
              <Source key={path} label={path.split("/").at(-1)} load={load} />
            ))}
        </details>
      )}
    </section>
  )
}

function ComponentPage({
  name,
  entry,
  choices,
  mobile,
  setMobile,
  locale,
  setLocale,
  motion,
  setMotion,
  preview
}: {
  name: string
  entry: (typeof entries)[number] | undefined
  choices: (typeof entries)[number][]
  mobile: boolean
  setMobile: (value: boolean) => void
  locale: string
  setLocale: (value: string) => void
  motion: boolean
  setMotion: (value: boolean) => void
  preview: (selected: string, label: string) => ReactNode
}) {
  if (!entry)
    return (
      <section>
        <h1>Example not found</h1>
        <a href="#button/default">Return to Button</a>
      </section>
    )
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">BUILD WITH BRIDGE</div>
          <h1>{title(name)}</h1>
          <p>Every available example, described and displayed below. No switching required.</p>
        </div>
        <a
          className="upstream"
          href={
            name === "ts-chart" ? "https://tanstack.com/charts/latest" : `https://ui.shadcn.com/docs/components/${name}`
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
            : "Interactive preview. Uses the public StyleX package component."}
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
        {name === "chart" && <ChartOptionReference />}
        {choices.map((item) => (
          <ExampleSection key={item.path} item={item} name={name} preview={preview} />
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
  )
}

function App() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || "button/default")
  const [query, setQuery] = useState("")
  const selectedTheme = new URLSearchParams(location.search).get("theme")
  const [dark, setDark] = useState(selectedTheme !== "light")
  const [mobile, setMobile] = useState(false)
  const [locale, setLocale] = useState("en")
  const [motion, setMotion] = useState(false)
  const [menu, setMenu] = useState(false)
  const params = new URLSearchParams(location.search)
  const embedded = params.has("preview")
  const previewMotion = params.get("motion")
  const previewLocale = params.get("lang")
  const [name = "button", example = "default"] = route.split("/")
  const entry = entries.find((item) => item.name === name && item.example === example)
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
    document.documentElement.dataset.motion = (embedded ? previewMotion === "reduced" : motion) ? "reduced" : "normal"
    document.documentElement.lang = embedded ? (previewLocale ?? "en") : locale
    document.title = `${title(name)} / Bridge UI`
  }, [dark, embedded, previewMotion, motion, previewLocale, locale, name])
  if (embedded)
    return (
      <EmbeddedExample
        route={route}
        name={name}
        example={example}
        entry={entry}
        dark={dark}
        selectedTheme={selectedTheme}
      />
    )
  const preview = (selected: string, label: string) => (
    <div className="preview-wrap" style={{ maxWidth: mobile ? 390 : undefined }}>
      <Preview
        title={label}
        src={`/?preview&theme=${dark ? "dark" : "light"}&lang=${locale}&motion=${motion ? "reduced" : "normal"}#${name}/${selected}`}
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
          <span className="version">v0.1.0</span>
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme">
            {dark ? "Light" : "Dark"}
          </button>
          <button className="mobile-menu" onClick={() => setMenu(!menu)} aria-expanded={menu}>
            Browse
          </button>
        </div>
      </header>
      <CatalogSidebar menu={menu} query={query} setQuery={setQuery} name={name} />
      <main className="catalog-main">
        <div className="breadcrumb">
          Library <span>/</span> Component <span>/</span> {title(name)}
        </div>
        <ComponentPage
          name={name}
          entry={entry}
          choices={choices}
          mobile={mobile}
          setMobile={setMobile}
          locale={locale}
          setLocale={setLocale}
          motion={motion}
          setMotion={setMotion}
          preview={preview}
        />
      </main>
    </div>
  )
}

const root = document.getElementById("root")
if (root) createRoot(root).render(<App />)

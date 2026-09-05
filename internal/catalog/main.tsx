import { Component, Suspense, lazy, useEffect, useState } from "react"
import type { ComponentType, ReactNode } from "react"
import { createRoot } from "react-dom/client"

import "./preview.css"
import "./shell.css"

const modules = import.meta.glob<{ default: ComponentType }>("./example/*/*.tsx")
const sources = import.meta.glob<string>("./example/*/*.tsx", { query: "?raw", import: "default", eager: true })
const entries = Object.keys(modules).map((path) => ({
  path,
  name: path.split("/")[2] ?? "",
  example: path.split("/")[3]?.replace(".tsx", "") ?? ""
}))
const names = [...new Set(entries.map((entry) => entry.name))].sort()
const title = (value: string) =>
  value === "ts-chart"
    ? "TsChart"
    : value
        .split("-")
        .map((word) => word[0]?.toUpperCase() + word.slice(1))
        .join(" ")
const components = Object.fromEntries(Object.entries(modules).map(([path, load]) => [path, lazy(load)]))
const description: Record<string, string> = {
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
  const [copy, setCopy] = useState<{ path: string; label: string } | null>(null)
  const [locale, setLocale] = useState("en")
  const [motion, setMotion] = useState(false)
  const [menu, setMenu] = useState(false)
  const params = new URLSearchParams(location.search)
  const embedded = params.has("preview")
  const [name = "button", example = "default"] = route.split("/")
  const entry = entries.find((item) => item.name === name && item.example === example)
  const choices = entries
    .filter((item) => item.name === name)
    .sort((a, b) => (a.example === "default" ? -1 : b.example === "default" ? 1 : a.example.localeCompare(b.example)))
  useEffect(() => {
    const update = () => {
      setRoute(location.hash.slice(1) || "button/default")
      setCopy(null)
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
    document.title = `${title(name)} / Bridge UI`
  }, [dark, motion, locale, name])
  if (embedded) {
    const Example = entry ? components[entry.path] : undefined
    return (
      <main className="example-stage">
        <h1 className="preview-heading">{title(name)}</h1>
        <h2 className="preview-heading">{title(example)} example</h2>
        <PreviewBoundary key={route}>
          <Suspense fallback={<p>Loading preview...</p>}>
            {Example ? <Example /> : <p role="alert">Example not found.</p>}
          </Suspense>
        </PreviewBoundary>
      </main>
    )
  }
  const preview = (selected: string, label: string) => (
    <div className="preview-wrap" style={{ maxWidth: mobile ? 390 : undefined }}>
      <iframe
        loading="lazy"
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
                <div className="eyebrow">BUILD WITH BRIDGE</div>
                <h1>{title(name)}</h1>
                <p>Every available example, described and displayed below. No switching required.</p>
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
                      : (description[item.example] ??
                        `Review the ${title(item.example).toLowerCase()} composition below.`)}
                  </p>
                  <div className="preview-card">
                    {preview(item.example, `${title(name)} ${title(item.example)} preview`)}
                  </div>
                  <details className="code-panel">
                    <summary>View code</summary>
                    <div className="code-header">
                      <span>{item.example}.tsx / exact preview source</span>
                      <button
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(sources[item.path] ?? "")
                            setCopy({ path: item.path, label: "Copied" })
                          } catch {
                            setCopy({ path: item.path, label: "Copy unavailable" })
                          }
                        }}>
                        {copy?.path === item.path ? copy.label : "Copy code"}
                      </button>
                    </div>
                    <pre tabIndex={0}>
                      <code>{sources[item.path]}</code>
                    </pre>
                  </details>
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

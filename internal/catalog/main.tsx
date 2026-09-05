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
  value
    .split("-")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ")
const components = Object.fromEntries(Object.entries(modules).map(([path, load]) => [path, lazy(load)]))

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
  const [dark, setDark] = useState(new URLSearchParams(location.search).get("theme") === "dark")
  const [mobile, setMobile] = useState(false)
  const [compare, setCompare] = useState(false)
  const [code, setCode] = useState(false)
  const [copy, setCopy] = useState("Copy code")
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
  const source = entry ? (sources[entry.path] ?? "") : ""
  useEffect(() => {
    const update = () => {
      setRoute(location.hash.slice(1) || "button/default")
      setCopy("Copy code")
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
                <p>Explore the component. Choose an example. Make it yours.</p>
              </div>
              <a
                className="upstream"
                href={`https://ui.shadcn.com/docs/components/${name}`}
                target="_blank"
                rel="noreferrer">
                Shadcn reference ↗
              </a>
            </div>
            <div className="workspace-toolbar">
              <label>
                Example{" "}
                <select
                  aria-label="Example"
                  value={example}
                  onChange={(event) => {
                    location.hash = `${name}/${event.target.value}`
                  }}>
                  {choices.map((item) => (
                    <option key={item.example} value={item.example}>
                      {title(item.example)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="toolbar-action">
                <button aria-pressed={mobile} onClick={() => setMobile(!mobile)}>
                  {mobile ? "Mobile" : "Desktop"}
                </button>
                <button aria-pressed={compare} onClick={() => setCompare(!compare)}>
                  Compare
                </button>
                <button aria-pressed={code} onClick={() => setCode(!code)}>
                  Code
                </button>
              </div>
            </div>
            <div className={`preview-grid ${compare ? "comparison" : ""}`}>
              <section className="preview-card">
                <div className="preview-caption">
                  <span>{title(example)}</span>
                  <span>LIVE PREVIEW</span>
                </div>
                {preview(example, "Component preview")}
              </section>
              {compare && (
                <section className="preview-card">
                  <div className="preview-caption">
                    <span>Default</span>
                    <span>REFERENCE</span>
                  </div>
                  {preview("default", "Comparison preview")}
                </section>
              )}
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
            {code && (
              <section className="code-panel">
                <div className="code-header">
                  <span>
                    example.tsx <span className="brand-muted">/ exact preview source</span>
                  </span>
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(source)
                        setCopy("Copied")
                      } catch {
                        setCopy("Copy unavailable")
                      }
                    }}>
                    {copy}
                  </button>
                </div>
                <pre tabIndex={0}>
                  <code>{source}</code>
                </pre>
              </section>
            )}
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

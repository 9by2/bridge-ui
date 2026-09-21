import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import {
  WebGLSurface,
  resetWebGLAvailability,
  supportsWebGL
} from "../../app/component/brand/stylex-support/webgl-surface"
import { FractalGlass } from "../../app/component/brand/stylex/fractal-glass"

const media = new EventTarget() as MediaQueryList
Object.defineProperty(media, "matches", { configurable: true, value: false, writable: true })

const getContext = vi.fn()
const videoPlay = vi.fn().mockResolvedValue(undefined)
const videoPause = vi.fn()
const videoLoad = vi.fn()

const three = vi.hoisted(() => {
  const state = {
    dispose: vi.fn(),
    loseContext: vi.fn(),
    render: vi.fn(),
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    textureLoad: vi.fn()
  }
  class Vector2 {
    constructor(
      public x = 0,
      public y = 0
    ) {}
    set(x: number, y: number) {
      this.x = x
      this.y = y
    }
  }
  class Texture {
    image = { naturalWidth: 600, naturalHeight: 400, width: 600, height: 400 }
    dispose = state.dispose
  }
  return {
    state,
    module: {
      WebGLRenderer: class {
        domElement = document.createElement("canvas")
        setPixelRatio = state.setPixelRatio
        setSize = state.setSize
        render = state.render
        dispose = state.dispose
      },
      Scene: class {
        add = vi.fn()
      },
      OrthographicCamera: class {
        position = { z: 0 }
      },
      Vector2,
      Texture,
      TextureLoader: class {
        crossOrigin = ""
        load = state.textureLoad
      },
      VideoTexture: class extends Texture {},
      ShaderMaterial: class {
        dispose = state.dispose
        constructor(_: unknown) {}
      },
      PlaneGeometry: class {
        dispose = state.dispose
        constructor(_: unknown, __: unknown) {}
      },
      Mesh: class {
        constructor(_: unknown, __: unknown) {}
      },
      LinearFilter: "linear",
      ClampToEdgeWrapping: "clamp"
    }
  }
})

vi.mock("three", () => three.module)

const { dispose, loseContext, render: renderScene, setPixelRatio, setSize, textureLoad } = three.state

const resizeObserver = vi.fn()

class ResizeObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()
  constructor(callback: ResizeObserverCallback) {
    resizeObserver.mockImplementation(callback)
  }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  resetWebGLAvailability()
  getContext.mockReset()
  textureLoad.mockReset()
  renderScene.mockReset()
  setSize.mockReset()
  setPixelRatio.mockReset()
  dispose.mockReset()
  loseContext.mockReset()
  resizeObserver.mockReset()
  videoPlay.mockReset()
  videoPlay.mockResolvedValue(undefined)
  videoPause.mockReset()
  videoLoad.mockReset()
  Object.defineProperty(media, "matches", { configurable: true, value: false, writable: true })
})

function stubBrowser({ webgl = false, reducedMotion = false }: { webgl?: boolean; reducedMotion?: boolean } = {}) {
  Object.defineProperty(media, "matches", { configurable: true, value: reducedMotion, writable: true })
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => media)
  )
  vi.stubGlobal("ResizeObserver", ResizeObserverMock)
  vi.stubGlobal("devicePixelRatio", 1)
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 17)
  )
  vi.stubGlobal("cancelAnimationFrame", vi.fn())
  getContext.mockImplementation((kind: string) =>
    kind === "webgl2" && webgl ? ({ getExtension: () => ({ loseContext }) } as unknown as RenderingContext) : null
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(getContext)
}

test("WebGL support probe caches results, releases its temporary context, and treats probe errors as unsupported", () => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => ({ getExtension: () => ({ loseContext }) }) as unknown as RenderingContext
  )
  expect(supportsWebGL()).toBe(true)
  expect(loseContext).toHaveBeenCalledOnce()
  expect(supportsWebGL()).toBe(true)
  expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledOnce()

  resetWebGLAvailability()
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => {
    throw new Error("WebGL probe failed")
  })
  expect(supportsWebGL()).toBe(false)
})

test("WebGLSurface retains its fallback if an enhanced child throws", () => {
  stubBrowser({ webgl: true })
  const Throw = () => {
    throw new Error("surface failure")
  }
  const error = vi.spyOn(console, "error").mockImplementation(() => {})
  render(
    <WebGLSurface imageSrc="https://example.test/fallback.png" label="Fallback image">
      <Throw />
    </WebGLSurface>
  )

  expect(screen.getByRole("img", { name: "Fallback image" })).toBeTruthy()
  expect(document.querySelector('[data-slot="webgl-surface-error-fallback"]')).not.toBeNull()
  error.mockRestore()
})

test("FractalGlass renders an accessible static fallback when WebGL is unavailable", () => {
  stubBrowser()
  render(<FractalGlass imageSrc="https://example.test/hero.png" className="caller" style={{ height: 320 }} />)

  const fallback = screen.getByRole("img", { name: "Bridge UI refracted glass image" })
  expect(fallback.getAttribute("data-slot")).toBe("webgl-surface-fallback")
  expect(fallback.style.backgroundImage).toContain("https://example.test/hero.png")
  const root = document.querySelector('[data-slot="webgl-surface"]') as HTMLDivElement
  expect(root.dataset.supported).toBe("false")
  expect(root.className).toContain("caller")
  expect(root.style.height).toBe("320px")
  expect(document.querySelector('[data-slot="fractal-glass-canvas"]')).toBeNull()
})

test("FractalGlass supports caller label and mounts the image shader when WebGL is available", () => {
  stubBrowser({ webgl: true })
  textureLoad.mockImplementation(
    (
      _: string,
      done: (texture: { image: { naturalWidth: number; naturalHeight: number }; dispose: () => void }) => void
    ) => done({ image: { naturalWidth: 600, naturalHeight: 400 }, dispose })
  )
  const { unmount } = render(<FractalGlass imageSrc="https://example.test/hero.png" label="Invoice backdrop" />)

  expect(screen.getByRole("img", { name: "Invoice backdrop" })).toBeTruthy()
  const root = document.querySelector('[data-slot="webgl-surface"]') as HTMLDivElement
  const canvas = document.querySelector('[data-slot="fractal-glass-canvas"]') as HTMLDivElement
  expect(root.dataset.supported).toBe("true")
  expect(canvas.querySelector("canvas")).not.toBeNull()
  expect(textureLoad).toHaveBeenCalledWith("https://example.test/hero.png", expect.any(Function))
  expect(renderScene).toHaveBeenCalled()
  fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20 })
  resizeObserver([], {} as ResizeObserver)
  unmount()
  expect(cancelAnimationFrame).toHaveBeenCalledWith(17)
  expect(dispose).toHaveBeenCalled()
})

test("FractalGlass honors reduced motion by rendering a static shader frame", () => {
  stubBrowser({ webgl: true, reducedMotion: true })
  textureLoad.mockImplementation(
    (
      _: string,
      done: (texture: { image: { naturalWidth: number; naturalHeight: number }; dispose: () => void }) => void
    ) => done({ image: { naturalWidth: 600, naturalHeight: 400 }, dispose })
  )
  render(<FractalGlass imageSrc="https://example.test/static.png" />)

  expect(document.querySelector('[data-slot="fractal-glass-canvas"]')).not.toBeNull()
  expect(requestAnimationFrame).not.toHaveBeenCalled()
  expect(renderScene).toHaveBeenCalled()
})

test("FractalGlass manages video texture lifecycle and skips autoplay with reduced motion", () => {
  stubBrowser({ webgl: true, reducedMotion: true })
  const createElement = document.createElement.bind(document)
  let video: HTMLVideoElement | undefined
  vi.spyOn(document, "createElement").mockImplementation((name, options) => {
    const element = createElement(name, options)
    if (name === "video") video = element as HTMLVideoElement
    return element
  })
  const { unmount } = render(
    <FractalGlass
      imageSrc="https://example.test/poster.png"
      mediaType="video"
      videoSrc="https://example.test/loop.mp4"
    />
  )

  expect(video).toBeDefined()
  Object.defineProperties(video!, {
    videoWidth: { configurable: true, value: 1280 },
    videoHeight: { configurable: true, value: 720 },
    play: { configurable: true, value: videoPlay },
    pause: { configurable: true, value: videoPause },
    load: { configurable: true, value: videoLoad }
  })
  video!.onloadedmetadata?.(new Event("loadedmetadata"))
  video!.onloadeddata?.(new Event("loadeddata"))
  expect(video!.autoplay).toBe(false)
  expect(videoPlay).not.toHaveBeenCalled()
  unmount()
  expect(videoPause).toHaveBeenCalled()
  expect(videoLoad).toHaveBeenCalled()
})

test("FractalGlass autoplays video when motion is allowed", () => {
  stubBrowser({ webgl: true })
  const createElement = document.createElement.bind(document)
  let video: HTMLVideoElement | undefined
  vi.spyOn(document, "createElement").mockImplementation((name, options) => {
    const element = createElement(name, options)
    if (name === "video") {
      video = element as HTMLVideoElement
      Object.defineProperty(video, "play", { configurable: true, value: videoPlay })
    }
    return element
  })
  render(
    <FractalGlass
      imageSrc="https://example.test/poster.png"
      mediaType="video"
      videoSrc="https://example.test/loop.mp4"
    />
  )

  expect(video).toBeDefined()
  expect(video!.autoplay).toBe(true)
  expect(videoPlay).toHaveBeenCalledOnce()
})

test("FractalGlass disposes an image texture that resolves after unmount", () => {
  stubBrowser({ webgl: true })
  let complete!: (texture: { image: { naturalWidth: number; naturalHeight: number }; dispose: () => void }) => void
  textureLoad.mockImplementation((_: string, done: typeof complete) => {
    complete = done
  })
  const textureDispose = vi.fn()
  const { unmount } = render(<FractalGlass imageSrc="https://example.test/late.png" />)
  unmount()
  complete({ image: { naturalWidth: 600, naturalHeight: 400 }, dispose: textureDispose })
  expect(textureDispose).toHaveBeenCalledOnce()
})

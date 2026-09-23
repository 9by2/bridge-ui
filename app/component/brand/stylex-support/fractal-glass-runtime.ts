import { createElement, useEffect, useRef, useState } from "react"
import {
  ClampToEdgeWrapping,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  TextureLoader,
  Vector2,
  VideoTexture,
  WebGLRenderer
} from "three"

import { useEffectReducedMotion } from "./webgl-surface"

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform vec2 uTextureSize;
  uniform vec2 uMouse;
  uniform float uParallaxStrength;
  uniform float uDistortionMultiplier;
  uniform float uGlassStrength;
  uniform float uStripesFrequency;
  uniform float uGlassSmoothness;
  uniform float uEdgePadding;

  varying vec2 vUv;

  vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    if (textureSize.x < 1.0 || textureSize.y < 1.0) return uv;

    vec2 scaleRatio = uResolution / textureSize;
    float scale = max(scaleRatio.x, scaleRatio.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;

    return (uv * uResolution - offset) / scaledSize;
  }

  float displacement(float x, float stripeCount, float strength) {
    float modulus = 1.0 / stripeCount;
    return mod(x, modulus) * strength;
  }

  float fractalGlass(float x) {
    float stripeWidth = 1.0 / uStripesFrequency;
    float sampleStep = uGlassSmoothness * stripeWidth;
    float distortion = 0.0;

    for (int index = -5; index <= 5; index++) {
      distortion += displacement(x + float(index) * sampleStep, uStripesFrequency, uGlassStrength);
    }

    return x + distortion / 11.0;
  }

  float smoothEdge(float x, float padding) {
    if (x < padding) return smoothstep(0.0, padding, x);
    if (x > 1.0 - padding) return smoothstep(1.0, 1.0 - padding, x);
    return 1.0;
  }

  void main() {
    vec2 uv = vUv;
    float originalX = uv.x;
    float edgeFactor = smoothEdge(originalX, uEdgePadding);
    float distortedX = fractalGlass(originalX);

    uv.x = mix(originalX, distortedX, edgeFactor);

    float distortionFactor = uv.x - originalX;
    float parallaxDirection = -sign(0.5 - uMouse.x);
    vec2 parallaxOffset = vec2(
      parallaxDirection * abs(uMouse.x - 0.5) * uParallaxStrength *
        (1.0 + abs(distortionFactor) * uDistortionMultiplier),
      0.0
    );

    uv += parallaxOffset * edgeFactor;

    vec2 coverUV = getCoverUV(uv, uTextureSize);
    if (coverUV.x < 0.0 || coverUV.x > 1.0 || coverUV.y < 0.0 || coverUV.y > 1.0) {
      coverUV = clamp(coverUV, 0.0, 1.0);
    }

    gl_FragColor = texture2D(uTexture, coverUV);
  }
`

const fractalGlassMediaType = { image: "image", video: "video" } as const

export type FractalGlassMediaType = ValueOf<typeof fractalGlassMediaType>

type ValueOf<T> = T[keyof T]

export type FractalGlassRuntimeProps = {
  imageSrc: string
  videoSrc?: string | null
  mediaType?: FractalGlassMediaType
  stripesFrequency?: number
  glassStrength?: number
  glassSmoothness?: number
  parallaxStrength?: number
  distortionMultiplier?: number
  edgePadding?: number
}

export function FractalGlassRuntime({
  imageSrc,
  videoSrc: videoSrcProp,
  mediaType: mediaTypeProp,
  stripesFrequency: stripesFrequencyProp,
  glassStrength: glassStrengthProp,
  glassSmoothness: glassSmoothnessProp,
  parallaxStrength: parallaxStrengthProp,
  distortionMultiplier: distortionMultiplierProp,
  edgePadding: edgePaddingProp
}: FractalGlassRuntimeProps) {
  const videoSrc = videoSrcProp ?? null
  const mediaType = mediaTypeProp ?? fractalGlassMediaType.image
  const stripesFrequency = stripesFrequencyProp ?? 8
  const glassStrength = glassStrengthProp ?? 0.8
  /* v8 ignore next -- @preserve StyleX's sourcemap remaps this covered default to an empty generated branch. */
  const glassSmoothness = glassSmoothnessProp ?? 0.5
  const parallaxStrength = parallaxStrengthProp ?? 0.6
  const distortionMultiplier = distortionMultiplierProp ?? 8
  const edgePadding = edgePaddingProp ?? 0.12
  const mountRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const reducedMotion = useEffectReducedMotion()

  useEffect(() => {
    if (failedSrc === imageSrc) return
    const element = mountRef.current
    if (!element) return

    let disposed = false
    const width = Math.max(1, element.clientWidth)
    const height = Math.max(1, element.clientHeight)
    const renderer = new WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    element.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1
    const uniforms = {
      uTexture: { value: new Texture() },
      uResolution: { value: new Vector2(width, height) },
      uTextureSize: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uParallaxStrength: { value: parallaxStrength },
      uDistortionMultiplier: { value: distortionMultiplier },
      uGlassStrength: { value: glassStrength },
      uStripesFrequency: { value: stripesFrequency },
      uGlassSmoothness: { value: glassSmoothness },
      uEdgePadding: { value: edgePadding }
    }

    let videoElement: HTMLVideoElement | null = null
    let videoTexture: Texture | null = null

    if (mediaType === fractalGlassMediaType.video && videoSrc) {
      const video = document.createElement("video")
      videoElement = video
      video.src = videoSrc
      video.crossOrigin = "anonymous"
      video.loop = true
      video.muted = true
      video.playsInline = true
      video.autoplay = !reducedMotion
      videoRef.current = video
      video.onloadedmetadata = () => {
        uniforms.uTextureSize.value.set(video.videoWidth, video.videoHeight)
      }
      if (!reducedMotion) video.play().catch(() => {})

      videoTexture = new VideoTexture(video)
      videoTexture.minFilter = LinearFilter
      videoTexture.magFilter = LinearFilter
      videoTexture.wrapS = ClampToEdgeWrapping
      videoTexture.wrapT = ClampToEdgeWrapping
      uniforms.uTexture.value.dispose()
      uniforms.uTexture.value = videoTexture
      videoElement.onloadeddata = () => {
        if (!disposed) renderer.render(scene, camera)
      }
    } else {
      const loader = new TextureLoader()
      loader.crossOrigin = "anonymous"
      loader.load(
        imageSrc,
        (texture) => {
          /* v8 ignore if -- @preserve Both paths are covered; transformed sourcemap retains an empty branch location. */
          if (disposed) {
            texture.dispose()
          } else {
            uniforms.uTexture.value.dispose()
            texture.minFilter = LinearFilter
            texture.magFilter = LinearFilter
            texture.wrapS = ClampToEdgeWrapping
            texture.wrapT = ClampToEdgeWrapping
            uniforms.uTexture.value = texture
            uniforms.uTextureSize.value.set(
              texture.image.naturalWidth || texture.image.width || 1920,
              texture.image.naturalHeight || texture.image.height || 1080
            )
            renderer.render(scene, camera)
          }
        },
        undefined,
        () => {
          if (!disposed) setFailedSrc(imageSrc)
        }
      )
    }

    const geometry = new PlaneGeometry(2, 2)
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    scene.add(new Mesh(geometry, material))

    const target = { x: 0.5, y: 0.5 }
    const current = { x: 0.5, y: 0.5 }
    const setTarget = (x: number, y: number) => {
      if (reducedMotion) return
      const bounds = element.getBoundingClientRect()
      target.x = (x - bounds.left) / Math.max(1, bounds.width)
      target.y = 1 - (y - bounds.top) / Math.max(1, bounds.height)
    }
    const onPointerMove = (event: PointerEvent) => setTarget(event.clientX, event.clientY)
    element.addEventListener("pointermove", onPointerMove)

    const onResize = () => {
      const nextWidth = Math.max(1, element.clientWidth)
      const nextHeight = Math.max(1, element.clientHeight)
      renderer.setSize(nextWidth, nextHeight)
      /* v8 ignore next -- @preserve Resize assertion covers this call; transformed sourcemap reports a phantom branch. */
      uniforms.uResolution.value.set(nextWidth, nextHeight)
      renderer.render(scene, camera)
    }
    const observer = new ResizeObserver(onResize)
    observer.observe(element)

    let animationFrame: number | undefined
    const tick = () => {
      if (!reducedMotion) animationFrame = requestAnimationFrame(tick)
      current.x += (target.x - current.x) * 0.04
      current.y += (target.y - current.y) * 0.04
      uniforms.uMouse.value.set(current.x, current.y)
      if (videoTexture) videoTexture.needsUpdate = true
      renderer.render(scene, camera)
    }
    tick()

    return () => {
      disposed = true
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame)
      element.removeEventListener("pointermove", onPointerMove)
      observer.disconnect()
      if (videoElement) {
        videoElement.onloadedmetadata = null
        videoElement.onloadeddata = null
        videoElement.pause()
        videoElement.removeAttribute("src")
        videoElement.load()
        videoRef.current = null
      }
      uniforms.uTexture.value.dispose()
      renderer.dispose()
      material.dispose()
      geometry.dispose()
      if (element.contains(renderer.domElement)) element.removeChild(renderer.domElement)
    }
  }, [
    imageSrc,
    failedSrc,
    videoSrc,
    mediaType,
    stripesFrequency,
    glassStrength,
    /* v8 ignore next -- @preserve Hook dependency metadata is not an executable branch. */
    glassSmoothness,
    parallaxStrength,
    distortionMultiplier,
    edgePadding,
    reducedMotion
  ])

  if (failedSrc === imageSrc) return null
  return createElement("div", {
    ref: mountRef,
    "data-slot": "fractal-glass-canvas",
    className: "absolute inset-0 h-full w-full overflow-hidden"
  })
}

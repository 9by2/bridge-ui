import * as stylex from "@stylexjs/stylex"
import { useEffect, useRef, type CSSProperties } from "react"
import * as THREE from "three"

import { WebGLSurface, useEffectReducedMotion } from "../stylex-support/webgl-surface"

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

const style = stylex.create({
  canvas: { position: "absolute", inset: 0, height: "100%", width: "100%", overflow: "hidden" }
})

const fractalGlassMediaType = { image: "image", video: "video" } as const

export type FractalGlassMediaType = ValueOf<typeof fractalGlassMediaType>

type ValueOf<T> = T[keyof T]

type GlassStripParallaxProps = {
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

function GlassStripParallax({
  imageSrc,
  videoSrc = null,
  mediaType = fractalGlassMediaType.image,
  stripesFrequency = 8,
  glassStrength = 0.8,
  glassSmoothness = 0.5,
  parallaxStrength = 0.6,
  distortionMultiplier = 8,
  edgePadding = 0.12
}: GlassStripParallaxProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reducedMotion = useEffectReducedMotion()

  useEffect(() => {
    const element = mountRef.current
    if (!element) return

    let disposed = false
    const width = Math.max(1, element.clientWidth)
    const height = Math.max(1, element.clientHeight)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    element.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1
    const uniforms = {
      uTexture: { value: new THREE.Texture() },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTextureSize: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uParallaxStrength: { value: parallaxStrength },
      uDistortionMultiplier: { value: distortionMultiplier },
      uGlassStrength: { value: glassStrength },
      uStripesFrequency: { value: stripesFrequency },
      uGlassSmoothness: { value: glassSmoothness },
      uEdgePadding: { value: edgePadding }
    }

    let videoElement: HTMLVideoElement | null = null
    let videoTexture: THREE.Texture | null = null

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

      videoTexture = new THREE.VideoTexture(video)
      videoTexture.minFilter = THREE.LinearFilter
      videoTexture.magFilter = THREE.LinearFilter
      videoTexture.wrapS = THREE.ClampToEdgeWrapping
      videoTexture.wrapT = THREE.ClampToEdgeWrapping
      uniforms.uTexture.value.dispose()
      uniforms.uTexture.value = videoTexture
      videoElement.onloadeddata = () => {
        if (!disposed) renderer.render(scene, camera)
      }
    } else {
      const loader = new THREE.TextureLoader()
      loader.crossOrigin = "anonymous"
      loader.load(imageSrc, (texture) => {
        if (disposed) {
          texture.dispose()
          return
        }
        uniforms.uTexture.value.dispose()
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        uniforms.uTexture.value = texture
        uniforms.uTextureSize.value.set(
          texture.image.naturalWidth || texture.image.width || 1920,
          texture.image.naturalHeight || texture.image.height || 1080
        )
        renderer.render(scene, camera)
      })
    }

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms })
    scene.add(new THREE.Mesh(geometry, material))

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
    videoSrc,
    mediaType,
    stripesFrequency,
    glassStrength,
    glassSmoothness,
    parallaxStrength,
    distortionMultiplier,
    edgePadding,
    reducedMotion
  ])

  return (
    <div ref={mountRef} data-slot="fractal-glass-canvas" className="absolute inset-0 h-full w-full overflow-hidden" />
  )
}

export type FractalGlassProps = GlassStripParallaxProps & {
  className?: string
  style?: CSSProperties
  label?: string
}

/**
 * A shader-driven refracted-glass image/video surface. `imageSrc` supplies
 * both the WebGL texture for image media and the always-available accessible
 * static fallback; caller media selection, copy, and layout remain external.
 */
export function FractalGlass({
  imageSrc,
  className,
  style: styleProp,
  label = "Bridge UI refracted glass image",
  ...props
}: FractalGlassProps) {
  return (
    <WebGLSurface className={className} style={styleProp} imageSrc={imageSrc} label={label}>
      <GlassStripParallax imageSrc={imageSrc} {...props} />
    </WebGLSurface>
  )
}

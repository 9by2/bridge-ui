import { VideoPlayer } from "@bridge/ui"

// Play affordance must stay visible over any poster brightness, in every theme.
const Poster = { Bright: "#ffffff", Dark: "#000000", Mid: "#808080" } as const

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))" }}>
      {Object.entries(Poster).map(([name, color]) => (
        <VideoPlayer
          key={name}
          title={`${name} poster`}
          playLabel={`Play ${name.toLowerCase()} poster video`}
          embedUrl="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ"
          poster={<div data-poster={name} style={{ width: "100%", height: "100%", backgroundColor: color }} />}
        />
      ))}
    </div>
  )
}

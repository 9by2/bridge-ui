import { VideoPlayer } from "@bridge/ui"

export default function Example() {
  return (
    <VideoPlayer
      title="Sample video"
      playLabel="Play sample video"
      embedUrl="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ"
      variant="minimal"
    />
  )
}

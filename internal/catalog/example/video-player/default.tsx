import { VideoPlayer, YouTubeThumbnail } from "@bridge/ui"

export default function Example() {
  return (
    <VideoPlayer
      title="Sample video"
      playLabel="Play sample video"
      embedUrl="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ"
      poster={<YouTubeThumbnail videoId="aqz-KE-bpKQ" alt="" width={1280} height={720} />}
    />
  )
}

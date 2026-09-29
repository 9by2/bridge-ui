import { YouTubeThumbnail } from "@bridge/ui"

export default function Example() {
  return (
    <YouTubeThumbnail
      videoId="aqz-KE-bpKQ"
      alt="Video cover"
      width={1280}
      height={720}
      style={{ maxWidth: "20rem", height: "auto" }}
    />
  )
}

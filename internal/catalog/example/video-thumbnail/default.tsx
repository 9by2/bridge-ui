import { VideoThumbnail } from "@bridge/ui"

// The application builds provider URLs; the component only walks the ordered candidates.
const videoId = "aqz-KE-bpKQ"

export default function Example() {
  return (
    <VideoThumbnail
      src={[`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`, `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`]}
      placeholderMaxSize={{ width: 120, height: 90 }}
      alt="Video cover"
      width={1280}
      height={720}
      style={{ maxWidth: "20rem", height: "auto" }}
    />
  )
}

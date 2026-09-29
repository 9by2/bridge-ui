import { VideoThumbnail } from "@bridge/ui"

export default function Example() {
  return (
    <VideoThumbnail
      src={["https://placehold.co/missing-image-404", "https://placehold.co/640x360?text=Fallback+poster"]}
      alt="Poster falls back to the second candidate"
      width={640}
      height={360}
      style={{ maxWidth: "20rem", height: "auto" }}
    />
  )
}

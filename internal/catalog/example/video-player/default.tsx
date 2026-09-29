import { VideoPlayer, VideoThumbnail } from "@bridge/ui"

export default function Example() {
  return (
    <VideoPlayer
      title="Sample video"
      playLabel="Play sample video"
      embedUrl="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ"
      poster={
        <VideoThumbnail
          src={[
            "https://i.ytimg.com/vi/aqz-KE-bpKQ/maxresdefault.jpg",
            "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg"
          ]}
          placeholderMaxSize={{ width: 120, height: 90 }}
          alt=""
          width={1280}
          height={720}
        />
      }
    />
  )
}

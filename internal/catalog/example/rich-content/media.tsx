import { RichContent } from "@bridge/ui"

export default function Example() {
  return (
    <RichContent
      labels={{ playVideo: "Play video" }}
      content={[
        {
          type: "image",
          src: "https://placehold.co/1200x800",
          alt: "Placeholder landscape",
          width: 1200,
          height: 800,
          sizes: "(min-width: 1024px) 50rem, 100vw",
          sourceSet: [
            { url: "https://placehold.co/480x320", width: 480 },
            { url: "https://placehold.co/960x640", width: 960 },
            { url: "https://placehold.co/1200x800", width: 1200 }
          ]
        },
        { type: "image", src: "https://placehold.co/480x320", alt: "Left aligned", align: "left", displayWidth: "30%" },
        { type: "image", src: "https://placehold.co/480x320", alt: "Right aligned", align: "right", displayWidth: 200 },
        { type: "video", embedUrl: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ", title: "Big Buck Bunny" }
      ]}
    />
  )
}

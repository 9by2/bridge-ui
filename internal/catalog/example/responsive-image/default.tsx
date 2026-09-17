import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ResponsiveImage
      alt="Example cover"
      src="https://placehold.co/720x400"
      sourceSet={[{ srcSet: "https://placehold.co/480x320", media: "(max-width: 640px)" }]}
    />
  )
}

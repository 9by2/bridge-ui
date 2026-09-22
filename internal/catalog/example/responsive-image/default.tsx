import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.ResponsiveImage
      alt="Example cover"
      src="https://placehold.co/720x400"
      sizes="(max-width: 640px) 100vw, 720px"
      className="h-auto w-full max-w-[720px] resize overflow-auto rounded border"
      sourceSet={[
        { srcSet: "https://placehold.co/480x320", media: "(max-width: 640px)", sizes: "100vw" },
        { srcSet: "https://placehold.co/720x400", media: "(min-width: 641px)", sizes: "720px" }
      ]}
    />
  )
}

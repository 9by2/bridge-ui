import * as UI from "@bridge/ui"

const blur =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"><rect width="4" height="3" fill="#94a3b8"/></svg>'
  )
const fallback =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 200"><rect width="360" height="200" fill="#e2e8f0"/><text x="180" y="108" font-family="sans-serif" font-size="16" text-anchor="middle" fill="#475569">Fallback image</text></svg>'
  )

export default function Example() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <figure className="grid gap-2">
        <UI.ResponsiveImage
          alt="Missing venue photo"
          src="/missing-venue.png"
          fallbackSrc={fallback}
          className="aspect-[9/5] w-full rounded border object-cover"
        />
        <figcaption className="text-xs text-muted-foreground">Broken src swaps once to fallbackSrc.</figcaption>
      </figure>
      <figure className="grid gap-2">
        <UI.ResponsiveImage
          alt="Venue cover"
          src="https://placehold.co/720x400"
          placeholder={{ blurDataUrl: blur }}
          className="aspect-[9/5] w-full rounded border object-cover"
        />
        <figcaption className="text-xs text-muted-foreground">Blur placeholder until the image loads.</figcaption>
      </figure>
    </div>
  )
}

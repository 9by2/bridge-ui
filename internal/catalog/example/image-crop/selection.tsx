import { useState } from "react"
import { centerCrop, makeAspectCrop, type PercentCrop } from "react-image-crop"

import { ImageCrop } from "@bridge/ui"

const preview = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 480"><rect width="720" height="480" fill="#dbeafe"/><circle cx="360" cy="215" r="96" fill="#93c5fd"/><path d="M165 480c25-125 115-190 195-190s170 65 195 190" fill="#60a5fa"/><text x="360" y="64" text-anchor="middle" fill="#1e3a8a" font-family="sans-serif" font-size="28">Profile crop preview</text></svg>'
)}`

export default function Example() {
  const [crop, setCrop] = useState<PercentCrop>()
  return (
    <div className="w-full max-w-2xl">
      <ImageCrop crop={crop} aspect={1} circularCrop ruleOfThirds onChange={(_, percentCrop) => setCrop(percentCrop)}>
        <img
          src={preview}
          width={720}
          height={480}
          alt="Profile crop preview"
          onLoad={(event) => {
            const { naturalWidth, naturalHeight } = event.currentTarget
            setCrop(
              centerCrop(
                makeAspectCrop({ unit: "%", width: 60 }, 1, naturalWidth, naturalHeight),
                naturalWidth,
                naturalHeight
              )
            )
          }}
        />
      </ImageCrop>
    </div>
  )
}

import * as UI from "@bridge/ui"

const item = [
  { title: "Audit", description: "Review reusable presentation and remove product coupling.", state: "completed" },
  { title: "Package", description: "สร้างสัญญา StyleX ที่ทุกแอปพลิเคชันใช้ร่วมกันได้", state: "current" },
  { title: "Integrate", description: "Adopt the release through an application facade.", state: "upcoming" }
] as const

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 32 }}>
      <UI.TimelineStep aria-label="Centralization progress">
        {item.map((value, index) => (
          <UI.TimelineStepItem key={value.title} state={value.state}>
            <UI.TimelineStepHeader>
              <UI.TimelineStepIndicator tone={value.state === "completed" ? "primary" : "outline"}>
                {index + 1}
              </UI.TimelineStepIndicator>
              <UI.TimelineStepTitle>{value.title}</UI.TimelineStepTitle>
            </UI.TimelineStepHeader>
            {index < item.length - 1 ? <UI.TimelineStepConnector state={value.state} /> : null}
            <UI.TimelineStepContent>
              <UI.TimelineStepDescription>{value.description}</UI.TimelineStepDescription>
              <UI.TimelineStepTime dateTime={`2026-09-${17 + index}`}>September {17 + index}</UI.TimelineStepTime>
            </UI.TimelineStepContent>
          </UI.TimelineStepItem>
        ))}
      </UI.TimelineStep>
      <UI.TimelineStep orientation="horizontal" aria-label="Horizontal release progress">
        {item.map((value, index) => (
          <UI.TimelineStepItem key={value.title} orientation="horizontal" state={value.state}>
            <UI.TimelineStepHeader>
              <UI.TimelineStepIndicator size="small" tone={value.state === "completed" ? "primary" : "outline"}>
                {index + 1}
              </UI.TimelineStepIndicator>
              <UI.TimelineStepTitle>{value.title}</UI.TimelineStepTitle>
            </UI.TimelineStepHeader>
            {index < item.length - 1 ? (
              <UI.TimelineStepConnector orientation="horizontal" treatment="dashed" state={value.state} />
            ) : null}
          </UI.TimelineStepItem>
        ))}
      </UI.TimelineStep>
    </div>
  )
}

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 24 }}>
      <UI.FlipText duration={1.4}>Staggered character motion</UI.FlipText>
      <UI.FlipText together delay={0.2} loop={false}>
        One-time synchronized motion
      </UI.FlipText>
      <UI.FlipText separator="">กำลังตรวจสอบ 👍🏽</UI.FlipText>
      <UI.FlipText separator="-">package-ready</UI.FlipText>
    </div>
  )
}

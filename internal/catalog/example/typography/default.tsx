import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <UI.Heading as={UI.WAIHeading.H1}>Page heading</UI.Heading>
      <UI.Heading as={UI.WAIHeading.H2}>Section heading</UI.Heading>
      <UI.Heading as={UI.WAIHeading.H3}>Subsection heading</UI.Heading>
      <UI.Heading>Default heading</UI.Heading>
      <UI.TypographyLabel>Inline label</UI.TypographyLabel>
      <UI.Body>Supporting body text follows the compact Cue reading rhythm.</UI.Body>
    </div>
  )
}

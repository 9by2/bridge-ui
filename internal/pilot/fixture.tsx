import * as stylex from "@stylexjs/stylex"
import { useState } from "react"

import { Button } from "./button"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog"
import { Field, FieldError, FieldLabel } from "./field"
import { Input } from "./input"
import { Theme } from "./theme"
import { token } from "./token.stylex"

const style = stylex.create({
  surface: { backgroundColor: token.background, minHeight: "100vh", padding: 24, boxSizing: "border-box" }
})

export function Fixture({ mode = "light" }: { mode?: "light" | "dark" }) {
  const [submitted, setSubmitted] = useState(false)
  return (
    <Theme mode={mode}>
      <main {...stylex.props(style.surface)}>
        <h1>Private StyleX pilot</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
          }}>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" name="name" required placeholder="Your name" />
            <FieldError>{submitted ? "Saved locally" : null}</FieldError>
          </Field>
          <Button type="submit">Save</Button>
        </form>
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>Open preference</DialogTrigger>
          <DialogContent>
            <DialogTitle>Preference</DialogTitle>
            <DialogDescription>This portal inherits the local theme.</DialogDescription>
            <Input aria-label="Preference" />
          </DialogContent>
        </Dialog>
        <Button disabled>Disabled</Button>
      </main>
    </Theme>
  )
}

import type { ComponentProps } from "react"
import { useState } from "react"

import { Button as BaselineButton } from "@bridge/ui/button"
import * as baselineDialog from "@bridge/ui/component/shadcn/dialog"
import * as baselineField from "@bridge/ui/component/shadcn/field"
import { Input as BaselineInput } from "@bridge/ui/component/shadcn/input"

import { Button as CandidateButton } from "./button"
import * as candidateDialog from "./dialog"
import * as candidateField from "./field"
import { Input as CandidateInput } from "./input"
import { Theme } from "./theme"

export function Comparison({ candidate, mode }: { candidate: boolean; mode: "light" | "dark" }) {
  const Button = candidate ? CandidateButton : BaselineButton
  const Input = candidate ? CandidateInput : BaselineInput
  const { Field, FieldLabel, FieldDescription, FieldError } = candidate ? candidateField : baselineField
  const { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } = candidate
    ? candidateDialog
    : baselineDialog
  const [value, setValue] = useState("")
  const content = (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.5, margin: "0 0 16px" }}>Pilot comparison</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
        {(
          ["default", "outline", "secondary", "ghost", "destructive", "link"] satisfies ComponentProps<
            typeof CandidateButton
          >["variant"][]
        ).map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <Field>
          <FieldLabel htmlFor="comparison-name">Name / ชื่อ</FieldLabel>
          <Input
            id="comparison-name"
            required
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Enter a name"
          />
          <FieldDescription>Identical copy, viewport and interaction for both implementations.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="comparison-invalid">Invalid</FieldLabel>
          <Input id="comparison-invalid" aria-invalid aria-describedby="comparison-error" />
          <FieldError id="comparison-error">Enter a valid value</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="comparison-disabled">Disabled</FieldLabel>
          <Input id="comparison-disabled" disabled />
        </Field>
        <Button type="submit">Submit</Button>
      </form>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>Open comparison dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Review preference</DialogTitle>
          <DialogDescription>
            Long copy wraps inside the same constrained dialog. Review this content before closing.
          </DialogDescription>
          <Input aria-label="Dialog value" />
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </main>
  )
  return candidate ? <Theme mode={mode}>{content}</Theme> : content
}

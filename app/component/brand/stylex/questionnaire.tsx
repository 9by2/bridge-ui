import { Questionnaire as Primitive } from "@shadcn/react/questionnaire"
import * as stylex from "@stylexjs/stylex"
import { CheckIcon } from "lucide-react"
import type { ComponentProps } from "react"

import { buttonVariants, type Button } from "./button"
import { inputStyle } from "./input"
import { token } from "./token.stylex"

const style = stylex.create({
  root: { display: "flex", width: "100%", minWidth: 0, flexDirection: "column", gap: 16 },
  progress: {
    minHeight: "1lh",
    width: "fit-content",
    minWidth: "14ch",
    fontSize: "var(--bridge-font-size-sm, 0.75em)",
    lineHeight: "16px",
    fontWeight: 500,
    color: token.mutedForeground,
    fontVariantNumeric: "tabular-nums"
  },
  item: {
    display: "flex",
    minWidth: 0,
    flexDirection: "column",
    gap: 16,
    borderWidth: 0,
    padding: 0,
    margin: 0,
    outline: "none"
  },
  title: {
    fontFamily: "inherit",
    fontSize: "var(--bridge-font-size-lg, 1em)",
    lineHeight: 1.375,
    fontWeight: 500,
    textWrap: "pretty",
    margin: 0,
    marginBottom: { default: 0, ':not(:has(~ [data-slot="questionnaire-description"]))': 16 }
  },
  description: { margin: 0, fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", textWrap: "pretty", color: token.mutedForeground },
  choices: { display: "grid", minWidth: 0, gap: 8 },
  choice: {
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    minHeight: 44,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    alignItems: "start",
    gap: 10,
    borderRadius: "var(--bridge-radius-10, 0.625em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: {
      default: token.input,
      ":has(> input:focus-visible)": token.ring,
      ":is([data-invalid])": token.destructive,
      ":is([data-checked])": `color-mix(in oklch, ${token.primary}, transparent 60%)`
    },
    backgroundColor: {
      default: token.inputBackground,
      ":hover": `color-mix(in oklch, ${token.muted}, transparent 50%)`,
      ":is([data-checked])": token.muted
    },
    paddingInline: 12,
    paddingBlock: 10,
    textAlign: "start",
    fontSize: "var(--bridge-font-size-base, 0.875em)",
    lineHeight: "20px",
    transitionProperty: "color, background-color, border-color",
    transitionDuration: "150ms",
    outline: "none",
    userSelect: "none",
    boxShadow: {
      default: "none",
      ":has(> input:focus-visible)": `0 0 0 3px color-mix(in oklch, ${token.ring}, transparent 50%)`
    },
    pointerEvents: { default: "auto", ":is([data-disabled])": "none" },
    opacity: { default: 1, ":is([data-disabled])": 0.5 }
  },
  choiceInput: {
    position: "absolute",
    inset: 0,
    zIndex: 10,
    width: "100%",
    height: "100%",
    cursor: "pointer",
    opacity: 0,
    margin: 0
  },
  indicator: {
    pointerEvents: "none",
    position: "relative",
    boxSizing: "border-box",
    display: "flex",
    width: 16,
    height: 16,
    flexShrink: 0,
    translate: "0 1.8px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: { default: 4, [stylex.when.ancestor('[data-type="radio"]')]: 9999 },
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: { default: token.input, [stylex.when.ancestor("[data-checked]")]: token.primary },
    backgroundColor: { default: token.inputBackground, [stylex.when.ancestor("[data-checked]")]: token.primary },
    color: token.primaryForeground
  },
  dot: {
    display: { default: "none", [stylex.when.ancestor(':is([data-checked][data-type="radio"])')]: "block" },
    width: 8,
    height: 8,
    borderRadius: "var(--bridge-radius-9999, 9999em)",
    backgroundColor: token.primaryForeground
  },
  check: {
    display: { default: "none", [stylex.when.ancestor(':is([data-checked][data-type="checkbox"])')]: "block" },
    width: 14,
    height: 14
  },
  choiceLabel: { display: "flex", minWidth: 0, flex: 1, flexDirection: "column", gap: 2, lineHeight: 1.375 },
  shortcut: {
    pointerEvents: "none",
    marginInlineStart: "auto",
    display: { default: "none", [stylex.when.ancestor("[data-shortcut]")]: "inline-flex" },
    width: 20,
    height: 20,
    flexShrink: 0,
    translate: "0 1.8px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--bridge-radius-8, 0.5em)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: token.input,
    backgroundColor: token.background,
    fontFamily: "monospace",
    fontSize: "var(--bridge-font-size-2xs, 0.625em)",
    lineHeight: 1,
    fontWeight: 500,
    color: token.mutedForeground
  },
  muted: { color: token.mutedForeground },
  wrapper: { position: "relative", width: "100%", minWidth: 0 },
  input: { minHeight: { default: 44, "@media (min-width: 640px)": 0 } },
  error: { marginTop: 8, fontSize: "var(--bridge-font-size-base, 0.875em)", lineHeight: "20px", color: token.errorText },
  actions: {
    display: "grid",
    minHeight: { default: 44, "@media (min-width: 640px)": 32 },
    width: "100%",
    gridTemplateColumns: "minmax(0, 1fr) auto auto",
    alignItems: "center",
    gap: 8
  },
  action: { gridRowStart: 1, minHeight: { default: 44, "@media (min-width: 640px)": 0 }, justifySelf: "end" },
  previous: { gridColumnStart: 1, justifySelf: "start" },
  skip: { gridColumnStart: 2 },
  next: { gridColumnStart: 3 }
})
export function Questionnaire({ className, ...props }: ComponentProps<typeof Primitive.Root>) {
  return (
    <Primitive.Root
      data-slot="questionnaire"
      {...props}
      className={[stylex.props(style.root).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireProgress({ className, ...props }: ComponentProps<typeof Primitive.Progress>) {
  return (
    <Primitive.Progress
      data-slot="questionnaire-progress"
      {...props}
      className={[stylex.props(style.progress).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireItem({ className, ...props }: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      data-slot="questionnaire-item"
      {...props}
      className={[stylex.props(style.item).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireTitle({ className, ...props }: ComponentProps<typeof Primitive.Title>) {
  return (
    <Primitive.Title
      data-slot="questionnaire-title"
      {...props}
      className={[stylex.props(style.title).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireDescription({ className, ...props }: ComponentProps<typeof Primitive.Description>) {
  return (
    <Primitive.Description
      data-slot="questionnaire-description"
      {...props}
      className={[stylex.props(style.description).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireChoices({ className, ...props }: ComponentProps<typeof Primitive.Choices>) {
  return (
    <Primitive.Choices
      data-slot="questionnaire-choices"
      {...props}
      className={[stylex.props(style.choices).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireChoice({ children, className, ...props }: ComponentProps<typeof Primitive.Choice>) {
  return (
    <Primitive.Choice
      data-slot="questionnaire-choice"
      {...props}
      className={[stylex.props(stylex.defaultMarker(), style.choice).className, className].filter(Boolean).join(" ")}>
      <Primitive.ChoiceInput data-slot="questionnaire-choice-input" {...stylex.props(style.choiceInput)} />
      <span aria-hidden="true" data-slot="questionnaire-choice-indicator" {...stylex.props(style.indicator)}>
        <span data-slot="questionnaire-choice-indicator-dot" {...stylex.props(style.dot)} />
        <CheckIcon data-slot="questionnaire-choice-indicator-check" {...stylex.props(style.check)} />
      </span>
      <Primitive.ChoiceLabel data-slot="questionnaire-choice-label" {...stylex.props(style.choiceLabel)}>
        {children}
      </Primitive.ChoiceLabel>
      <Primitive.ChoiceShortcut data-slot="questionnaire-choice-shortcut" {...stylex.props(style.shortcut)} />
    </Primitive.Choice>
  )
}
export function QuestionnaireChoiceDescription({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      {...props}
      className={[stylex.props(style.muted).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireInput({ className, ...props }: ComponentProps<typeof Primitive.Input>) {
  return (
    <div data-slot="questionnaire-input-wrapper" {...stylex.props(style.wrapper)}>
      <Primitive.Input
        data-slot="questionnaire-input"
        {...props}
        className={[
          stylex.props(
            inputStyle.root,
            style.input,
            (props["aria-invalid"] === true || props["aria-invalid"] === "true") && inputStyle.invalid
          ).className,
          className
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </div>
  )
}
export function QuestionnaireError({ className, ...props }: ComponentProps<typeof Primitive.Error>) {
  return (
    <Primitive.Error
      data-slot="questionnaire-error"
      {...props}
      className={[stylex.props(style.error).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnaireActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      {...props}
      className={[stylex.props(style.actions).className, className].filter(Boolean).join(" ")}
    />
  )
}
export function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: ComponentProps<typeof Primitive.Previous> & Pick<ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <Primitive.Previous
      data-slot="questionnaire-previous"
      data-size={size}
      data-variant={variant}
      {...props}
      className={[buttonVariants({ size, variant }), stylex.props(style.action, style.previous).className, className]
        .filter(Boolean)
        .join(" ")}>
      {children ?? "Previous"}
    </Primitive.Previous>
  )
}
export function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "outline",
  ...props
}: ComponentProps<typeof Primitive.Skip> & Pick<ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <Primitive.Skip
      data-slot="questionnaire-skip"
      data-size={size}
      data-variant={variant}
      {...props}
      className={[buttonVariants({ size, variant }), stylex.props(style.action, style.skip).className, className]
        .filter(Boolean)
        .join(" ")}>
      {children ?? "Skip"}
    </Primitive.Skip>
  )
}
export function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: ComponentProps<typeof Primitive.Next> & Pick<ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <Primitive.Next
      data-slot="questionnaire-next"
      data-size={size}
      data-variant={variant}
      {...props}
      className={[buttonVariants({ size, variant }), stylex.props(style.action, style.next).className, className]
        .filter(Boolean)
        .join(" ")}>
      {children ?? "Next"}
    </Primitive.Next>
  )
}
export function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: ComponentProps<typeof Primitive.Submit> & Pick<ComponentProps<typeof Button>, "size" | "variant">) {
  return (
    <Primitive.Submit
      data-slot="questionnaire-submit"
      data-size={size}
      data-variant={variant}
      {...props}
      className={[buttonVariants({ size, variant }), stylex.props(style.action, style.next).className, className]
        .filter(Boolean)
        .join(" ")}>
      {children ?? "Submit"}
    </Primitive.Submit>
  )
}

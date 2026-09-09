import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import * as UI from "../../internal/pilot/questionnaire"
import {
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireTitle,
  QuestionnaireDescription,
  QuestionnaireChoices,
  QuestionnaireChoice,
  QuestionnaireActions,
  QuestionnaireSubmit
} from "../../internal/pilot/questionnaire"

afterEach(cleanup)
test("questionnaire invalid input composes error ring", () => {
  render(
    <UI.Questionnaire>
      <UI.QuestionnaireItem name="name" invalid>
        <UI.QuestionnaireInput aria-label="Name" aria-invalid="true" />
      </UI.QuestionnaireItem>
    </UI.Questionnaire>
  )
  expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true")
})
test("questionnaire navigation retains callback order and form value", () => {
  const change = vi.fn()
  const { container } = render(
    <UI.Questionnaire onItemChange={change}>
      <UI.QuestionnaireProgress />
      <UI.QuestionnaireItem name="name">
        <UI.QuestionnaireTitle>Name</UI.QuestionnaireTitle>
        <UI.QuestionnaireInput aria-label="Name" />
        <UI.QuestionnaireError>Error</UI.QuestionnaireError>
      </UI.QuestionnaireItem>
      <UI.QuestionnaireItem name="choice">
        <UI.QuestionnaireTitle>Choice</UI.QuestionnaireTitle>
        <UI.QuestionnaireChoices>
          <UI.QuestionnaireChoice value="a">
            A<UI.QuestionnaireChoiceDescription>Copy</UI.QuestionnaireChoiceDescription>
          </UI.QuestionnaireChoice>
        </UI.QuestionnaireChoices>
      </UI.QuestionnaireItem>
      <UI.QuestionnaireActions>
        <UI.QuestionnairePrevious />
        <UI.QuestionnaireSkip />
        <UI.QuestionnaireNext />
        <UI.QuestionnaireSubmit />
      </UI.QuestionnaireActions>
    </UI.Questionnaire>
  )
  fireEvent.change(screen.getByRole("textbox", { name: "Name" }), { target: { value: "Ada" } })
  fireEvent.click(screen.getByRole("button", { name: "Next" }))
  expect(change).toHaveBeenCalledWith("choice")
  expect(new FormData(container.querySelector("form")!).get("name")).toBe("Ada")
  fireEvent.click(screen.getByRole("button", { name: "Previous" }))
  expect(change.mock.calls.at(-1)?.[0]).toBe("name")
})
test("questionnaire retains engine selection", () => {
  render(
    <Questionnaire>
      <QuestionnaireItem name="role">
        <QuestionnaireTitle>Role</QuestionnaireTitle>
        <QuestionnaireDescription>Choose</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="design">Design</QuestionnaireChoice>
          <QuestionnaireChoice value="engineering">Engineering</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
  fireEvent.click(screen.getByRole("radio", { name: "Design" }))
  expect((screen.getByRole("radio", { name: "Design" }) as HTMLInputElement).checked).toBe(true)
})

import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Questionnaire>
      <UI.QuestionnaireItem name="role">
        <UI.QuestionnaireTitle>Which role fits best?</UI.QuestionnaireTitle>
        <UI.QuestionnaireDescription>Select one option.</UI.QuestionnaireDescription>
        <UI.QuestionnaireChoices>
          <UI.QuestionnaireChoice value="design">Design</UI.QuestionnaireChoice>
          <UI.QuestionnaireChoice value="engineering">Engineering</UI.QuestionnaireChoice>
        </UI.QuestionnaireChoices>
      </UI.QuestionnaireItem>
      <UI.QuestionnaireActions>
        <UI.QuestionnaireSubmit />
      </UI.QuestionnaireActions>
    </UI.Questionnaire>
  )
}

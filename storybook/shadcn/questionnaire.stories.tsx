import type { Meta, StoryObj } from "@storybook/react-vite"

import { Questionnaire } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Questionnaire,
  tags: ["autodocs"],
  title: "Shadcn/Questionnaire"
} satisfies Meta<typeof Questionnaire>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="questionnaire" />
}

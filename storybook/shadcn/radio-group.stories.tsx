import type { Meta, StoryObj } from "@storybook/react-vite"

import { RadioGroup } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: RadioGroup,
  tags: ["autodocs"],
  title: "Shadcn/Radio Group"
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="radio-group" />
}

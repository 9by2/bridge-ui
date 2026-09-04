import type { Meta, StoryObj } from "@storybook/react-vite"

import { ButtonGroup } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: ButtonGroup,
  tags: ["autodocs"],
  title: "Shadcn/Button Group"
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="button-group" />
}

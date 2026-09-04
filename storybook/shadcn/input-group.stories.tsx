import type { Meta, StoryObj } from "@storybook/react-vite"

import { InputGroup } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: InputGroup,
  tags: ["autodocs"],
  title: "Shadcn/Input Group"
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="input-group" />
}

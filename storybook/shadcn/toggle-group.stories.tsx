import type { Meta, StoryObj } from "@storybook/react-vite"

import { ToggleGroup } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: ToggleGroup,
  tags: ["autodocs"],
  title: "Shadcn/Toggle Group"
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="toggle-group" />
}

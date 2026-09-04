import type { Meta, StoryObj } from "@storybook/react-vite"

import { Command } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Command,
  tags: ["autodocs"],
  title: "Shadcn/Command"
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="command" />
}

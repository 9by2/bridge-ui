import type { Meta, StoryObj } from "@storybook/react-vite"

import { ContextMenu } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: ContextMenu,
  tags: ["autodocs"],
  title: "Shadcn/Context Menu"
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="context-menu" />
}

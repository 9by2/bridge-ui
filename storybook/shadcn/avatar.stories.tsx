import type { Meta, StoryObj } from "@storybook/react-vite"

import { Avatar } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Avatar,
  tags: ["autodocs"],
  title: "Shadcn/Avatar"
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="avatar" />
}

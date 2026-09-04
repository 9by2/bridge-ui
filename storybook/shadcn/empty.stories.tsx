import type { Meta, StoryObj } from "@storybook/react-vite"

import { Empty } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Empty,
  tags: ["autodocs"],
  title: "Shadcn/Empty"
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="empty" />
}

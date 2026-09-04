import type { Meta, StoryObj } from "@storybook/react-vite"

import { Bubble } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Bubble,
  tags: ["autodocs"],
  title: "Shadcn/Bubble"
} satisfies Meta<typeof Bubble>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="bubble" />
}

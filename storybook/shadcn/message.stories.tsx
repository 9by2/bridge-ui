import type { Meta, StoryObj } from "@storybook/react-vite"

import { Message } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Message,
  tags: ["autodocs"],
  title: "Shadcn/Message"
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="message" />
}

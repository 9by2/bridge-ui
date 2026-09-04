import type { Meta, StoryObj } from "@storybook/react-vite"

import { MessageScroller } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: MessageScroller,
  tags: ["autodocs"],
  title: "Shadcn/Message Scroller"
} satisfies Meta<typeof MessageScroller>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="message-scroller" />
}

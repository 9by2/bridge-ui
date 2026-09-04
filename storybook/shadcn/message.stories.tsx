import type { Meta, StoryObj } from "@storybook/react-vite"

import { Message } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

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

export const Variants: Story = {
  render: () => <VariantFixture name="message" />
}

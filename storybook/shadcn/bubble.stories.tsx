import type { Meta, StoryObj } from "@storybook/react-vite"

import { Bubble } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

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

export const Variants: Story = {
  render: () => <VariantFixture name="bubble" />
}

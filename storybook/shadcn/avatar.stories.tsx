import type { Meta, StoryObj } from "@storybook/react-vite"

import { Avatar } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

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

export const Variants: Story = {
  render: () => <VariantFixture name="avatar" />
}

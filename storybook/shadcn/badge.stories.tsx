import type { Meta, StoryObj } from "@storybook/react-vite"

import { Badge } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: Badge,
  tags: ["autodocs"],
  title: "Shadcn/Badge"
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="badge" />
}

export const Variants: Story = {
  render: () => <VariantFixture name="badge" />
}

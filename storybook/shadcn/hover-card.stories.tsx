import type { Meta, StoryObj } from "@storybook/react-vite"

import { HoverCard } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: HoverCard,
  tags: ["autodocs"],
  title: "Shadcn/Hover Card"
} satisfies Meta<typeof HoverCard>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="hover-card" />
}

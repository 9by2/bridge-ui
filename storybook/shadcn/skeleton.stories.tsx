import type { Meta, StoryObj } from "@storybook/react-vite"

import { Skeleton } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Skeleton,
  tags: ["autodocs"],
  title: "Shadcn/Skeleton"
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="skeleton" />
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Item } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Item,
  tags: ["autodocs"],
  title: "Shadcn/Item"
} satisfies Meta<typeof Item>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="item" />
}

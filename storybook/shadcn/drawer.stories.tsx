import type { Meta, StoryObj } from "@storybook/react-vite"

import { Drawer } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Drawer,
  tags: ["autodocs"],
  title: "Shadcn/Drawer"
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="drawer" />
}

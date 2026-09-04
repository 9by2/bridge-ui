import type { Meta, StoryObj } from "@storybook/react-vite"

import { Menubar } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Menubar,
  tags: ["autodocs"],
  title: "Shadcn/Menubar"
} satisfies Meta<typeof Menubar>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="menubar" />
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import { NavigationMenu } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: NavigationMenu,
  tags: ["autodocs"],
  title: "Shadcn/Navigation Menu"
} satisfies Meta<typeof NavigationMenu>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="navigation-menu" />
}

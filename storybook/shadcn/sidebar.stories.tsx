import type { Meta, StoryObj } from "@storybook/react-vite"

import { SidebarProvider } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: SidebarProvider,
  tags: ["autodocs"],
  title: "Shadcn/Sidebar"
} satisfies Meta<typeof SidebarProvider>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="sidebar" />
}

export const Variants: Story = {
  render: () => <VariantFixture name="sidebar" />
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import { DropdownMenu } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: DropdownMenu,
  tags: ["autodocs"],
  title: "Shadcn/Dropdown Menu"
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="dropdown-menu" />
}

export const Variants: Story = {
  render: () => <VariantFixture name="dropdown-menu" />
}

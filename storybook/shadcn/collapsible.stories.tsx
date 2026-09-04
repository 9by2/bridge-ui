import type { Meta, StoryObj } from "@storybook/react-vite"

import { Collapsible } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Collapsible,
  tags: ["autodocs"],
  title: "Shadcn/Collapsible"
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="collapsible" />
}

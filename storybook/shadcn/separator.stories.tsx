import type { Meta, StoryObj } from "@storybook/react-vite"

import { Separator } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Separator,
  tags: ["autodocs"],
  title: "Shadcn/Separator"
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="separator" />
}

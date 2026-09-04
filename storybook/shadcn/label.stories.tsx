import type { Meta, StoryObj } from "@storybook/react-vite"

import { Label } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Label,
  tags: ["autodocs"],
  title: "Shadcn/Label"
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="label" />
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Card } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Card,
  tags: ["autodocs"],
  title: "Shadcn/Card"
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="card" />
}

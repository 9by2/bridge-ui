import type { Meta, StoryObj } from "@storybook/react-vite"

import { Alert } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Alert,
  tags: ["autodocs"],
  title: "Shadcn/Alert"
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="alert" />
}

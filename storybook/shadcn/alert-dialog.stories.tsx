import type { Meta, StoryObj } from "@storybook/react-vite"

import { AlertDialog } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: AlertDialog,
  tags: ["autodocs"],
  title: "Shadcn/Alert Dialog"
} satisfies Meta<typeof AlertDialog>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="alert-dialog" />
}

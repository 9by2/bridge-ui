import type { Meta, StoryObj } from "@storybook/react-vite"

import { AlertDialog } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

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

export const Variants: Story = {
  render: () => <VariantFixture name="alert-dialog" />
}

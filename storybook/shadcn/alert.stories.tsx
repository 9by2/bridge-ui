import type { Meta, StoryObj } from "@storybook/react-vite"

import { Alert } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

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

export const Variants: Story = {
  render: () => <VariantFixture name="alert" />
}

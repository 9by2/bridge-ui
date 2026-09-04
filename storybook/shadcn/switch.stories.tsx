import type { Meta, StoryObj } from "@storybook/react-vite"

import { Switch } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: Switch,
  tags: ["autodocs"],
  title: "Shadcn/Switch"
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="switch" />
}

export const Variants: Story = {
  render: () => <VariantFixture name="switch" />
}

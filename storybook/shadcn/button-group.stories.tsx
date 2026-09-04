import type { Meta, StoryObj } from "@storybook/react-vite"

import { ButtonGroup } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: ButtonGroup,
  tags: ["autodocs"],
  title: "Shadcn/Button Group"
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="button-group" />
}

export const Variants: Story = {
  render: () => <VariantFixture name="button-group" />
}

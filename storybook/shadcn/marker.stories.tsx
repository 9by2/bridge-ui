import type { Meta, StoryObj } from "@storybook/react-vite"

import { Marker } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: Marker,
  tags: ["autodocs"],
  title: "Shadcn/Marker"
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="marker" />
}

export const Variants: Story = {
  render: () => <VariantFixture name="marker" />
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Slider } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Slider,
  tags: ["autodocs"],
  title: "Shadcn/Slider"
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="slider" />
}

import type { Meta, StoryObj } from "@storybook/react-vite"

import { Carousel } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Carousel,
  tags: ["autodocs"],
  title: "Shadcn/Carousel"
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="carousel" />
}

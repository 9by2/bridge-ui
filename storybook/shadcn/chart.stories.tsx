import type { Meta, StoryObj } from "@storybook/react-vite"

import { ChartContainer } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: ChartContainer,
  tags: ["autodocs"],
  title: "Shadcn/Chart"
} satisfies Meta<typeof ChartContainer>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="chart" />
}

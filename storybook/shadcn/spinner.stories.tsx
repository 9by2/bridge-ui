import type { Meta, StoryObj } from "@storybook/react-vite"

import { Spinner } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Spinner,
  tags: ["autodocs"],
  title: "Shadcn/Spinner"
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="spinner" />
}

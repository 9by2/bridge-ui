import type { Meta, StoryObj } from "@storybook/react-vite"

import { Breadcrumb } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Breadcrumb,
  tags: ["autodocs"],
  title: "Shadcn/Breadcrumb"
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="breadcrumb" />
}

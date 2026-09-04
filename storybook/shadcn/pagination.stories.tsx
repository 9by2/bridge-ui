import type { Meta, StoryObj } from "@storybook/react-vite"

import { Pagination } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Pagination,
  tags: ["autodocs"],
  title: "Shadcn/Pagination"
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="pagination" />
}

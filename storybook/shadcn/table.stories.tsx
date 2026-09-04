import type { Meta, StoryObj } from "@storybook/react-vite"

import { Table } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Table,
  tags: ["autodocs"],
  title: "Shadcn/Table"
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="table" />
}

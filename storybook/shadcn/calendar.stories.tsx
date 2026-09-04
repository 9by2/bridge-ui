import type { Meta, StoryObj } from "@storybook/react-vite"

import { Calendar } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: Calendar,
  tags: ["autodocs"],
  title: "Shadcn/Calendar"
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="calendar" />
}

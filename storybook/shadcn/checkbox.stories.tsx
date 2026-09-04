import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Checkbox } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: Checkbox,
  tags: ["autodocs"],
  title: "Shadcn/Checkbox"
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="checkbox" />,
  play: async ({ canvas, userEvent }) => {
    const checkbox = canvas.getByRole("checkbox", { name: /Accept terms/ })
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
  }
}

export const Variants: Story = {
  render: () => <VariantFixture name="checkbox" />
}

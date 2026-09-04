import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Input } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"
import { VariantFixture } from "./variant-fixture"

const meta = {
  component: Input,
  tags: ["autodocs"],
  title: "Shadcn/Input"
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="input" />,
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox", { name: "Name" })
    await userEvent.type(input, "Bridge")
    await expect(input).toHaveValue("Bridge")
  }
}

export const Variants: Story = {
  render: () => <VariantFixture name="input" />
}

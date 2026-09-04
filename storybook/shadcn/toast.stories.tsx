import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { ToastProvider } from "@bridge/ui"

import { StoryFixture } from "./story-fixture"

const meta = {
  component: ToastProvider,
  tags: ["autodocs"],
  title: "Shadcn/Toast"
} satisfies Meta<typeof ToastProvider>

export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => <StoryFixture name="toast" />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Show toast" }))
    await expect(canvasElement.ownerDocument.body).toHaveTextContent("Saved")
  }
}

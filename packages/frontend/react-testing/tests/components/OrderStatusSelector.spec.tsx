import { render, screen } from "@testing-library/react"
import OrderStatusSelector from "../../src/components/OrderStatusSelector"
import { Theme } from "@radix-ui/themes"
import userEvent from "@testing-library/user-event"

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    const onChange = vi.fn()
    render(
      <Theme>
        <OrderStatusSelector onChange={onChange} />
      </Theme>
    )

    return {
      trigger: screen.getByRole("combobox"),
      user: userEvent.setup(),
      getOptions: async () => await screen.findAllByRole("option"),
      getOption: async (name: RegExp) =>
        await screen.findByRole("option", { name }),
      onChange,
    }
  }

  it("should render New as the default value", () => {
    const { trigger } = renderComponent()
    expect(trigger).toHaveTextContent(/new/i)
  })

  it("should render correct statuses", async () => {
    const { trigger, user, getOptions } = renderComponent()
    await user.click(trigger)

    const options = await getOptions()
    expect(options).toHaveLength(3)
    const labelList = options.map((option) => option.textContent)
    expect(labelList).toEqual(["New", "Processed", "Fulfilled"])
  })

  it.each([
    { label: /processed/i, value: "processed" },
    { label: /fulfilled/i, value: "fulfilled" },
  ])(
    "should call onChange with value $value when the label $label is selected",
    async ({ label, value }) => {
      const { trigger, user, onChange } = renderComponent()
      await user.click(trigger)
      const option = await screen.findByRole("option", { name: label })
      await user.click(option)
      expect(onChange).toHaveBeenCalledWith(value)
    }
  )

  it('should call onChange with "new" when the New options is selected', async () => {
    const { trigger, user, onChange, getOption } = renderComponent()
    await user.click(trigger)
    const processOption = await getOption(/processed/i)
    await user.click(processOption)
    await user.click(trigger)
    const newOption = await getOption(/new/i)
    await user.click(newOption)
    expect(onChange).toHaveBeenCalledWith("new")
  })
})

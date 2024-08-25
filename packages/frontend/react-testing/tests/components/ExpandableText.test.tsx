import { render, screen } from "@testing-library/react"
import ExpandableText from "../../src/components/ExpandableText"
import userEvent, { UserEvent } from "@testing-library/user-event"

describe("ExpandableText", () => {
  const limit = 255
  const shortText = "hello world"
  const longText = "a".repeat(limit + 1)
  const truncatedText = longText.substring(0, limit) + "..."
  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
  })

  it("should render full text when the length of text is less than the limit", () => {
    render(<ExpandableText text={shortText} />)
    const button = screen.queryByRole("button")
    expect(screen.getByText(shortText)).toBeInTheDocument()
    expect(button).not.toBeInTheDocument()
  })

  it("should render truncated text when the length of text is more than the limit", () => {
    render(<ExpandableText text={longText} />)
    expect(screen.getByText(truncatedText)).toBeInTheDocument()

    const button = screen.getByRole("button")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent(/show more/i)
  })

  it("should toggle show less and show more when click the button", async () => {
    render(<ExpandableText text={longText} />)
    const button = screen.getByRole("button")

    expect(button).toHaveTextContent(/show more/i)
    expect(screen.getByText(truncatedText)).toBeInTheDocument()

    await user.click(button)
    expect(button).toHaveTextContent(/show less/i)
    expect(screen.getByText(longText)).toBeInTheDocument()

    await user.click(button)
    expect(button).toHaveTextContent(/show more/i)
    expect(screen.getByText(truncatedText)).toBeInTheDocument()
  })
})

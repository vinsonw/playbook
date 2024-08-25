/**
 * how to test asynchronous code
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, screen, waitFor } from "@testing-library/react"
import TagList from "../../src/components/TagList"

describe("TagList", () => {
  it("should render tags", async () => {
    render(<TagList />)
    // await waitFor(() => {
    //   const listItems = screen.getAllByRole("listitem")
    //   expect(listItems.length).toBeGreaterThan(0)
    // })

    // findAllByRole is waitFor + getAllByRole
    const listItems = await screen.findAllByRole("listitem")
    expect(listItems.length).toBeGreaterThan(0)
  })
})

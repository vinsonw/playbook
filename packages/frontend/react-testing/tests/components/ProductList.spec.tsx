import { render, screen } from "@testing-library/react"
import ProductList from "../../src/components/ProductList"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"

describe("ProductList", () => {
  it("should render a list of products", async () => {
    render(<ProductList />)
    const items = await screen.findAllByRole("listitem")
    expect(items).toHaveLength(3)
  })

  it("should render no products available when no product is found", async () => {
    // how to overwrite http response
    server.use(http.get("/products", () => HttpResponse.json([])))
    render(<ProductList />)

    const msg = await screen.findByText(/no products/i)
    expect(msg).toBeInTheDocument()
  })
})

import { render, screen } from "@testing-library/react"
import ProductDetail from "../../src/components/ProductDetail"
import { products } from "../mocks/data"
import { server } from "../mocks/server"
import { http, HttpResponse } from "msw"

describe("ProductDetail", () => {
  it("should render a list of products", async () => {
    render(<ProductDetail productId={1} />)
    expect(
      await screen.findByText(new RegExp(products[0].name))
    ).toBeInTheDocument()

    expect(
      await screen.findByText(new RegExp(products[0].price.toString()))
    ).toBeInTheDocument()
  })

  it("should no product when id is not found", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)))
    render(<ProductDetail productId={1} />)
    expect(await screen.findByText(/not found/i)).toBeInTheDocument()
  })

  it("should render an error for invalid productId", async () => {
    render(<ProductDetail productId={0} />)
    expect(await screen.findByText(/invalid/i)).toBeInTheDocument()
  })
})

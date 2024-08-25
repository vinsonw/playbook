import { render, screen } from "@testing-library/react"
import ProductImageGallery from "../../src/components/ProductImageGallery"

describe("ProductImageGallery", () => {
  it("should render nothing if given an empty array", () => {
    const { container } = render(<ProductImageGallery imageUrls={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("should render a list of images", () => {
    const imgUrls = ["url1", "url2"]
    render(<ProductImageGallery imageUrls={imgUrls} />)
    const imgs = screen.getAllByRole("img")
    expect(imgs).toHaveLength(imgUrls.length)
    imgs.forEach((img, index) => {
      expect(img).toHaveAttribute("src", imgUrls[index])
    })
  })
})

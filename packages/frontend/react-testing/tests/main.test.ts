import { it, expect, describe } from "vitest"

describe("group", () => {
  it("should", async () => {
    const res = await fetch("/categories")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await res.json()
    console.log(data)
    expect(data).toHaveLength(3)
  })
})

import { http, HttpResponse } from "msw"

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "aaa" },
      { id: 2, name: "bbb" },
      { id: 3, name: "ccc" },
    ])
  }),
]

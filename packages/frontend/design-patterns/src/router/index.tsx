import { createBrowserRouter } from "react-router-dom"
import { RouteObject, Navigate } from "react-router-dom"
import { PatternLayout } from "../patterns/PatternLayout.tsx"

export const routes: RouteObject[] = [
  {
    path: "/",
    lazy: async () => {
      const { App } = await import("../App.tsx")
      return { Component: App }
    },
  },
  {
    path: "/patterns",
    element: <PatternLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="singleton" />,
      },
      {
        path: "singleton",
        lazy: async () => {
          const { Singleton } = await import("../patterns/Singleton.tsx")
          return { Component: Singleton }
        },
      },
      {
        path: "proxy",
        lazy: async () => {
          const { Proxy } = await import("../patterns/Proxy/Proxy.tsx")
          return { Component: Proxy }
        },
      },
    ],
  },
]

export const router = createBrowserRouter(routes)

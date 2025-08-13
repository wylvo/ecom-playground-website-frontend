import { createRouter } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"

import { routeTree } from "./routeTree.gen"

const queryClient = new QueryClient()

export const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  context: {
    locale: undefined!,
    auth: undefined!,
    queryClient,
  },
})

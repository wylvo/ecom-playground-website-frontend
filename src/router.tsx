import { createRouter } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"

import { routeTree } from "./routeTree.gen"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 1,
      retry: false,
    },
  },
})

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

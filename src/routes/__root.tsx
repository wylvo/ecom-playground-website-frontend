import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { useLanguageChange } from "@/hooks/useLanguageChange"
import ErrorNotFound from "@/components/errors/error-not-found"
// import ErrorFallback from "@/components/errors/error-fallback"
import ToasterDefaults from "@/components/ui/toaster-defaults"
import type { RouterContext } from "@/router"

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        title: "Ecom",
      },
      {
        name: "description",
        content: "Ecom website boilerplate",
      },
      {
        charSet: "UTF-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1.0",
      },
    ],
    links: [
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/vite.svg",
      },
    ],
  }),
  component: Root,
  notFoundComponent: ErrorNotFound,
  // errorComponent: ErrorFallback,
})

function Root() {
  useLanguageChange()

  return (
    <>
      <HeadContent />
      <Outlet />
      <ToasterDefaults />

      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  )
}

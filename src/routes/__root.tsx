import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { useValidateLocale } from "@/hooks/useValidateLocale"
import { useLanguageChange } from "@/hooks/useLanguageChange"
import ErrorNotFound from "@/components/errors/error-not-found"
// import ErrorFallback from "@/components/errors/error-fallback"
import type { SupabaseAuthState } from "@/features/auth/contexts/supabase-auth-context"
import ToasterDefaults from "@/components/ui/toaster-defaults"

interface RouterContext {
  locale: ReturnType<typeof useValidateLocale>
  queryClient: QueryClient
  auth: SupabaseAuthState
}

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

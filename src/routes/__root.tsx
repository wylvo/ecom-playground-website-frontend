import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient } from "@tanstack/react-query"

import { useValidateLocale } from "@/hooks/useValidateLocale"
import ErrorNotFound from "@/components/errors/error-not-found"
// import ErrorFallback from "@/components/errors/error-fallback"
import type { SupabaseAuthState } from "@/features/auth/contexts/supabase-auth-context"

interface MyRouterContext {
  locale: ReturnType<typeof useValidateLocale>
  queryClient: QueryClient
  auth: SupabaseAuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
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
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
  notFoundComponent: ErrorNotFound,
  // errorComponent: ErrorFallback,
})

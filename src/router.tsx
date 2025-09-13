import { createRouter } from "@tanstack/react-router"
import { QueryClient } from "@tanstack/react-query"

import { routeTree } from "./routeTree.gen"
import type { CartContext } from "@/features/cart/contexts/cart-context"
import type { SupabaseAuthContext } from "@/features/auth/contexts/supabase-auth-context"
import type { useValidateLocale } from "@/hooks/useValidateLocale"

export interface RouterContext {
  locale: ReturnType<typeof useValidateLocale>
  queryClient: QueryClient
  auth: SupabaseAuthContext
  cart: CartContext
}

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
    cart: undefined!,
    queryClient,
  },
})

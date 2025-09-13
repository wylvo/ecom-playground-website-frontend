import supabase from "@/services/supabase"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getClaims()
    const isAuthenticated = !!data?.claims
    const isAnonymous = data?.claims.is_anonymous
    const user = data?.claims ?? null

    if (!isAuthenticated)
      throw redirect({
        to: "/{-$locale}/sign-in",
        search: { redirect: location.href },
      })

    if (isAuthenticated && isAnonymous && location.href.startsWith("/account"))
      throw redirect({
        to: "/{-$locale}/sign-in",
        search: { redirect: location.href },
      })

    return { auth: { isAuthenticated, user } }
  },
  component: () => <Outlet />,
})

import supabase from "@/services/supabase"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/_authenticated")({
  beforeLoad: async ({ context }) => {
    if (!context.auth.isAuthenticated) {
      const { data } = await supabase.auth.getClaims()
      if (!data?.claims) throw redirect({ to: "/{-$locale}/login" as string })
      return { auth: { isAuthenticated: true } }
    }
  },
  component: () => <Outlet />,
})

import Loading from "@/components/ui/loading"
import { getCart } from "@/features/cart/api/cart"
import supabase from "@/services/supabase"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/_authenticated")({
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const { data } = await supabase.auth.getClaims()
    const isAuthenticated = !!data?.claims
    const user = data?.claims ?? null

    if (!isAuthenticated)
      throw redirect({
        to: "/{-$locale}/sign-in",
        search: { redirect: location.pathname },
      })

    // Fetch cart only if user is authenticated
    const userId = user?.sub ?? user?.id ?? null
    let cart = undefined

    if (userId)
      cart = await queryClient.ensureQueryData({
        queryKey: ["cart", userId],
        queryFn: () => getCart(userId!),
      })

    return { auth: { isAuthenticated, user }, cart }
  },
  component: () => <Outlet />,
  pendingComponent: Loading,
})

// const userId =
//   typeof user === "object" && user?.id
//     ? user.id
//     : (user as UserClaims)?.sub
//       ? (user as UserClaims)?.sub
//       : null

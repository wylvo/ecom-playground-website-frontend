import type { UserClaims } from "@/features/auth/contexts/supabase-auth-context"
import { getCart } from "@/features/cart/api/cart"
import Cart from "@/features/cart/components/cart"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/cart/")({
  loader: ({ context: { queryClient, auth } }) => {
    const user = auth.user
    const userId =
      typeof user === "object" && user?.id
        ? user.id
        : (user as UserClaims)?.sub
          ? (user as UserClaims)?.sub
          : null

    queryClient.ensureQueryData({
      queryKey: ["cart", userId],
      queryFn: () => getCart(userId!),
    })
  },
  component: Cart,
})

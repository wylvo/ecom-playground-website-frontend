import type { UserClaims } from "@/features/auth/contexts/supabase-auth-context"
import { getCart } from "@/features/cart/api/cart"
import Cart from "@/features/cart/components/cart"
import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/{-$locale}/(app)/cart/")({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/cart" as string })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
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

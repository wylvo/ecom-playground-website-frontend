import { createFileRoute, redirect } from "@tanstack/react-router"

import SignIn from "@/features/auth/components/sign-in"

export const Route = createFileRoute("/{-$locale}/(auth)/sign-in")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/{-$locale}/",
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated && !context.auth.user?.is_anonymous) {
      throw redirect({ to: search.redirect })
    }
  },
  component: SignIn,
})

import { createFileRoute, redirect } from "@tanstack/react-router"

import Register from "@/features/auth/components/register"

export const Route = createFileRoute("/{-$locale}/(auth)/register")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/{-$locale}/",
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated && !context.auth.user?.is_anonymous) {
      throw redirect({ to: search.redirect })
    }
  },
  component: Register,
})

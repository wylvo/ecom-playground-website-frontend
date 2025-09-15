import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/account",
)({
  beforeLoad: ({ context, location }) => {
    const { isAuthenticated, user } = context.auth

    if (!isAuthenticated || (isAuthenticated && user?.is_anonymous))
      throw redirect({
        to: "/{-$locale}/sign-in",
        search: { redirect: location.pathname },
      })
  },
  component: () => <Outlet />,
})

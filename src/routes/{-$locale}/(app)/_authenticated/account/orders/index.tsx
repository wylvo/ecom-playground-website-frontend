import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/account/orders/",
)({
  beforeLoad: ({ context, location }) => {
    if (
      !context.auth.isAuthenticated ||
      (context.auth.isAuthenticated && context.auth.user?.is_anonymous)
    )
      throw redirect({
        to: "/{-$locale}/sign-in",
        search: { redirect: location.pathname },
      })
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$locale/(app)/account/orders"!</div>
}

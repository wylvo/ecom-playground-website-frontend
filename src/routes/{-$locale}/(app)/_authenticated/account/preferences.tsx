import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/account/preferences",
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/-$locale/(app)/account/preferences"!</div>
}

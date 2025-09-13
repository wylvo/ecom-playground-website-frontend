import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/{-$locale}/(app)/_authenticated/account/orders/$orderId",
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { orderId } = Route.useParams()
  const { locale } = Route.useRouteContext()

  return (
    <div>
      <div>Hello "/-$locale/(app)/account/orders/$orderId"!</div>
      <div>Order Id: {orderId} </div>
      <div>Locale: {locale}</div>
    </div>
  )
}

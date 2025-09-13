import CheckoutLayout from "@/components/layouts/checkout-layout"
import OrderDetailsForm from "./order-details-form"

function OrderDetails() {
  return (
    <CheckoutLayout>
      <div>Hello "/-$locale/(app)/checkout/details"!</div>

      <OrderDetailsForm />
    </CheckoutLayout>
  )
}

export default OrderDetails

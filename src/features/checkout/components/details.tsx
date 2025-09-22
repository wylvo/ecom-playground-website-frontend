import CheckoutOverview from "./checkout-overview"
import OrderDetailsForm from "./details-form"

function Details() {
  return (
    <div className="grid min-h-svh gap-6 p-6 md:p-10">
      <div className="grid grid-cols-2 grid-rows-1 gap-6">
        <OrderDetailsForm />
        <CheckoutOverview />
      </div>
    </div>
  )
}

export default Details

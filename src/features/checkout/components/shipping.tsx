import CheckoutOverview from "./checkout-overview"
import ShippingMethodsForm from "./shipping-methods-form"

function Shipping() {
  return (
    <div className="grid min-h-svh gap-6 p-6 md:p-10">
      <div className="grid grid-cols-2 grid-rows-1 gap-6">
        <ShippingMethodsForm />
        <CheckoutOverview />
      </div>
    </div>
  )
}

export default Shipping

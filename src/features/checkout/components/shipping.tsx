import Section from "@/components/ui/section"
import CheckoutOverview from "./checkout-overview"
import ShippingMethodsForm from "./shipping-methods-form"
import Wrapper from "@/components/ui/wrapper"

function Shipping() {
  return (
    <Section className="grid min-h-svh gap-6">
      <Wrapper className="grid lg:grid-cols-2 lg:grid-rows-1 gap-6">
        <ShippingMethodsForm />
        <CheckoutOverview />
      </Wrapper>
    </Section>
  )
}

export default Shipping

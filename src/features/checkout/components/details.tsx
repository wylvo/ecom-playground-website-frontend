import Wrapper from "@/components/ui/wrapper"
import CheckoutOverview from "./checkout-overview"
import OrderDetailsForm from "./details-form"
import Section from "@/components/ui/section"

function Details() {
  return (
    <Section className="grid min-h-svh gap-6">
      <Wrapper className="grid lg:grid-cols-2 lg:grid-rows-1 gap-6">
        <OrderDetailsForm />
        <CheckoutOverview />
      </Wrapper>
    </Section>
  )
}

export default Details

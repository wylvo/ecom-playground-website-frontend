import { Truck } from "lucide-react"

import { formatPrice } from "@/lib/utils"
import { Progress } from "@/components/ui/shadcn/progress"
import { useCart } from "@/features/cart/contexts/cart-context"
import { Card, CardContent, CardTitle } from "@/components/ui/shadcn/card"
import { useTaxRates } from "../api/get-tax-rates"
import { useCheckoutStore } from "../stores/checkout-store"

function CheckoutOverview() {
  const defaultShippingCountryName = "Canada"
  const defaultShippingRegionCode = "QC"

  const { cart } = useCart()
  const { taxRates } = useTaxRates(defaultShippingCountryName)

  const shippingRegionCode =
    useCheckoutStore((state) => state.shipping_region_code) ??
    defaultShippingRegionCode
  const shippingCountryName =
    useCheckoutStore((state) => state.shipping_country) ??
    defaultShippingCountryName

  const regionTaxRate = taxRates?.find(
    (taxRate) =>
      taxRate.region?.code &&
      taxRate.region.code === shippingRegionCode &&
      taxRate.country?.name === shippingCountryName,
  )?.rate
  const countryTaxRate = taxRates?.find(
    (taxRate) => taxRate.country?.name === shippingCountryName,
  )?.rate

  const freeShippingTreshold = 15000
  const subtotal = {
    amount: Number(
      cart!.cart_items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.variant.price * currentValue.quantity,
        0,
      ),
    ),
    formatted: formatPrice({
      cents: cart!.cart_items.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.variant.price * currentValue.quantity,
        0,
      ),
    }),
  }
  const taxes = {
    amount:
      subtotal.amount * ((regionTaxRate ?? 0) / 100) +
      subtotal.amount * ((countryTaxRate ?? 0) / 100),
    formatted: formatPrice({
      cents:
        subtotal.amount * ((regionTaxRate ?? 0) / 100) +
        subtotal.amount * ((countryTaxRate ?? 0) / 100),
    }),
  }
  const progressValue = (subtotal.amount / freeShippingTreshold) * 100
  const hasFreeShipping = progressValue >= 100
  const remainingAmount = formatPrice({
    cents: freeShippingTreshold - subtotal.amount,
  })

  return (
    <Card className="flex flex-col gap-8 border-none shadow-none">
      <CardContent>
        <div className="grid gap-6">
          <div>
            <CardTitle className="text-xl">Order Summary</CardTitle>
          </div>

          <div className="grid gap-8">
            {cart &&
              cart.cart_items.map((cart_item) => {
                const variant = cart_item.variant
                const quantity = cart_item.quantity

                return (
                  <div key={cart_item.id} className="flex gap-4">
                    <div className="relative">
                      <img
                        className="w-18 h-18 object-cover rounded-md"
                        src={variant.variant_images[0].image.url}
                        alt={variant.variant_images[0].image.alt_text}
                      />
                      <div className="w-6 h-6 flex items-center justify-center p-2 text-background bg-foreground text-xs rounded-md absolute top-[-10%] right-[-10%]">
                        {quantity}
                      </div>
                    </div>
                    <div className="flex flex-col text-xs flex-grow gap-1">
                      <div>
                        <p>{variant.product.name}</p>
                        <p>{formatPrice({ cents: variant.price })}</p>
                      </div>

                      <div>
                        {variant.variant_options.map((vo: any, i: number) => (
                          <p key={i}>
                            {vo.option_value.option.name}:{" "}
                            {vo.option_value.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>

          <div className="grid gap-2">
            <Progress value={progressValue} />
            <div className="flex gap-2 items-center">
              <Truck />
              {hasFreeShipping ? (
                <p>
                  Congratulations! You qualify for{" "}
                  <strong>FREE shipping</strong>
                </p>
              ) : (
                <p>
                  Add <strong>{remainingAmount}</strong> to qualify for free
                  shipping
                </p>
              )}
            </div>
          </div>

          <div className="grid text-sm gap-4">
            <div className="grid gap-1">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{subtotal.formatted}</p>
              </div>

              {subtotal.amount >= freeShippingTreshold && (
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>FREE</p>
                </div>
              )}

              <div className="flex justify-between">
                <p>Taxes</p>
                <p>{taxes.formatted}</p>
              </div>
            </div>

            <div className="flex justify-between text-xl font-semibold">
              <p className="">Total</p>
              <p className="">
                {formatPrice({
                  cents: subtotal.amount + taxes.amount,
                  displayCurrencyCode: true,
                })}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CheckoutOverview

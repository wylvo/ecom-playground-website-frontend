import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import z from "zod"

import { Button } from "@/components/ui/shadcn/button"
import { Card, CardContent, CardTitle } from "@/components/ui/shadcn/card"
import {
  checkoutSchema,
  useCheckout,
  type CheckoutSchema,
} from "../api/checkout"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/shadcn/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/shadcn/radio-group"
import StripeLogo from "@/components/ui/stripe-logo"
import { useCheckoutStore } from "../stores/checkout-store"
import { useEffect } from "react"
import { toast } from "sonner"
import { useSupabaseAuth } from "@/features/auth/contexts/supabase-auth-context"

const checkoutShippingMethodSchema = checkoutSchema.pick({
  shipping_method_options: true,
  token: true,
})

type CheckoutShippingMethodSchema = z.infer<typeof checkoutShippingMethodSchema>

function ShippingMethodsForm() {
  const navigate = useNavigate({ from: "/{-$locale}/checkout/shipping" })
  const { tryCheckout, isPending } = useCheckout()
  const { accessToken } = useSupabaseAuth()

  const email = useCheckoutStore((state) => state.email)
  const phone_number = useCheckoutStore((state) => state.phone_number)
  const accepts_marketing = useCheckoutStore((state) => state.accepts_marketing)
  const shipping_full_name = useCheckoutStore(
    (state) => state.shipping_full_name,
  )
  const shipping_company = useCheckoutStore((state) => state.shipping_company)
  const shipping_address_line_1 = useCheckoutStore(
    (state) => state.shipping_address_line_1,
  )
  const shipping_address_line_2 = useCheckoutStore(
    (state) => state.shipping_address_line_2,
  )
  const shipping_city = useCheckoutStore((state) => state.shipping_city)
  const shipping_region_name = useCheckoutStore(
    (state) => state.shipping_region_name,
  )
  const shipping_region_code = useCheckoutStore(
    (state) => state.shipping_region_code,
  )
  const shipping_zip = useCheckoutStore((state) => state.shipping_zip)
  const shipping_country_name = useCheckoutStore(
    (state) => state.shipping_country_name,
  )
  const shipping_country_code = useCheckoutStore(
    (state) => state.shipping_country_code,
  )
  // const billing_address_matches_shipping_address = useCheckoutStore(
  //   (state) => state.billing_address_matches_shipping_address,
  // )
  // const billing_full_name = useCheckoutStore((state) => state.billing_full_name)
  // const billing_company = useCheckoutStore((state) => state.billing_company)
  // const billing_address_line_1 = useCheckoutStore(
  //   (state) => state.billing_address_line_1,
  // )
  // const billing_address_line_2 = useCheckoutStore(
  //   (state) => state.billing_address_line_2,
  // )
  // const billing_city = useCheckoutStore((state) => state.billing_city)
  // const billing_region_name = useCheckoutStore(
  //   (state) => state.billing_region_name,
  // )
  // const billing_region_code = useCheckoutStore(
  //   (state) => state.billing_region_code,
  // )
  // const billing_zip = useCheckoutStore((state) => state.billing_zip)
  // const billing_country_name = useCheckoutStore(
  //   (state) => state.billing_country_name,
  // )
  // const billing_country_code = useCheckoutStore(
  //   (state) => state.billing_country_code,
  // )
  const locale = useCheckoutStore((state) => state.locale)

  const form = useForm<CheckoutShippingMethodSchema>({
    resolver: zodResolver(checkoutShippingMethodSchema),
    defaultValues: {
      shipping_method_options: "delivery",
      token: "token",
    },
  })

  const {
    formState: { errors },
  } = form

  useEffect(() => {
    console.log(errors)
  }, [errors])

  function handleSubmit(data: CheckoutShippingMethodSchema) {
    if (!accessToken) {
      toast.error("Please sign in before checking out.")
      navigate({
        to: "/{-$locale}/sign-in",
        search: { redirect: "/{-$locale}/checkout/shipping" },
      })
      return
    }

    const checkoutData = {
      ...data,
      email,
      phone_number,
      accepts_marketing,
      shipping_full_name,
      shipping_company,
      shipping_address_line_1,
      shipping_address_line_2,
      shipping_city,
      shipping_region_name,
      shipping_region_code,
      shipping_zip,
      shipping_country_name,
      shipping_country_code,
      // billing_address_matches_shipping_address,
      // billing_full_name,
      // billing_company,
      // billing_address_line_1,
      // billing_address_line_2,
      // billing_city,
      // billing_region_name,
      // billing_region_code,
      // billing_zip,
      // billing_country_name,
      // billing_country_code,
      locale,
    } as CheckoutSchema

    console.log("sent: ", checkoutData)

    tryCheckout(
      {
        checkoutData,
        accessToken,
      },
      {
        onSuccess: (data) => {
          toast.success("Checkout data sent successfully!")
          const url = data.url
          console.log("received:", data)

          navigate({ href: url })
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Checkout failed. Please try again later.",
            {
              style: {
                color: "var(--destructive)",
              },
            },
          )
        },
        onSettled: () => {},
      },
    )

    // navigate({
    //   to: "/{-$locale}/checkout/summary",
    // })
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-8 border-none shadow-none">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div>
                    <CardTitle className="text-xl">Delivery Options</CardTitle>
                  </div>

                  <FormField
                    control={form.control}
                    name="shipping_method_options"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col"
                            disabled={isPending}
                          >
                            <FormItem className="h-16 border-1 p-4 flex items-center gap-3 rounded-md">
                              <FormControl id="shipping_method_options">
                                <RadioGroupItem value="delivery" />
                              </FormControl>
                              <FormLabel className="font-normal flex flex-grow justify-between">
                                <p>Home Delivery</p>
                                <p>FREE</p>
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button size="lg" type="submit" disabled={isPending}>
                    Checkout
                    <StripeLogo />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ShippingMethodsForm

import { useNavigate } from "@tanstack/react-router"
import { useForm /*useWatch*/ } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Button } from "@/components/ui/shadcn/button"
import { Card, CardContent, CardTitle } from "@/components/ui/shadcn/card"
import { Input } from "@/components/ui/shadcn/input"
import { checkoutSchema } from "../api/checkout"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/shadcn/form"
import Combobox from "@/components/ui/combobox"
import { Checkbox } from "@/components/ui/shadcn/checkbox"
import { useSupabaseAuth } from "@/features/auth/contexts/supabase-auth-context"
import { useCountriesAndRegions } from "../api/get-countries-and-regions"
import { cn } from "@/lib/utils"
import { useCheckoutStore } from "../stores/checkout-store"
import { useEffect } from "react"

const checkoutShippingAndBillingSchema = checkoutSchema
  .pick({
    email: true,
    phone_number: true,
    accepts_marketing: true,

    shipping_full_name: true,
    shipping_company: true,
    shipping_address_line_1: true,
    shipping_address_line_2: true,
    shipping_city: true,
    shipping_region_name: true,
    shipping_region_code: true,
    shipping_zip: true,
    shipping_country_name: true,
    shipping_country_code: true,

    billing_address_matches_shipping_address: true,

    billing_full_name: true,
    billing_company: true,
    billing_address_line_1: true,
    billing_address_line_2: true,
    billing_city: true,
    billing_region_name: true,
    billing_region_code: true,
    billing_zip: true,
    billing_country_name: true,
    billing_country_code: true,
  })
  .superRefine((data, ctx) => {
    if (!data.billing_address_matches_shipping_address) {
      const requiredFieldNames: Array<keyof CheckoutShippingAndBillingSchema> =
        [
          "billing_full_name",
          "billing_address_line_1",
          "billing_city",
          "billing_region_name",
          "billing_region_code",
          "billing_zip",
          "billing_country_name",
          "billing_country_code",
        ]

      requiredFieldNames.forEach((fieldName) => {
        if (!data[fieldName]) {
          ctx.addIssue({
            path: [fieldName],
            code: "custom",
            message: "Required",
          })
        }
      })
    }
  })

type CheckoutShippingAndBillingSchema = z.infer<
  typeof checkoutShippingAndBillingSchema
>

function DetailsForm() {
  const navigate = useNavigate({ from: "/{-$locale}/checkout/details" })
  const { user } = useSupabaseAuth()
  const { countriesAndRegions } = useCountriesAndRegions()

  const setData = useCheckoutStore((state) => state.setData)
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

  const copyShippingAddress = useCheckoutStore(
    (state) => state.billing_address_matches_shipping_address,
  )
  const billing_full_name = useCheckoutStore((state) => state.billing_full_name)
  const billing_company = useCheckoutStore((state) => state.billing_company)
  const billing_address_line_1 = useCheckoutStore(
    (state) => state.billing_address_line_1,
  )
  const billing_address_line_2 = useCheckoutStore(
    (state) => state.billing_address_line_2,
  )
  const billing_city = useCheckoutStore((state) => state.billing_city)
  const billing_region_name = useCheckoutStore(
    (state) => state.billing_region_name,
  )
  const billing_region_code = useCheckoutStore(
    (state) => state.billing_region_code,
  )
  const billing_zip = useCheckoutStore((state) => state.billing_zip)
  const billing_country_name = useCheckoutStore(
    (state) => state.billing_country_name,
  )
  const billing_country_code = useCheckoutStore(
    (state) => state.billing_country_code,
  )

  const form = useForm<CheckoutShippingAndBillingSchema>({
    resolver: zodResolver(checkoutShippingAndBillingSchema),
    defaultValues: {
      email: user?.email || email || "",
      phone_number: phone_number || "",
      accepts_marketing: accepts_marketing || true,

      shipping_full_name: shipping_full_name || "",
      shipping_company: shipping_company || "",
      shipping_address_line_1: shipping_address_line_1 || "",
      shipping_address_line_2: shipping_address_line_2 || "",
      shipping_city: shipping_city || "",
      shipping_region_name: shipping_region_name || "Quebec",
      shipping_region_code: shipping_region_code || "QC",
      shipping_zip: shipping_zip || "",
      shipping_country_name: shipping_country_name || "Canada",
      shipping_country_code: shipping_country_code || "CA",

      billing_address_matches_shipping_address: copyShippingAddress ?? true,

      billing_full_name: (!copyShippingAddress && billing_full_name) || "",
      billing_company: (!copyShippingAddress && billing_company) || "",
      billing_address_line_1:
        (!copyShippingAddress && billing_address_line_1) || "",
      billing_address_line_2:
        (!copyShippingAddress && billing_address_line_2) || "",
      billing_city: (!copyShippingAddress && billing_city) || "",
      billing_region_name:
        (!copyShippingAddress && billing_region_name) || "Quebec",
      billing_region_code:
        (!copyShippingAddress && billing_region_code) || "QC",
      billing_zip: (!copyShippingAddress && billing_zip) || "",
      billing_country_name:
        (!copyShippingAddress && billing_country_name) || "Canada",
      billing_country_code:
        (!copyShippingAddress && billing_country_code) || "CA",
    },
  })

  // const billingMatchesShipping = useWatch({
  //   control: form.control,
  //   name: "billing_address_matches_shipping_address",
  // })

  const {
    formState: { errors },
  } = form

  useEffect(() => {
    console.log(errors)
  }, [errors])

  function copyShippingToBilling() {
    const {
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
    } = form.getValues()

    form.setValue("billing_full_name", shipping_full_name)
    form.setValue("billing_company", shipping_company)
    form.setValue("billing_address_line_1", shipping_address_line_1)
    form.setValue("billing_address_line_2", shipping_address_line_2)
    form.setValue("billing_city", shipping_city)
    form.setValue("billing_region_name", shipping_region_name)
    form.setValue("billing_region_code", shipping_region_code)
    form.setValue("billing_zip", shipping_zip)
    form.setValue("billing_country_name", shipping_country_name)
    form.setValue("billing_country_code", shipping_country_code)
  }

  function clearBillingFields() {
    const fields: Array<keyof CheckoutShippingAndBillingSchema> = [
      "billing_full_name",
      "billing_company",
      "billing_address_line_1",
      "billing_address_line_2",
      "billing_city",
      "billing_region_name",
      "billing_region_code",
      "billing_zip",
      "billing_country_name",
      "billing_country_code",
    ]
    fields.forEach((field) => form.resetField(field))
  }

  function handleSubmit(data: CheckoutShippingAndBillingSchema) {
    if (data.billing_address_matches_shipping_address) {
      data.billing_full_name = data.shipping_full_name
      data.billing_company = data.shipping_company
      data.billing_address_line_1 = data.shipping_address_line_1
      data.billing_address_line_2 = data.shipping_address_line_2
      data.billing_city = data.shipping_city
      data.billing_country_name = data.shipping_country_name
      data.billing_region_name = data.shipping_region_name
      data.billing_zip = data.shipping_zip
    }

    setData(data)

    navigate({
      to: "/{-$locale}/checkout/shipping",
    })
  }

  return (
    <Card className="flex flex-col gap-8 border-none shadow-none">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div>
                  <CardTitle className="text-xl">Contact</CardTitle>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-3 relative">
                      <FormControl>
                        <Input
                          className={cn(
                            "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                            field.value ? "pt-5 pb-1" : "",
                          )}
                          autoComplete="email"
                          type="email"
                          placeholder="Email Address"
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all duration-300 peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                        Email Address
                      </FormLabel>
                      {errors.email && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.email.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem className="grid gap-3 relative">
                      <FormControl>
                        <Input
                          className={cn(
                            "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                            field.value ? "pt-5 pb-1" : "",
                          )}
                          type="tel"
                          autoComplete="shipping tel"
                          placeholder="Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                        Phone Number
                      </FormLabel>
                      {errors.phone_number && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.phone_number.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accepts_marketing"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id="accepts_marketing"
                          checked={field.value}
                          onCheckedChange={(isChecked) => {
                            if (isChecked) copyShippingToBilling()
                            else clearBillingFields()
                            return field.onChange(isChecked)
                          }}
                          // disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="inline-block text-xs font-normal text-balance">
                        Email me with news and offers
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <div>
                  <CardTitle className="text-xl">Shipping Address</CardTitle>
                </div>

                <FormField
                  control={form.control}
                  name="shipping_full_name"
                  render={({ field }) => (
                    <FormItem className="grid gap-3 relative">
                      <FormControl>
                        <Input
                          className={cn(
                            "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                            field.value ? "pt-5 pb-1" : "",
                          )}
                          autoComplete="shipping name"
                          placeholder="Full Name"
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                        Full Name
                      </FormLabel>
                      {errors.shipping_full_name && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.shipping_full_name.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_company"
                  render={({ field }) => (
                    <FormItem className="grid gap-3 relative">
                      <FormControl>
                        <Input
                          className={cn(
                            "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                            field.value ? "pt-5 pb-1" : "",
                          )}
                          autoComplete="shipping organization"
                          placeholder="Company (Optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                        Company (Optional)
                      </FormLabel>
                      {errors.shipping_company && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.shipping_company.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_address_line_1"
                  render={({ field }) => (
                    <FormItem className="grid gap-3 relative">
                      <FormControl>
                        <Input
                          className={cn(
                            "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                            field.value ? "pt-5 pb-1" : "",
                          )}
                          autoComplete="shipping address-line1"
                          placeholder="Address"
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                        Address
                      </FormLabel>
                      {errors.shipping_address_line_1 && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.shipping_address_line_1.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shipping_address_line_2"
                  render={({ field }) => (
                    <FormItem className="grid gap-3 relative">
                      <FormControl>
                        <Input
                          className={cn(
                            "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                            field.value ? "pt-5 pb-1" : "",
                          )}
                          autoComplete="shipping address-line2"
                          placeholder="Apartment, unit, etc. (Optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                        Apartment, unit, etc. (Optional)
                      </FormLabel>
                      {errors.shipping_address_line_2 && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.shipping_address_line_2.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:gap-3 md:grid-cols-3 md:grid-rows-1">
                  <FormField
                    control={form.control}
                    name="shipping_city"
                    render={({ field }) => (
                      <FormItem className="grid gap-3 relative">
                        <FormControl>
                          <Input
                            className={cn(
                              "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                              field.value ? "pt-5 pb-1" : "",
                            )}
                            autoComplete="shipping address-level2"
                            placeholder="City"
                            {...field}
                          />
                        </FormControl>
                        <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                          City
                        </FormLabel>
                        {errors.shipping_city && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.shipping_city.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_region_name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-3 relative">
                        <FormControl>
                          <Combobox
                            className="h-12 pt-5 pb-1 peer"
                            data={
                              countriesAndRegions
                                ?.find(
                                  (country) =>
                                    country.name ===
                                    form.getValues("shipping_country_name"),
                                )
                                ?.regions.map((region) => ({
                                  label: region.name,
                                  value: region.name,
                                })) ?? []
                            }
                            type="province/state"
                            value={field.value}
                            onValueChange={(value) => {
                              countriesAndRegions?.forEach((country) =>
                                country.regions.find((region) => {
                                  if (region.name === value) {
                                    form.setValue(
                                      "shipping_region_code",
                                      region.code,
                                    )
                                    setData({
                                      shipping_region_code: region.code,
                                    })
                                  }
                                }),
                              )

                              setData({ shipping_region_name: value })
                              return field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <div className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none">
                          Province
                        </div>
                        {errors.shipping_region_name && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.shipping_region_name.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_region_code"
                    render={({ field }) => (
                      <FormItem className="hidden relative">
                        <FormControl>
                          <Input
                            className={cn(
                              "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                              field.value ? "pt-5 pb-1" : "",
                            )}
                            placeholder="shipping_region_code"
                            value={field.value}
                            disabled
                          />
                        </FormControl>
                        <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                          Region Code
                        </FormLabel>
                        {errors.shipping_region_code && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.shipping_region_code.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shipping_zip"
                    render={({ field }) => (
                      <FormItem className="grid gap-3 relative">
                        <FormControl>
                          <Input
                            className={cn(
                              "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                              field.value ? "pt-5 pb-1" : "",
                            )}
                            autoComplete="shipping postal-code"
                            placeholder="Postal Code"
                            maxLength={6}
                            {...field}
                          />
                        </FormControl>
                        <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                          Postal Code
                        </FormLabel>
                        {errors.shipping_zip && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.shipping_zip.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="shipping_country_name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-3 relative">
                      <FormControl>
                        <Combobox
                          disabled
                          className="h-12 pt-5 pb-1 peer"
                          data={
                            countriesAndRegions?.map((country) => ({
                              label: country.name,
                              value: country.name,
                            })) ?? []
                          }
                          type="country"
                          value={field.value}
                          onValueChange={(value) => {
                            setData({
                              shipping_country_name: value,
                              shipping_region_name: "",
                              shipping_region_code: "",
                            })

                            form.setValue("shipping_country_name", value)
                            form.setValue("shipping_region_name", "")
                            form.setValue("shipping_region_code", "")

                            return field.onChange(value)
                          }}
                        />
                      </FormControl>
                      <div
                        data-disabled="true"
                        className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
                      >
                        Country
                      </div>
                      {errors.shipping_country_name && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.shipping_country_name.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="billing_address_matches_shipping_address"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center gap-2">
                      <FormControl>
                        <Checkbox
                          id="billing_address_matches_shipping_address"
                          checked={field.value}
                          onCheckedChange={(isChecked) => {
                            if (isChecked) copyShippingToBilling()
                            else clearBillingFields()
                            return field.onChange(isChecked)
                          }}
                          // disabled={isLoading}
                        />
                      </FormControl>
                      <FormLabel className="inline-block text-xs font-normal text-balance">
                        Shipping address matches billing address
                      </FormLabel>
                    </FormItem>
                  )}
                /> */}

                {/* <div
                  className={billingMatchesShipping ? "hidden" : "grid gap-6"}
                >
                  <div>
                    <CardTitle className="text-xl">Billing Address</CardTitle>
                  </div>

                  <FormField
                    control={form.control}
                    name="billing_full_name"
                    render={({ field }) => (
                      <FormItem className="grid gap-3 relative">
                        <FormControl>
                          <Input
                            className={cn(
                              "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                              field.value ? "pt-5 pb-1" : "",
                            )}
                            autoComplete="billing name"
                            placeholder="Full Name"
                            disabled={billingMatchesShipping}
                            {...field}
                          />
                        </FormControl>
                        <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                          Full Name
                        </FormLabel>
                        {errors.billing_full_name && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.billing_full_name.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billing_company"
                    render={({ field }) => (
                      <FormItem className="grid gap-3 relative">
                        <FormControl>
                          <Input
                            className={cn(
                              "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                              field.value ? "pt-5 pb-1" : "",
                            )}
                            disabled={billingMatchesShipping}
                            autoComplete="billing organization"
                            placeholder="Company (Optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                          Company (Optional)
                        </FormLabel>
                        {errors.billing_company && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.billing_company.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billing_address_line_1"
                    render={({ field }) => (
                      <FormItem className="grid gap-3 relative">
                        <FormControl>
                          <Input
                            className={cn(
                              "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                              field.value ? "pt-5 pb-1" : "",
                            )}
                            disabled={billingMatchesShipping}
                            autoComplete="billing address-line1"
                            placeholder="Address"
                            {...field}
                          />
                        </FormControl>
                        <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                          Address
                        </FormLabel>
                        {errors.billing_address_line_1 && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.billing_address_line_1.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billing_address_line_2"
                    render={({ field }) => (
                      <FormItem className="grid gap-3 relative">
                        <FormControl>
                          <Input
                            className={cn(
                              "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                              field.value ? "pt-5 pb-1" : "",
                            )}
                            disabled={billingMatchesShipping}
                            autoComplete="billing address-line2"
                            placeholder="Apartment, unit, etc. (Optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                          Apartment, unit, etc. (Optional)
                        </FormLabel>
                        {errors.billing_address_line_2 && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.billing_address_line_2.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:gap-3 md:grid-cols-3 md:grid-rows-1">
                    <FormField
                      control={form.control}
                      name="billing_city"
                      render={({ field }) => (
                        <FormItem className="grid gap-3 relative">
                          <FormControl>
                            <Input
                              className={cn(
                                "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                                field.value ? "pt-5 pb-1" : "",
                              )}
                              disabled={billingMatchesShipping}
                              autoComplete="billing address-level2"
                              placeholder="City"
                              {...field}
                            />
                          </FormControl>
                          <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                            City
                          </FormLabel>
                          {errors.billing_city && (
                            <FormDescription className="text-(--destructive) text-left">
                              {errors.billing_city.message}
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billing_region_name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 relative">
                          <FormControl>
                            <Combobox
                              className="h-12 pt-5 pb-1 peer"
                              data={
                                countriesAndRegions
                                  ?.find(
                                    (country) =>
                                      country.name ===
                                      form.getValues("billing_country_name"),
                                  )
                                  ?.regions.map((region) => ({
                                    label: region.name,
                                    value: region.name,
                                  })) ?? []
                              }
                              type="province/state"
                              value={field.value!}
                              onValueChange={(value) => {
                                countriesAndRegions?.forEach((country) =>
                                  country.regions.find((region) => {
                                    if (region.name === value) {
                                      form.setValue(
                                        "billing_region_code",
                                        region.code,
                                      )
                                      setData({
                                        billing_region_code: region.code,
                                      })
                                    }
                                  }),
                                )

                                setData({ billing_region_name: value })
                                return field.onChange(value)
                              }}
                            />
                          </FormControl>
                          <div className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none">
                            Province
                          </div>
                          {errors.billing_region_name && (
                            <FormDescription className="text-(--destructive) text-left">
                              {errors.billing_region_name.message}
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billing_zip"
                      render={({ field }) => (
                        <FormItem className="grid gap-3 relative">
                          <FormControl>
                            <Input
                              className={cn(
                                "h-12 focus:pt-5 focus:pb-1 peer focus:placeholder-transparent",
                                field.value ? "pt-5 pb-1" : "",
                              )}
                              disabled={billingMatchesShipping}
                              autoComplete="billing postal-code"
                              placeholder="Postal Code"
                              maxLength={6}
                              {...field}
                            />
                          </FormControl>
                          <FormLabel className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground cursor-text data-[error=true]:peer-focus:text-destructive data-[error=true]:peer-placeholder-shown:text-transparent">
                            Postal Code
                          </FormLabel>
                          {errors.billing_zip && (
                            <FormDescription className="text-(--destructive) text-left">
                              {errors.billing_zip.message}
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="billing_country_name"
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-3 relative">
                        <FormControl>
                          <Combobox
                            disabled
                            className="h-12 pt-5 pb-1 peer"
                            data={
                              countriesAndRegions?.map((country) => ({
                                label: country.name,
                                value: country.name,
                              })) ?? []
                            }
                            type="country"
                            value={field.value!}
                            onValueChange={(value) => {
                              setData({
                                billing_country_name: value,
                                billing_region_name: "",
                                billing_region_code: "",
                              })

                              form.setValue("billing_country_name", value)
                              form.setValue("billing_region_name", "")
                              form.setValue("billing_region_code", "")

                              return field.onChange(value)
                            }}
                          />
                        </FormControl>
                        <div
                          data-disabled="true"
                          className="absolute left-0 px-3 py-1 top-1 text-xs text-muted-foreground font-normal peer-placeholder-shown:text-transparent peer-placeholder-shown:top-2 transition-all peer-focus:top-1 peer-focus:text-muted-foreground data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none"
                        >
                          Country
                        </div>
                        {errors.billing_country_name && (
                          <FormDescription className="text-(--destructive) text-left">
                            {errors.billing_country_name.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </div> */}

                <Button type="submit">Next</Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default DetailsForm

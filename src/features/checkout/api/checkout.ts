import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import parsePhoneNumber from "libphonenumber-js"
import z from "zod"

const api = import.meta.env.VITE_API_ENDPOINT
const maximumLength = 255
const minimumLength = 1

const requiredString = (minLength = minimumLength, maxLength = maximumLength) =>
  z
    .string()
    .trim()
    .min(minLength, { error: "Required" })
    .max(maxLength, { error: "Too long" })

const optionalString = (maxLength = maximumLength) =>
  z.string().trim().max(maxLength, { error: "Too long" }).optional()

export const checkoutSchema = z.object({
  email: z.email(),

  // https://github.com/colinhacks/zod/issues/3378#issuecomment-2067591844
  phone_number: z.string().transform((value, ctx) => {
    const phoneNumber = parsePhoneNumber(value, {
      defaultCountry: "CA",
    })
    if (!phoneNumber?.isValid()) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid phone number",
      })
      return z.NEVER
    }
    return phoneNumber.format("E.164")
  }),
  accepts_marketing: z.boolean(),

  shipping_full_name: requiredString(2),
  shipping_company: optionalString(),
  shipping_address_line_1: requiredString(),
  shipping_address_line_2: optionalString(),
  shipping_city: requiredString(),
  shipping_region_name: requiredString(),
  shipping_region_code: requiredString(2, 2),
  shipping_zip: requiredString(1, 6),
  shipping_country_name: requiredString(),
  shipping_country_code: requiredString(2, 2),

  billing_address_matches_shipping_address: z.boolean(),

  billing_full_name: optionalString(),
  billing_company: optionalString(),
  billing_address_line_1: optionalString(),
  billing_address_line_2: optionalString(),
  billing_city: optionalString(),
  billing_region_name: requiredString(),
  billing_region_code: requiredString(2, 2),
  billing_zip: optionalString(6),
  billing_country_name: requiredString(),
  billing_country_code: requiredString(2, 2),

  shipping_method_options: z.enum(["delivery", "pick_up"]),

  promotion_code: optionalString(),

  locale: z.enum(["fr-CA", "en-CA"], { error: "Required" }),

  token: z.string({ error: "Required" }),
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>

type Checkout = {
  checkoutData: CheckoutSchema
  accessToken: string
}

export async function checkout({ checkoutData, accessToken }: Checkout) {
  const { data } = await axios.post<{
    success: boolean
    message: string
    url?: string
    data?: any
  }>(`${api}/checkout`, checkoutData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return data
}

export type CheckoutResponse = ReturnType<typeof checkout>

export function useCheckout() {
  const {
    mutate: tryCheckout,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ checkoutData, accessToken }: Checkout): CheckoutResponse =>
      checkout({ checkoutData, accessToken }),
  })

  return { tryCheckout, isPending, error }
}

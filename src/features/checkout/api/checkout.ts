import parsePhoneNumber from "libphonenumber-js"
import z from "zod"

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
    return phoneNumber.formatInternational()
  }),
  accepts_marketing: z.boolean(),

  shipping_full_name: requiredString(2),
  shipping_company: optionalString(),
  shipping_address_line_1: requiredString(),
  shipping_address_line_2: optionalString(),
  shipping_city: requiredString(),
  shipping_region: requiredString(),
  shipping_region_code: optionalString(2),
  shipping_zip: requiredString(1, 6),
  shipping_country: requiredString(),

  billing_address_matches_shipping_address: z.boolean(),

  billing_full_name: optionalString(),
  billing_company: optionalString(),
  billing_address_line_1: optionalString(),
  billing_address_line_2: optionalString(),
  billing_city: optionalString(),
  billing_region: optionalString(),
  billing_zip: optionalString(6),
  billing_country: optionalString(),

  shipping_options: z.enum(["delivery", "pick_up"]),

  promotion_code: z.string().optional(),

  // promotion_id: z.bigint(),
  // promotion_type: z.string(),
  // promotion_value: z.int(),
  // promotion_currency_code: z.string(),
  // subtotal_price: z.int(),
  // discount_total: z.int(),
  // tax_total: z.int(),
  // shipping_total: z.int(),
  // total_price: z.int(),
  // currency_code: z.string(),
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>

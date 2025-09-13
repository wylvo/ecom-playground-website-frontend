import parsePhoneNumber from "libphonenumber-js"
import z from "zod"

export const checkoutSchema = z.object({
  email: z.email(),

  shipping_first_name: z.string().max(255),
  shipping_last_name: z.string().max(255),
  shipping_company: z
    .string()
    .max(255)
    .nullable()
    .refine((value) => (!value ? null : value)),
  shipping_address_line_1: z.string().max(255),
  shipping_address_line_2: z
    .string()
    .max(255)
    .nullable()
    .refine((value) => (!value ? null : value)),
  shipping_city: z.string().max(255),
  shipping_region: z.string().max(255),
  shipping_region_code: z.string().max(2).nullable(),
  shipping_zip: z.string().max(6),
  shipping_country: z.string().max(255),

  billing_first_name: z.string().max(255),
  billing_last_name: z.string().max(255),
  billing_company: z
    .string()
    .max(255)
    .nullable()
    .refine((value) => (!value ? null : value)),
  billing_address_line_1: z.string().max(255),
  billing_address_line_2: z
    .string()
    .max(255)
    .nullable()
    .refine((value) => (!value ? null : value)),
  billing_city: z.string().max(255),
  billing_region: z.string().max(255),
  billing_region_code: z.string().max(2).nullable(),
  billing_zip: z.string().max(6),
  billing_country: z.string().max(255),
  billing_address_matches_shipping_address: z.boolean(),

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

  shipping_method: z.string(),

  promotion_code: z.string().nullable(),

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

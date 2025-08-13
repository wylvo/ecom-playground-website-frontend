import { isValidLocale } from "@/lib/utils"
import { defaultLocale, type Locale } from "@/types/locale"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

const productSearchSchema = z.object({
  page: z.number().optional().catch(1),
  filter: z.string().optional().catch(""),
  sort: z.enum(["newest", "oldest", "price"]).optional().catch("newest"),
})

export const Route = createFileRoute("/{-$locale}/(app)/products/")({
  beforeLoad: ({ params }) => {
    const { locale } = params

    if ((locale && !isValidLocale(locale)) || locale === defaultLocale) {
      throw redirect({ to: "/products" as string })
    }

    return {
      locale: (locale as Locale) || defaultLocale,
      isDefaultLocale: !locale || locale === defaultLocale,
    }
  },
  component: Products,
  validateSearch: productSearchSchema,
})

function Products() {
  const { locale } = Route.useRouteContext()
  return (
    <div>
      <div>Hello "/(app)/products/"!</div>
      <p>Locale: {locale}</p>
    </div>
  )
}

import supabase from "@/services/supabase"
import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"
import { z } from "zod"

export const getTaxRates = async ({ countryName }: GetTaxRatesOptions) => {
  const { data, error } = await supabase
    .from("tax_rates")
    .select(
      `country:countries!inner(
        name,
        code
      ),
      region:regions(
        name,
        code
      ),
      rate,
      tax_name,
      is_inclusive
    `,
    )
    .eq("country.name", countryName)
    .overrideTypes<
      {
        country: {
          name: any
          code: any
        }
        region: {
          name: any
          code: any
        }
      }[]
    >()

  if (error) throw error

  return data
}

export function createTaxRatesQueryOptions<
  TData = GetTaxRatesResponse,
  TError = Error,
>(
  params?: GetTaxRatesOptions,
  options?: Omit<
    UseQueryOptions<GetTaxRatesResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["tax-rates", params],
    queryFn: () => getTaxRates(params!),
  })
}

export type GetTaxRatesResponse = Awaited<ReturnType<typeof getTaxRates>>
export type GetTaxRatesOptions = z.infer<typeof taxRatesParamsSchema>

export const taxRatesParamsSchema = z.object({
  countryName: z.string().optional().catch("Canada"),
})

export function useTaxRates(
  countryName: string,
  queryOptions: typeof createTaxRatesQueryOptions = createTaxRatesQueryOptions,
) {
  const {
    data: taxRates,
    error,
    isLoading,
  } = useQuery(queryOptions({ countryName }))

  return { taxRates, error, isLoading }
}

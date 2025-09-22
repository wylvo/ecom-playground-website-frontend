import supabase from "@/services/supabase"
import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"

export async function getCountriesAndRegions() {
  const { data, error } = await supabase.from("countries").select(`
      name,
      code,
      regions(
        code,
        name
      )
    `)

  if (error) throw error

  return data
}

export function createCountriesAndRegionsQueryOptions<
  TData = GetCountriesAndRegionsResponse,
  TError = Error,
>(
  options?: Omit<
    UseQueryOptions<GetCountriesAndRegionsResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["countries-regions"],
    queryFn: () => getCountriesAndRegions(),
  })
}

export type GetCountriesAndRegionsResponse = Awaited<
  ReturnType<typeof getCountriesAndRegions>
>

export function useCountriesAndRegions(
  queryOptions: typeof createCountriesAndRegionsQueryOptions = createCountriesAndRegionsQueryOptions,
) {
  const {
    data: countriesAndRegions,
    error,
    isLoading,
  } = useQuery(queryOptions())

  return { countriesAndRegions, error, isLoading }
}

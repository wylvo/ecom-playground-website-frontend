import supabase from "@/services/supabase"
import {
  queryOptions,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query"

export async function getShippingMethods() {
  const { data, error } = await supabase
    .from("shipping_methods")
    .select(
      `
      name,
      carrier,
      service_code,
      is_active
    `,
    )
    .eq("is_active", true)

  if (error) throw error

  return data
}

export function createShippingMethodsQueryOptions<
  TData = GetShippingMethodsResponse,
  TError = Error,
>(
  options?: Omit<
    UseQueryOptions<GetShippingMethodsResponse, TError, TData>,
    "queryKey" | "queryFn"
  >,
) {
  return queryOptions({
    ...options,
    queryKey: ["shipping-methods"],
    queryFn: () => getShippingMethods(),
  })
}

export type GetShippingMethodsResponse = Awaited<
  ReturnType<typeof getShippingMethods>
>

export function useShippingMethods(
  queryOptions: typeof createShippingMethodsQueryOptions = createShippingMethodsQueryOptions,
) {
  const { data: shippingMethods, error, isLoading } = useQuery(queryOptions())

  return { shippingMethods, error, isLoading }
}

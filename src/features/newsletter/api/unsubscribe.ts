import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import z from "zod"

const api = import.meta.env.VITE_API_ENDPOINT

export const newsletterUnsubscribe = async (token: string) => {
  const { data } = await axios.post<{
    success: boolean
    message: string
  }>(
    `${api}/newsletter/unsubscribe`,
    { token },
    { headers: { "Content-Type": "application/json" } },
  )

  return data
}

export type NewsletterUnsubscribeResponse = ReturnType<
  typeof newsletterUnsubscribe
>

export type NewsletterUnsubscribeSearch = z.infer<
  typeof unsubscribeParamsSchema
>

export const unsubscribeParamsSchema = z.object({
  token: z.jwt(),
})

export function useNewsletterUnsubscribe() {
  const {
    mutate: unsubscribe,
    isPending,
    error,
  } = useMutation<unknown, Error & AxiosError, string, unknown>({
    mutationFn: (token: string): NewsletterUnsubscribeResponse =>
      newsletterUnsubscribe(token),
  })

  return { unsubscribe, isPending, error }
}

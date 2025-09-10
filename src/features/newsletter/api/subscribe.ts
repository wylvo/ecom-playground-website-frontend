import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import z from "zod"

const api = import.meta.env.VITE_API_ENDPOINT

export const newsletterSubscribe = async ({
  firstName,
  email,
  captchaToken: token,
}: NewsletterSubscribe) => {
  const { data } = await axios.post<{
    success: boolean
    message: string
  }>(
    `${api}/newsletter/subscribe`,
    { firstName, email, token },
    { headers: { "Content-Type": "application/json" } },
  )

  return data
}

export type NewsletterSubscribeResponse = ReturnType<typeof newsletterSubscribe>

export type NewsletterSubscribe = z.infer<typeof subscribeSchema>

export const subscribeSchema = z.object({
  email: z.email({ error: "Please insert a valid email" }),
  firstName: z
    .string()
    .min(2, { error: "Your first name can't be less than 2 characters" })
    .max(50, { error: "Your first name can't exceed 50 characters" }),
  captchaToken: z.string({ error: "Please complete the challenge" }),
})

export function useNewsletterSubscribe() {
  const {
    mutate: subscribe,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({
      firstName,
      email,
      captchaToken,
    }: NewsletterSubscribe): NewsletterSubscribeResponse =>
      newsletterSubscribe({ firstName, email, captchaToken }),
  })

  return { subscribe, isPending, error }
}

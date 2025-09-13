import { createFileRoute, redirect } from "@tanstack/react-router"
import z from "zod"

import { unsubscribeParamsSchema } from "@/features/newsletter/api/unsubscribe"
import Unsubscribe from "@/features/newsletter/components/unsubscribe"

export const Route = createFileRoute(
  "/{-$locale}/(app)/newsletter/unsubscribe",
)({
  beforeLoad: ({ search }) => {
    try {
      unsubscribeParamsSchema.parse(search)
    } catch (error) {
      if (error instanceof z.ZodError) throw redirect({ to: "/{-$locale}" })
      else throw error
    }
  },
  component: Unsubscribe,
  validateSearch: unsubscribeParamsSchema,
})

import { Button } from "@/components/ui/shadcn/button"
import { getRouteApi } from "@tanstack/react-router"
import { useNewsletterUnsubscribe } from "../api/unsubscribe"
import NewsletterLayout from "@/components/layouts/newsletter-layout"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import UnsubscribeError from "./unsubscribe-error"

const route = getRouteApi("/{-$locale}/(app)/newsletter/unsubscribe")

function Unsubscribe() {
  const { token } = route.useSearch()
  const [isUnsubscribed, setIsUnsubscribed] = useState(false)
  const { unsubscribe, isPending, error } = useNewsletterUnsubscribe()

  async function handleUnsubscribe() {
    unsubscribe(token, {
      onSuccess: () => {
        toast.success("You've successfully unsubscribed from our newsletter!")
        setIsUnsubscribed(true)
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Unsubscription failed. Please try again later.",
          {
            style: {
              color: "var(--destructive)",
            },
          },
        )
        setIsUnsubscribed(false)
      },
    })
  }

  if (error) return <UnsubscribeError error={error} />

  return (
    <NewsletterLayout>
      <div className="flex flex-col gap-8 max-w-2xl p-12 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium">
            {isUnsubscribed
              ? "You've successfully unsubscribed from our newsletter"
              : "Do you want to unsubscribe?"}
          </h1>
          {!isUnsubscribed && (
            <p className="text-muted-foreground text-sm">
              We'll stop sending emails to you right away if you confirm.
            </p>
          )}
        </div>
        {!isUnsubscribed && (
          <div>
            <Button
              className="text-md w-[80%]"
              size="lg"
              disabled={isPending}
              onClick={handleUnsubscribe}
            >
              {isPending ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Unsubscribing
                </>
              ) : (
                "Unsubscribe"
              )}
            </Button>
          </div>
        )}
      </div>
    </NewsletterLayout>
  )
}

export default Unsubscribe

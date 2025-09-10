import NewsletterLayout from "@/components/layouts/newsletter-layout"
import type { AxiosError } from "axios"

type UnsubscribeErrorProps = {
  error: Error & AxiosError
}

function UnsubscribeError({ error }: UnsubscribeErrorProps) {
  return (
    <NewsletterLayout>
      <div className="flex flex-col gap-8 max-w-2xl p-12 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium">An error occured</h1>
          <p className="text-muted-foreground text-sm">
            {error?.response?.data?.message || "Something went wrong!"}
          </p>
        </div>
      </div>
    </NewsletterLayout>
  )
}

export default UnsubscribeError

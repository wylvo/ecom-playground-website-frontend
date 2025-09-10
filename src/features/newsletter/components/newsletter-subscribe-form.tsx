import { useRef } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/shadcn/input"
import { Button } from "@/components/ui/shadcn/button"
import ButtonWithIcon from "@/components/ui/button-with-icon"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/shadcn/form"
import {
  subscribeSchema,
  useNewsletterSubscribe,
} from "@/features/newsletter/api/subscribe"

type SubscribeFormFields = z.infer<typeof subscribeSchema>

const route = getRouteApi(
  window.location.pathname === "/" ? "/" : "/{-$locale}/",
)

const siteKey = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_INVISIBLE_SITE_KEY

function NewsletterSubscribeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { locale } = route.useRouteContext()
  const { subscribe, isPending } = useNewsletterSubscribe()

  const ref = useRef<TurnstileInstance | null>(null)

  const form = useForm<SubscribeFormFields>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      email: "",
      firstName: "",
      captchaToken: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const handleSubmit = async (data: SubscribeFormFields) => {
    const { captchaToken } = data

    if (!captchaToken) {
      toast.error("Please complete the challenge", {
        style: {
          color: "var(--destructive)",
        },
      })
      return
    }

    subscribe(data, {
      onSuccess: () => {
        toast.success("You've successfully subscribed to our newsletter!")
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            "Subscription failed. Please try again later.",
          {
            style: {
              color: "var(--destructive)",
            },
          },
        )
      },
      onSettled: () => {
        // Reset the Turnstile component by changing the key to generate a new challenge
        ref.current?.reset()
        form.reset()
        form.clearErrors()
      },
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Subscribe to our newsletter</CardTitle>
          <CardDescription>
            Receive occasional newsletter of the latest exclusive offers,
            information on sales, discounts and much more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <div className="flex items-center">
                          <FormLabel>First name</FormLabel>
                        </div>
                        <FormControl>
                          <Input type="text" disabled={isPending} {...field} />
                        </FormControl>
                        {errors.firstName && (
                          <FormDescription className="text-(--destructive)">
                            {errors.firstName.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            autoComplete="email"
                            placeholder="email@example.com"
                            disabled={isPending}
                            {...field}
                          />
                        </FormControl>
                        {errors.email && (
                          <FormDescription className="text-(--destructive)">
                            {errors.email.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="captchaToken"
                    render={({ field }) => (
                      <FormItem className="hidden">
                        <FormControl>
                          <Turnstile
                            ref={ref}
                            onSuccess={(token) => field.onChange(token)}
                            siteKey={siteKey}
                            options={{
                              theme: "dark",
                              language: locale,
                              size: "flexible",
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {isPending ? (
                    <ButtonWithIcon
                      icon={<Loader2Icon className="animate-spin" />}
                      disabled
                    >
                      Subscribing...
                    </ButtonWithIcon>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isPending}
                    >
                      Subscribe
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewsletterSubscribeForm

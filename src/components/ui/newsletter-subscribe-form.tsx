import { useRef, useState } from "react"
import axios from "axios"
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

const subscribeSchema = z.object({
  email: z.email({ error: "Please insert a valid email" }),
  firstName: z
    .string()
    .min(2, { error: "Your first name can't be less than 2 characters" })
    .max(50, { error: "Your first name can't exceed 50 characters" }),
  captchaToken: z.string({ error: "Please complete the challenge" }),
})

type SubscribeFormFields = z.infer<typeof subscribeSchema>

const route = getRouteApi(
  window.location.pathname === "/" ? "/" : "/{-$locale}/",
)

const siteKey = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_INVISIBLE_SITE_KEY
const api = import.meta.env.VITE_API_ENDPOINT

function NewsletterSubscribeForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { locale } = route.useRouteContext()

  const ref = useRef<TurnstileInstance | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    const { email, firstName, captchaToken } = data

    if (!captchaToken) {
      toast.error("Please complete the challenge", {
        style: {
          color: "var(--destructive)",
        },
      })
      return
    }

    setIsLoading(true)

    try {
      const { data } = await axios.post(
        `${api}/newsletter/subscribe`,
        { email, firstName, token: captchaToken },
        { headers: { "Content-Type": "application/json" } },
      )

      console.log("RES RAW:", data)

      if (data.success)
        toast.success(`You've successfully subscribed to our newsletter!`)
      else
        toast.error("Subscription failed. Please try again later.", {
          style: {
            color: "var(--destructive)",
          },
        })
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Subscription failed. Please try again later.",
        {
          style: {
            color: "var(--destructive)",
          },
        },
      )
    } finally {
      // Reset the Turnstile component by changing the key to generate a new challenge
      ref.current?.reset()
      form.reset()
      form.clearErrors()
      setIsLoading(false)
    }
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
                          <Input type="text" disabled={isLoading} {...field} />
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
                            disabled={isLoading}
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

                  {isLoading ? (
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
                      disabled={isLoading}
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

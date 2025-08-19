import { useRef, useState } from "react"
import { getRouteApi, Link } from "@tanstack/react-router"
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
import { Checkbox } from "@/components/ui/shadcn/checkbox"

const registerSchema = z.object({
  email: z.email({ error: "Please insert a valid email" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" }),
  hasAcceptedTerms: z.boolean().refine((val) => val === true),
  captchaToken: z.string({ error: "Please complete the challenge" }),
})

type RegisterFormFields = z.infer<typeof registerSchema>

const route = getRouteApi("/{-$locale}/(auth)/register")

const siteKey = import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY

function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const { auth, locale } = route.useRouteContext()
  const { redirect } = route.useSearch()

  const ref = useRef<TurnstileInstance | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      hasAcceptedTerms: false,
      captchaToken: "",
    },
  })

  const {
    formState: { errors },
  } = form

  async function handleSubmit(data: RegisterFormFields) {
    const { email, password, hasAcceptedTerms, captchaToken } = data

    if (!hasAcceptedTerms) {
      toast.error("Please accept terms & privacy policy", {
        style: {
          color: "var(--destructive)",
        },
      })
      return
    }

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
      await auth.signUp(email, password, captchaToken)

      // Supabase auth will automatically update context
      window.location.href = redirect
    } catch (error: any) {
      toast.error("Sign up failed", {
        style: {
          color: "var(--destructive)",
        },
      })
    } finally {
      // Reset the Turnstile component by changing the key to generate a new challenge
      ref.current?.reset()
      form.reset({
        hasAcceptedTerms: true,
      })
      form.clearErrors()
      setIsLoading(false)
    }

    if (auth.user)
      toast.success(
        `You've successfully signed up! ${auth.user.email} [${auth.user.id}]`,
      )
  }

  async function handleGuest() {
    const captchaToken = ref.current?.getResponse()

    if (!captchaToken) {
      toast.error("Please complete the challenge", {
        style: {
          color: "var(--destructive)",
        },
      })
      return
    }

    try {
      await auth.loginAnonymously(captchaToken)

      // Supabase auth will automatically update context
      window.location.href = redirect
    } catch (error: any) {
      toast.error("Guest sign up failed", {
        style: {
          color: "var(--destructive)",
        },
      })
    } finally {
      // Reset the Turnstile component by changing the key to generate a new challenge
      ref.current?.reset()
      setIsLoading(false)
    }

    if (auth.user)
      toast.success(
        `You've successfully signed up! ${auth.user.email} [${auth.user.id}]`,
      )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription className="text-sm">
            Sign up to get exclusive offers, faster checkouts and much more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-6">
                <div className="grid gap-6">
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
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        {errors.password && (
                          <FormDescription className="text-(--destructive)">
                            {errors.password.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasAcceptedTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Checkbox
                            id="hasAcceptedTerms"
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="inline-block text-xs font-normal *:[a]:hover:text-primary text-center text-balance *:[a]:underline *:[a]:underline-offset-4">
                          Accept <a href="#">Terms of Service</a> and{" "}
                          <a href="#">Privacy Policy</a>
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="captchaToken"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormControl>
                          <Turnstile
                            ref={ref}
                            onSuccess={(token) => field.onChange(token)}
                            siteKey={siteKey}
                            options={{
                              theme: "dark", // or 'dark'
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
                      Signing up...
                    </ButtonWithIcon>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      Sign Up
                    </Button>
                  )}
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {/* <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    Sign Up with Apple
                  </Button> */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Sign up with Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={isLoading}
                    onClick={handleGuest}
                  >
                    Continue as guest
                  </Button>
                </div>
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    from="/{-$locale}/register"
                    to="/{-$locale}/login"
                    search
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

export default RegisterForm

import { Button } from "@/components/ui/shadcn/button"
import { Card } from "@/components/ui/shadcn/card"
import { Input } from "@/components/ui/shadcn/input"
import { useNavigate } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { checkoutSchema } from "../api/checkout"
import type z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/shadcn/form"

const checkoutEmailSchema = checkoutSchema.pick({
  email: true,
})

type CheckoutEmailSchema = z.infer<typeof checkoutEmailSchema>

function Customer() {
  const navigate = useNavigate({ from: "/{-$locale}/checkout/customer" })
  const form = useForm<CheckoutEmailSchema>({
    resolver: zodResolver(checkoutEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const {
    formState: { errors },
  } = form

  const handleClickSignIn = () =>
    navigate({
      to: "/{-$locale}/sign-in",
      search: { redirect: "/{-$locale}/checkout/details" },
    })

  const handleClickRegister = () =>
    navigate({
      to: "/{-$locale}/register",
      search: { redirect: "/{-$locale}/checkout/details" },
    })

  function handleSubmitGuest(data: CheckoutEmailSchema) {
    console.log(data)
    navigate({
      to: "/{-$locale}/register",
      search: { redirect: "/{-$locale}/checkout/details" },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center justify-center gap-24 p-8">
        <Card className="flex flex-col text-center gap-8 border-none shadow-none">
          <div>
            <h1 className="text-2xl">Customer Checkout</h1>
            <p className="text-muted-foreground text-sm">
              Log in or register for faster checkout
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button onClick={handleClickSignIn}>Sign in</Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or
              </span>
            </div>
            <Button onClick={handleClickRegister} variant="outline">
              Register
            </Button>
          </div>
        </Card>
        <div className="h-40 border-l border-gray-200"></div>
        <Card className="flex flex-col text-center gap-8 border-none shadow-none">
          <div>
            <h1 className="text-2xl">Guest Checkout</h1>
            <p className="text-muted-foreground text-sm">
              Order without logging in with an account
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmitGuest)}
                className="flex flex-col gap-2"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          autoComplete="email"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      {errors.email && (
                        <FormDescription className="text-(--destructive) text-left">
                          {errors.email.message}
                        </FormDescription>
                      )}
                    </FormItem>
                  )}
                />
                <Button type="submit">Continue as guest</Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Customer

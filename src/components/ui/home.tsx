import { getRouteApi, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/shadcn/button"
import AppLayout from "@/components/layouts/app-layout"
import { toast } from "sonner"
import ButtonWithIcon from "./button-with-icon"
import { Loader2Icon } from "lucide-react"
import { useSupabaseAuth } from "@/features/auth/contexts/supabase-auth-context"
import NewsletterSubscribeForm from "@/components/ui/newsletter-subscribe-form"
import { useTranslation } from "react-i18next"

const route = getRouteApi(
  window.location.pathname === "/" ? "/" : "/{-$locale}/",
)

function Home() {
  const { locale } = route.useRouteContext()
  const supabaseAuth = useSupabaseAuth()
  const { t } = useTranslation()

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <Link to={"/en" as string}>ENGLISH</Link>
        <div>
          <h1>
            {t("welcome")} "{route.id}"!
          </h1>
          <p>Locale: {locale}</p>
          {!supabaseAuth.user && <p>AUTH USER is undefined</p>}
          {supabaseAuth.user && (
            <pre>{JSON.stringify(supabaseAuth.user, null, 2)}</pre>
          )}
        </div>
        <div>
          <Button
            onClick={() =>
              toast.error("Boo!", {
                style: {
                  color: "var(--destructive)",
                },
              })
            }
          >
            Click Me
          </Button>
        </div>
        <div>
          <ButtonWithIcon
            icon={<Loader2Icon className="animate-spin" />}
            disabled
          >
            Logging in...
          </ButtonWithIcon>
        </div>
        <NewsletterSubscribeForm />
      </div>
    </AppLayout>
  )
}

export default Home

import { getRouteApi } from "@tanstack/react-router"
import { useSupabaseAuth } from "@/features/auth/contexts/supabase-auth-context"
import NewsletterSubscribeForm from "@/features/newsletter/components/newsletter-subscribe-form"
import { useTranslation } from "react-i18next"
import Section from "./section"
import Wrapper from "./wrapper"

const route = getRouteApi(
  window.location.pathname === "/" ? "/" : "/{-$locale}/",
)

function Home() {
  const { locale } = route.useRouteContext()
  const supabaseAuth = useSupabaseAuth()
  const { t } = useTranslation()

  return (
    <Section>
      <Wrapper>
        <div className="flex flex-col gap-4">
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
          <NewsletterSubscribeForm className="min-w-md mx-auto" />
        </div>
      </Wrapper>
    </Section>
  )
}

export default Home

import { useEffect, useState } from "react"
import { useRouter } from "@tanstack/react-router"
import i18n from "@/lib/i18n"

/**
 * A hook that manages language change effects in the application.
 * It tracks the current i18n locale and updates the document's text direction
 * when the language changes. The hook also forces a component rerender by
 * updating state and triggers a router invalidation to ensure the application
 * updates accordingly.
 *
 * The hook uses a state setter to trigger rerenders and sets up an i18n
 * languageChanged event listener to handle language changes. It cleans up
 * the event listener when the component unmounts.
 *
 */
export function useLanguageChange() {
  const [, setLocale] = useState(i18n.language)
  const router = useRouter()

  useEffect(() => {
    const handler = (locale: string) => {
      console.log("LOCALE:", locale)

      setLocale(locale)
      document.documentElement.dir = i18n.dir(locale)
      void router?.invalidate()
    }

    i18n.on("languageChanged", handler)

    return () => i18n.off("languageChanged", handler)
  }, [router])
}

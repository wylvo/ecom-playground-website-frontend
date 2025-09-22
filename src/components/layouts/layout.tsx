import { defaultLocale, type Locale } from "@/types/locale"
import type React from "react"
import AuthLayout from "./auth-layout"
import CheckoutLayout from "./checkout-layout"
import NewsletterLayout from "./newsletter-layout"
import AppLayout from "./app-layout"

type LayoutProps = {
  pathname: string
  locale?: Locale
  children: React.ReactNode
}

function DispatchLayout({ pathname, children }: LayoutProps) {
  const isAuthLayout =
    pathname.startsWith("/register") || pathname.startsWith("/sign-in")
  const isCheckoutLayout = pathname.startsWith("/checkout")
  const isNewsletterLayout = pathname.startsWith("/newsletter")

  if (isAuthLayout) return <AuthLayout>{children}</AuthLayout>
  if (isCheckoutLayout) return <CheckoutLayout>{children}</CheckoutLayout>
  if (isNewsletterLayout) return <NewsletterLayout>{children}</NewsletterLayout>
  return <AppLayout>{children}</AppLayout>
}

function DispatchLayoutWithLocale({ pathname, locale, children }: LayoutProps) {
  const isAuthLayout =
    pathname.startsWith(`/${locale}/register`) ||
    pathname.startsWith(`/${locale}/sign-in`)
  const isCheckoutLayout = pathname.startsWith(`/${locale}/checkout`)
  const isNewsletterLayout = pathname.startsWith(`/${locale}/newsletter`)

  if (isAuthLayout) return <AuthLayout>{children}</AuthLayout>
  if (isCheckoutLayout) return <CheckoutLayout>{children}</CheckoutLayout>
  if (isNewsletterLayout) return <NewsletterLayout>{children}</NewsletterLayout>
  return <AppLayout>{children}</AppLayout>
}

function Layout({ pathname, locale, children }: LayoutProps) {
  if (!locale || locale === defaultLocale)
    return <DispatchLayout pathname={pathname} children={children} />
  if (locale)
    return (
      <DispatchLayoutWithLocale
        pathname={pathname}
        locale={locale}
        children={children}
      />
    )
}

export default Layout

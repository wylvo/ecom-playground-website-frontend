import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { defaultLocale, supportedLocales, type Locale } from "@/types/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// // Utility to get a safe locale with fallback to default
// export function getValidLocale(locale: string | undefined): Locale {
//   return supportedLocales.includes(locale as Locale)
//     ? (locale as Locale)
//     : defaultLocale;
// }

// Utility to get a safe locale with fallback to default
export function isValidLocale(locale: string | undefined): locale is Locale {
  return supportedLocales.includes(locale as Locale)
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type FormatPrice = {
  cents: number
  locale?: Locale
  currency?: string
  displayCurrencyCode?: boolean
}

export function formatPrice({
  cents,
  locale = defaultLocale,
  currency = "CAD",
  displayCurrencyCode,
}: FormatPrice) {
  const dollars = cents / 100

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: "symbol",
    ...(displayCurrencyCode && { currencyDisplay: "code" }),
  })

  return formatter.format(dollars)
}

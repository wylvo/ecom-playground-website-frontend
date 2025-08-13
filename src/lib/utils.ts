import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { supportedLocales, type Locale } from "@/types/locale"

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

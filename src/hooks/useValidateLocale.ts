import { defaultLocale, supportedLocales, type Locale } from "@/types/locale";

// // Type-safe locale validation
// export function useValidateLocale(
//   locale: string | undefined,
// ): locale is Locale {
//   return supportedLocales.includes(locale as Locale);
// }

// Type-safe locale validation
export function useValidateLocale(locale: string | undefined): Locale {
  return supportedLocales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;
}

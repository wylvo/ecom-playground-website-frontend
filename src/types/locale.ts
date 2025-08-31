// Define supported locales as a constant tuple
export const supportedLocales = ["en-CA", "fr-CA"] as const

// Derive Locale type from the tuple
export type Locale = (typeof supportedLocales)[number]

// Define a default locale
export const defaultLocale: Locale = "fr-CA"

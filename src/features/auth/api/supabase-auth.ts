import supabase from "@/services/supabase"

export interface AuthRequiredFields {
  email: string
  password: string
  captchaToken: string
}

export async function signUp({
  email,
  password,
  captchaToken,
}: AuthRequiredFields) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { captchaToken },
  })
  if (error) throw error
}

export async function signIn({
  email,
  password,
  captchaToken,
}: AuthRequiredFields) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
    options: { captchaToken },
  })
  if (error) throw error
}

export async function signInAnonymously(captchaToken: string) {
  const { error } = await supabase.auth.signInAnonymously({
    options: { captchaToken },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

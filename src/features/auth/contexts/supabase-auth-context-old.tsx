import supabase from "@/services/supabase"
import type { User } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"

export interface SupabaseAuthState {
  isAuthenticated: boolean
  user: User
  login: (
    email: string,
    password: string,
    captchaToken: string,
  ) => Promise<void>
  loginAnonymously: (captchaToken: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (
    email: string,
    password: string,
    captchaToken: string,
  ) => Promise<void>
  isLoading: boolean
}

const SupabaseAuthContext = createContext<SupabaseAuthState | undefined>(
  undefined,
)

function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getClaims().then(({ data }) => {
      setUser(data?.claims ?? null)
      setIsAuthenticated(!!data?.claims)
      setIsLoading(false)
    })

    // const claims = async () => (await supabase.auth.getClaims()).data?.claims

    // setUser(claims ?? null)
    // setIsAuthenticated(!!claims)
    // setIsLoading(false)

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
      setIsLoading(false)
      console.log(session)
      console.log(_event)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (
    email: string,
    password: string,
    captchaToken: string,
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken },
    })
    if (error) throw error
  }

  const loginAnonymously = async (captchaToken: string) => {
    const { error } = await supabase.auth.signInAnonymously({
      options: { captchaToken },
    })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const signUp = async (
    email: string,
    password: string,
    captchaToken: string,
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
      },
    })
    if (error) throw error
  }

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginAnonymously,
        logout,
        signUp,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined)
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider")
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { SupabaseAuthProvider, useSupabaseAuth }

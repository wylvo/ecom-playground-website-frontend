import { createContext, useContext, useEffect, useState } from "react"
import supabase from "@/services/supabase"
import {
  type JwtPayload,
  type User as SupabaseUser,
} from "@supabase/supabase-js"
import { useMutation, type UseMutateFunction } from "@tanstack/react-query"
import type { AuthRequiredFields } from "@/features/auth/api/supabase-auth.ts"
import * as supabaseAuth from "@/features/auth/api/supabase-auth.ts"

export type UserClaims = JwtPayload | undefined
export type User = SupabaseUser | UserClaims | null
export type SessionAccessToken = string | null | undefined

export interface SupabaseAuthContext {
  isAuthenticated: boolean
  user: User
  accessToken: SessionAccessToken
  signUp: UseMutateFunction<void, Error, AuthRequiredFields, unknown>
  signIn: UseMutateFunction<void, Error, AuthRequiredFields, unknown>
  signInAnonymously: UseMutateFunction<void, Error, string, unknown>
  signInWithGoogle: UseMutateFunction<void, Error, void, unknown>
  signOut: UseMutateFunction<void, Error, void, unknown>
  isLoading: boolean
  error: Error | null
}

// Create the context
const SupabaseAuthContext = createContext<SupabaseAuthContext | undefined>(
  undefined,
)

interface SupabaseAuthProviderProps {
  children: React.ReactNode
}

function SupabaseAuthProvider({ children }: SupabaseAuthProviderProps) {
  const [user, setUser] = useState<User>()
  const [accessToken, setAccessToken] = useState<SessionAccessToken>()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on mount
  useEffect(() => {
    supabase.auth.getClaims().then(({ data }) => {
      setUser(data?.claims ?? null)
      setIsAuthenticated(!!data?.claims)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)
      setAccessToken(session?.access_token ?? null)
      console.log(_event)
    })

    return () => subscription.unsubscribe()
  }, [])

  const {
    mutate: signUp,
    isPending: isSigningUp,
    error: signUpError,
  } = useMutation({
    mutationFn: ({ email, password, captchaToken }: AuthRequiredFields) =>
      supabaseAuth.signUp({ email, password, captchaToken }),
  })

  const {
    mutate: signIn,
    isPending: isSigningIn,
    error: signInError,
  } = useMutation({
    mutationFn: ({ email, password, captchaToken }: AuthRequiredFields) =>
      supabaseAuth.signIn({ email, password, captchaToken }),
  })

  const {
    mutate: signInAnonymously,
    isPending: isSigningAnonymously,
    error: anonymousSignInError,
  } = useMutation({
    mutationFn: (captchaToken: string) =>
      supabaseAuth.signInAnonymously(captchaToken),
  })

  const {
    mutate: signInWithGoogle,
    isPending: isSigningInWithGoogle,
    error: signInWithGoogleError,
  } = useMutation({
    mutationFn: () => supabaseAuth.signInWithGoogle(),
  })

  const {
    mutate: signOut,
    isPending: isSigningOut,
    error: signOutError,
  } = useMutation({
    mutationFn: () => supabaseAuth.signOut(),
  })

  // Consolidate loading and error states
  const isLoading =
    isSigningIn ||
    isSigningAnonymously ||
    isSigningOut ||
    isSigningUp ||
    isSigningInWithGoogle
  const error =
    signInError ||
    anonymousSignInError ||
    signOutError ||
    signUpError ||
    signInWithGoogleError

  return (
    <SupabaseAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        accessToken,
        signIn,
        signInAnonymously,
        signOut,
        signInWithGoogle,
        signUp,
        isLoading,
        error,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  )
}

// Custom hook to use authentication context
function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext)
  if (context === undefined)
    throw new Error("useSupabaseAuth must be used within SupabaseAuthProvider")
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { SupabaseAuthProvider, useSupabaseAuth }

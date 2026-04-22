import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Role, UserRow } from '@/lib/types'

interface AuthState {
  session: Session | null
  user: UserRow | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (args: { email: string; password: string; role: Role; name: string }) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<UserRow | null>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async (authId: string | undefined) => {
    if (!authId) {
      setUser(null)
      return
    }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authId)
      .maybeSingle()
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[auth] load user failed', error)
    }
    setUser((data as UserRow | null) ?? null)
  }, [])

  useEffect(() => {
    let initialised = false

    // onAuthStateChange fires immediately with INITIAL_SESSION, so we use
    // that as the single source of truth and skip the separate getSession call
    // to avoid two simultaneous auth-lock acquisitions.
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, next) => {
      setSession(next)
      await loadUser(next?.user.id)
      if (!initialised) {
        initialised = true
        setLoading(false)
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [loadUser])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signUp = useCallback(
    async ({ email, password, role, name }: { email: string; password: string; role: Role; name: string }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, name },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      })
      if (error) throw error
    },
    [],
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    await loadUser(session?.user.id)
  }, [loadUser, session])

  const value = useMemo<AuthState>(
    () => ({ session, user, loading, signIn, signUp, signOut, refreshUser }),
    [session, user, loading, signIn, signUp, signOut, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

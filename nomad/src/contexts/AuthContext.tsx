import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { seedGuestData } from '../lib/seedGuestData'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signInAsGuest: () => void
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  isDemo: boolean
  isGuest: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@nomad.app',
} as User

const GUEST_USER = {
  id: 'guest-user-id',
  email: 'guest@nomad.app',
} as User

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const isDemo = !isSupabaseConfigured

  useEffect(() => {
    if (!supabase) {
      const guestSession = localStorage.getItem('nomad-guest-session')
      const demoSession = localStorage.getItem('nomad-demo-session')
      if (guestSession) {
        setUser(GUEST_USER)
        setIsGuest(true)
      } else if (demoSession) {
        setUser(DEMO_USER)
      }
      setLoading(false)
      return
    }

    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session)
        setUser(session?.user ?? null)
      })
      .catch(() => {
        // Supabase unreachable — still show login page
      })
      .finally(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      localStorage.setItem('nomad-demo-session', '1')
      setUser(DEMO_USER)
      return { error: null }
    }
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message ?? null }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      localStorage.setItem('nomad-demo-session', '1')
      setUser(DEMO_USER)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signInAsGuest = () => {
    seedGuestData()
    localStorage.setItem('nomad-guest-session', '1')
    localStorage.removeItem('nomad-demo-session')
    setUser(GUEST_USER)
    setIsGuest(true)
  }

  const signOut = async () => {
    if (!supabase) {
      localStorage.removeItem('nomad-demo-session')
      localStorage.removeItem('nomad-guest-session')
      setUser(null)
      setIsGuest(false)
      return
    }
    await supabase.auth.signOut()
    setIsGuest(false)
  }

  const resetPassword = async (email: string) => {
    if (!supabase) return { error: null }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error: error?.message ?? null }
  }

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signUp, signIn, signInAsGuest, signOut, resetPassword, isDemo, isGuest }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

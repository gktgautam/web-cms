import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api } from '../../lib/api'
import { queryClient } from '../../lib/queryClient'

type Role = 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER' | 'VIEWER'

type AuthUser = {
  id: string
  email: string
  role: Role
  name?: string | null
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  email: string
  name: string
  password: string
  role?: Role
  departmentId?: string
}

type AuthContextValue = {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  ready: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  ready: boolean
}

const TOKEN_KEY = 'accessToken'
const USER_KEY = 'authUser'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const parseStoredUser = (value: string | null): AuthUser | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as AuthUser
  } catch (e) {
    console.warn('Failed to parse stored user', e)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, ready: false })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const storedToken = window.localStorage.getItem(TOKEN_KEY)
    const storedUser = parseStoredUser(window.localStorage.getItem(USER_KEY))
    setState({ token: storedToken, user: storedUser, ready: true })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !state.ready) return
    if (state.token) {
      window.localStorage.setItem(TOKEN_KEY, state.token)
    } else {
      window.localStorage.removeItem(TOKEN_KEY)
    }
  }, [state.token, state.ready])

  useEffect(() => {
    if (typeof window === 'undefined' || !state.ready) return
    if (state.user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(state.user))
    } else {
      window.localStorage.removeItem(USER_KEY)
    }
  }, [state.user, state.ready])

  const login = useCallback(async ({ email, password }: LoginPayload) => {
    const { data } = await api.post('/auth/login', { email, password })
    setState({ user: data.user, token: data.accessToken, ready: true })
    queryClient.clear()
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await api.post('/auth/register', payload)
  }, [])

  const logout = useCallback(() => {
    setState({ user: null, token: null, ready: true })
    queryClient.clear()
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user: state.user,
    token: state.token,
    isAuthenticated: Boolean(state.token),
    ready: state.ready,
    login,
    register,
    logout
  }), [state, login, register, logout])

  if (!state.ready) {
    return <div>Loading…</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type AuthUser = {
  name: string
  identifier: string
}

type LoginPayload = {
  identifier: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'hr-cms:auth'
const allowedIdentifiers = ['logelin', 'logelin@cms.com']
const allowedPassword = 'cms123'
const allowedName = 'Logelin'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as AuthUser) : null
    } catch (error) {
      console.error('Failed to restore auth state', error)
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const logout = useCallback(() => {
    setUser(null)
    setError(null)
  }, [])

  const login = useCallback(async ({ identifier, password }: LoginPayload) => {
    setIsLoading(true)
    setError(null)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const normalized = identifier.trim().toLowerCase()
    const isValidIdentifier = allowedIdentifiers.includes(normalized)
    const isValidPassword = password === allowedPassword

    if (isValidIdentifier && isValidPassword) {
      setUser({
        name: allowedName,
        identifier: normalized,
      })
      setIsLoading(false)
      return true
    }

    setError('Those credentials do not match our records for Logelin.')
    setIsLoading(false)
    return false
  }, [])

  const value = useMemo(
    () => ({ user, isLoading, error, login, logout }),
    [user, isLoading, error, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

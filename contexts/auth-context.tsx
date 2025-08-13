"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User, type AuthState, AuthService } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = AuthService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const { user: loggedInUser, error } = await AuthService.login(email, password)

    if (loggedInUser) {
      setUser(loggedInUser)
      setIsLoading(false)
      return { success: true }
    } else {
      setIsLoading(false)
      return { success: false, error: error || "Login failed" }
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    const { user: newUser, error } = await AuthService.signup(username, email, password)

    if (newUser) {
      setUser(newUser)
      setIsLoading(false)
      return { success: true }
    } else {
      setIsLoading(false)
      return { success: false, error: error || "Signup failed" }
    }
  }

  const logout = () => {
    AuthService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

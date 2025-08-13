export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  spaces: string[]
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

// Simple client-side auth simulation
export class AuthService {
  private static readonly STORAGE_KEY = "metaverse_auth"
  private static readonly USERS_KEY = "metaverse_users"

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const authData = localStorage.getItem(this.STORAGE_KEY)
      return authData ? JSON.parse(authData) : null
    } catch {
      return null
    }
  }

  static async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const users = this.getStoredUsers()
      const user = users.find((u) => u.email === email)

      if (!user) {
        return { user: null, error: "User not found" }
      }

      // In a real app, you'd verify the password hash
      // For demo purposes, we'll just check if password is not empty
      if (!password) {
        return { user: null, error: "Invalid password" }
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
      return { user, error: null }
    } catch (error) {
      return { user: null, error: "Login failed" }
    }
  }

  static async signup(
    username: string,
    email: string,
    password: string,
  ): Promise<{ user: User | null; error: string | null }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const users = this.getStoredUsers()

      // Check if user already exists
      if (users.find((u) => u.email === email)) {
        return { user: null, error: "User already exists" }
      }

      if (users.find((u) => u.username === username)) {
        return { user: null, error: "Username already taken" }
      }

      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        createdAt: new Date().toISOString(),
        spaces: [],
      }

      users.push(newUser)
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users))
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser))

      return { user: newUser, error: null }
    } catch (error) {
      return { user: null, error: "Signup failed" }
    }
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.STORAGE_KEY)
    }
  }

  private static getStoredUsers(): User[] {
    if (typeof window === "undefined") return []

    try {
      const users = localStorage.getItem(this.USERS_KEY)
      return users ? JSON.parse(users) : []
    } catch {
      return []
    }
  }
}

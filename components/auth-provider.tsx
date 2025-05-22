"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { setTokenFromUrl, getUserInfo, logout as authLogout } from "@/lib/auth"

interface UserInfo {
  id: string
  name: string
  email: string
  role: string
  photoUrl?: string
}

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  userInfo: UserInfo | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  userInfo: null,
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()

  const logout = () => {
    authLogout()
    setIsAuth(false)
    setUserInfo(null)
    router.push("/login")
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for token in URL first
        setTokenFromUrl()
        
        // Get user info and check auth status in one call
        const info = await getUserInfo()
        setUserInfo(info)
        setIsAuth(info !== null)
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsAuth(false)
        setUserInfo(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated: isAuth, isLoading, userInfo, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 
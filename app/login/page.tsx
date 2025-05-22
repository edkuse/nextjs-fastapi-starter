"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { loginWithAzureAD } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      await loginWithAzureAD()
      // The page will be redirected by loginWithAzureAD, so no need to use router.push here
    } catch (error) {
      console.error("Login failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>Sign in to your account using Azure AD</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full">
            {isLoading ? "Signing in..." : "Sign in with Azure AD"}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">By signing in, you agree to our Terms of Service and Privacy Policy.</p>
        </CardFooter>
      </Card>
    </div>
  )
}

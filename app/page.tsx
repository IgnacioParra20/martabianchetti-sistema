"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../hooks/useAuth"

export default function HomePage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && currentUser) {
        console.log("Redirigiendo usuario autenticado a:", currentUser.role)
        router.replace(`/${currentUser.role}`)
      } else {
        console.log("Usuario no autenticado, redirigiendo a login")
        router.replace("/login")
      }
    }
  }, [isAuthenticated, currentUser, isLoading, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{isLoading ? "Verificando sesión..." : "Redirigiendo..."}</p>
      </div>
    </div>
  )
}

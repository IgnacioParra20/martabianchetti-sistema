"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AdminSimulationDashboard } from "../../../components/admin-simulation-dashboard"
import { AppLayout } from "../../../components/app-layout"
import { useAuth } from "../../../hooks/useAuth"

export default function SimulacionPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("No autenticado, redirigiendo a login")
        router.replace("/login")
        return
      }

      if (currentUser && currentUser.role !== "admin") {
        console.log("Acceso denegado - Solo administradores")
        router.replace(`/${currentUser.role}`)
        return
      }
    }
  }, [isAuthenticated, currentUser, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando simulador avanzado...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser || currentUser.role !== "admin") {
    return null
  }

  return (
    <AppLayout>
      <AdminSimulationDashboard />
    </AppLayout>
  )
}

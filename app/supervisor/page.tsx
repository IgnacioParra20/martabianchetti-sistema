"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"
import { useOrderManagement } from "../../hooks/useOrderManagement"
import { SupervisorDashboard } from "../../components/supervisor-dashboard"
import { AppLayout } from "../../components/app-layout"

const mockAlerts = [
  {
    id: "1",
    type: "warning" as const,
    message: "Carga alta en cocina - Considerar refuerzo",
    timestamp: new Date(),
    acknowledged: false,
  },
  {
    id: "2",
    type: "info" as const,
    message: "Sistema operando sin nodos críticos",
    timestamp: new Date(),
    acknowledged: false,
  },
]

export default function SupervisorPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, isLoading } = useAuth()
  const { orders, queueMetrics } = useOrderManagement()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("No autenticado, redirigiendo a login")
        router.replace("/login")
        return
      }

      if (currentUser && currentUser.role !== "supervisor") {
        console.log("Rol incorrecto, redirigiendo a:", currentUser.role)
        router.replace(`/${currentUser.role}`)
        return
      }
    }
  }, [isAuthenticated, currentUser, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard de supervisión...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser || currentUser.role !== "supervisor") {
    return null
  }

  return (
    <AppLayout>
      <SupervisorDashboard orders={orders} queueMetrics={queueMetrics} alerts={mockAlerts} />
    </AppLayout>
  )
}

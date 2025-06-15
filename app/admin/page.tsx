"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"
import { useOrderManagement } from "../../hooks/useOrderManagement"
import { SupervisorDashboard } from "../../components/supervisor-dashboard"
import { AppLayout } from "../../components/app-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Settings, TrendingUp } from "lucide-react"

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

export default function AdminPage() {
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

      if (currentUser && currentUser.role !== "admin") {
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
          <p className="text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser || currentUser.role !== "admin") {
    return null
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header con accesos rápidos */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>

          {/* Accesos Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push("/admin/simulacion")}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Simulador de Tiempos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Análisis comparativo de tiempos de espera y servicio mediante simulación pseudoaleatoria
                </p>
                <Button className="w-full">Acceder al Simulador</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-gray-400" />
                  Configuración Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Configuración avanzada del sistema y parámetros operativos</p>
                <Button variant="outline" className="w-full" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  Reportes Avanzados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Análisis detallado de rendimiento y métricas operativas</p>
                <Button variant="outline" className="w-full" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dashboard Principal */}
        <SupervisorDashboard orders={orders} queueMetrics={queueMetrics} alerts={mockAlerts} />
      </div>
    </AppLayout>
  )
}

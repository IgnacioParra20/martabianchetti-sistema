"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"
import { useOrderManagement } from "../../hooks/useOrderManagement"
import { KitchenScreen } from "../../components/kitchen-screen"
import { AppLayout } from "../../components/app-layout"

export default function ProduccionPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, isLoading } = useAuth()
  const { updateOrderStatus, getOrdersByStation } = useOrderManagement()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("No autenticado, redirigiendo a login")
        router.replace("/login")
        return
      }

      if (currentUser && currentUser.role !== "produccion") {
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
          <p className="text-gray-600">Cargando panel de producción...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser || currentUser.role !== "produccion") {
    return null
  }

  return (
    <AppLayout>
      <KitchenScreen
        kitchenOrders={getOrdersByStation("kitchen")}
        barOrders={getOrdersByStation("bar")}
        onUpdateOrderStatus={updateOrderStatus}
      />
    </AppLayout>
  )
}

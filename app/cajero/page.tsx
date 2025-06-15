"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"
import { useOrderManagement } from "../../hooks/useOrderManagement"
import { CashierScreen } from "../../components/cashier-screen"
import { AppLayout } from "../../components/app-layout"

export default function CajeroPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, isLoading } = useAuth()
  const { getReadyOrders, updateOrderStatus } = useOrderManagement()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("No autenticado, redirigiendo a login")
        router.replace("/login")
        return
      }

      if (currentUser && currentUser.role !== "cajero") {
        console.log("Rol incorrecto, redirigiendo a:", currentUser.role)
        router.replace(`/${currentUser.role}`)
        return
      }
    }
  }, [isAuthenticated, currentUser, isLoading, router])

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel del cajero...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado o no es el rol correcto, no mostrar nada (se está redirigiendo)
  if (!isAuthenticated || !currentUser || currentUser.role !== "cajero") {
    return null
  }

  const handleProcessPayment = (orderId: string) => {
    updateOrderStatus(orderId, "paid")
  }

  return (
    <AppLayout>
      <CashierScreen readyOrders={getReadyOrders()} onProcessPayment={handleProcessPayment} />
    </AppLayout>
  )
}

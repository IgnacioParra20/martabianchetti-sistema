"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../hooks/useAuth"
import { useOrderManagement } from "../../hooks/useOrderManagement"
import { WaiterScreen } from "../../components/waiter-screen"
import { AppLayout } from "../../components/app-layout"

export default function MozoPage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, isLoading } = useAuth()
  const { menuItems, updateOrderStatus, addOrder, getOrdersByWaiter } = useOrderManagement()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log("No autenticado, redirigiendo a login")
        router.replace("/login")
        return
      }

      if (currentUser && currentUser.role !== "mozo") {
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
          <p className="text-gray-600">Cargando panel del mozo...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !currentUser || currentUser.role !== "mozo") {
    return null
  }

  return (
    <AppLayout>
      <WaiterScreen
        waiterOrders={getOrdersByWaiter(currentUser.id)}
        menuItems={menuItems}
        onUpdateOrderStatus={updateOrderStatus}
        onAddOrder={addOrder}
        waiterId={currentUser.id}
      />
    </AppLayout>
  )
}

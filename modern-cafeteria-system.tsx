"use client"

import { useAuth } from "./hooks/useAuth"
import { useOrderManagement } from "./hooks/useOrderManagement"
import { LoginScreen } from "./components/login-screen"
import { CashierScreen } from "./components/cashier-screen"
import { WaiterScreen } from "./components/waiter-screen"
import { KitchenScreen } from "./components/kitchen-screen"
import { SupervisorDashboard } from "./components/supervisor-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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

export default function Component() {
  const { currentUser, isAuthenticated, logout } = useAuth()
  const {
    orders,
    prioritizedOrders,
    queueMetrics,
    menuItems,
    updateOrderStatus,
    addOrder,
    getOrdersByStation,
    getOrdersByWaiter,
    getReadyOrders,
  } = useOrderManagement()

  // Forzar re-render cuando cambie el estado de autenticación
  if (!isAuthenticated || !currentUser) {
    return <LoginScreen />
  }

  const handleProcessPayment = (orderId: string) => {
    updateOrderStatus(orderId, "paid")
  }

  const renderRoleScreen = () => {
    switch (currentUser.role) {
      case "cajero":
        return <CashierScreen readyOrders={getReadyOrders()} onProcessPayment={handleProcessPayment} />

      case "mozo":
        return (
          <WaiterScreen
            waiterOrders={getOrdersByWaiter(currentUser.id)}
            menuItems={menuItems}
            onUpdateOrderStatus={updateOrderStatus}
            onAddOrder={addOrder}
            waiterId={currentUser.id}
          />
        )

      case "produccion":
        return (
          <KitchenScreen
            kitchenOrders={getOrdersByStation("kitchen")}
            barOrders={getOrdersByStation("bar")}
            onUpdateOrderStatus={updateOrderStatus}
          />
        )

      case "supervisor":
      case "admin":
        return <SupervisorDashboard orders={orders} queueMetrics={queueMetrics} alerts={mockAlerts} />

      default:
        return <div>Rol no reconocido</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header global */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Martha de Bianchetti</h1>
            <Badge className="bg-blue-100 text-blue-700">
              <Shield className="w-3 h-3 mr-1" />
              Sistema Sin Nodos Críticos
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentUser.avatar}</span>
              <div className="text-right">
                <div className="font-medium">{currentUser.name}</div>
                <div className="text-sm text-gray-600 capitalize">{currentUser.role}</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal por rol */}
      {renderRoleScreen()}
    </div>
  )
}

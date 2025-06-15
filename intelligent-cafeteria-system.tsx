"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Coffee,
  Users,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  Play,
  User,
  ChefHat,
  CreditCard,
  LogOut,
  Zap,
  Shield,
  TrendingUp,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "./hooks/useAuth"
import { usePrioritySystem } from "./hooks/usePrioritySystem"
import { LoginScreen } from "./components/login-screen"
import { PriorityQueueVisualizer } from "./components/priority-queue-visualizer"
import { SystemStabilityMonitor } from "./components/system-stability-monitor"
import { RoleSegmentationPanel } from "./components/role-segmentation-panel"
import type { OrderWithPriority, RoleSegmentation } from "./types/priority-system"

// Mock data con sistema de prioridades
const mockOrdersWithPriority = [
  {
    id: "001",
    channel: "mesa",
    destination: "cocina",
    items: [
      { id: "1", name: "Sandwich Club", quantity: 1, price: 850, notes: "Sin tomate" },
      { id: "2", name: "Café Americano", quantity: 1, price: 320 },
    ],
    status: "pending",
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    estimatedTime: 12,
    priority: "high",
    tableNumber: 5,
    customerType: "regular",
    paymentStatus: "pending",
  },
  {
    id: "002",
    channel: "digital",
    destination: "barra",
    items: [
      { id: "3", name: "Cappuccino", quantity: 2, price: 420 },
      { id: "4", name: "Medialuna", quantity: 1, price: 280 },
    ],
    status: "pending",
    timestamp: new Date(Date.now() - 120000), // 2 min ago
    estimatedTime: 5,
    priority: "medium",
    customerType: "delivery",
    paymentStatus: "paid",
  },
  {
    id: "003",
    channel: "caja",
    destination: "cocina",
    items: [{ id: "5", name: "Ensalada César", quantity: 1, price: 950 }],
    status: "pending",
    timestamp: new Date(Date.now() - 600000), // 10 min ago
    estimatedTime: 15,
    priority: "critical",
    customerType: "vip",
    paymentStatus: "pending",
  },
  {
    id: "004",
    channel: "mesa",
    destination: "barra",
    items: [{ id: "6", name: "Café Americano", quantity: 3, price: 320 }],
    status: "pending",
    timestamp: new Date(),
    estimatedTime: 3,
    priority: "low",
    tableNumber: 8,
    customerType: "regular",
    paymentStatus: "pending",
  },
]

const roleSegmentationData: RoleSegmentation[] = [
  {
    role: "cajero",
    exclusiveTasks: [
      "Procesar pagos en efectivo",
      "Procesar pagos con tarjeta",
      "Emitir facturas",
      "Manejar caja registradora",
    ],
    prohibitedTasks: [
      "Tomar pedidos de mesa",
      "Coordinar cocina",
      "Servir mesas",
      "Preparar bebidas",
      "Recibir proveedores",
    ],
    currentLoad: 2,
    maxCapacity: 8,
    isBottleneck: false,
    canOperateIndependently: true,
  },
  {
    role: "mozo",
    exclusiveTasks: [
      "Tomar pedidos en mesa",
      "Servir pedidos a mesas",
      "Atender consultas de clientes",
      "Limpiar y preparar mesas",
    ],
    prohibitedTasks: ["Procesar pagos", "Preparar comida", "Preparar bebidas", "Manejar caja"],
    currentLoad: 6,
    maxCapacity: 10,
    isBottleneck: false,
    canOperateIndependently: true,
  },
  {
    role: "produccion",
    exclusiveTasks: [
      "Preparar comida en cocina",
      "Preparar bebidas en barra",
      "Controlar calidad de productos",
      "Gestionar inventario de cocina",
    ],
    prohibitedTasks: ["Procesar pagos", "Tomar pedidos", "Servir mesas", "Atender proveedores"],
    currentLoad: 8,
    maxCapacity: 10,
    isBottleneck: true,
    canOperateIndependently: true,
  },
]

export default function Component() {
  const { currentUser, isAuthenticated, logout, hasPermission } = useAuth()
  const { orders, setOrders, processOrderWithPriority, sortOrdersByPriority, getSystemStability } = usePrioritySystem()

  const [activeRole, setActiveRole] = useState<"general" | "cajero" | "mozo" | "produccion">("general")

  // Procesar pedidos con sistema de prioridades
  useEffect(() => {
    const processedOrders = mockOrdersWithPriority.map((order) => processOrderWithPriority(order))
    setOrders(processedOrders)
  }, [processOrderWithPriority, setOrders])

  // Calcular estabilidad del sistema
  const systemStability = useMemo(() => getSystemStability(), [getSystemStability])

  // Ordenar pedidos por prioridad (NO FIFO)
  const prioritizedOrders = useMemo(() => sortOrdersByPriority(orders), [orders, sortOrdersByPriority])

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  const handleOrderStatusUpdate = (orderId: string, newStatus: any) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "mesa":
        return <Users className="w-4 h-4" />
      case "caja":
        return <CreditCard className="w-4 h-4" />
      case "digital":
        return <ShoppingCart className="w-4 h-4" />
      default:
        return <Coffee className="w-4 h-4" />
    }
  }

  const getDestinationIcon = (destination: string) => {
    switch (destination) {
      case "cocina":
        return <ChefHat className="w-4 h-4" />
      case "barra":
        return <Coffee className="w-4 h-4" />
      default:
        return <Coffee className="w-4 h-4" />
    }
  }

  const IndependentFlowVisualizer = ({ order }: { order: OrderWithPriority }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-l-blue-500"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getChannelIcon(order.channel)}
          <span className="font-medium capitalize">{order.channel}</span>
          <Badge variant="outline">#{order.id}</Badge>
          {order.canBypassCashier && (
            <Badge className="bg-blue-100 text-blue-700">
              <Zap className="w-3 h-3 mr-1" />
              Bypass Cajero
            </Badge>
          )}
        </div>
        <Badge
          className={
            order.urgencyLevel === "critical"
              ? "bg-red-500 text-white"
              : order.urgencyLevel === "high"
                ? "bg-orange-500 text-white"
                : order.urgencyLevel === "medium"
                  ? "bg-yellow-500 text-black"
                  : "bg-green-500 text-white"
          }
        >
          {order.urgencyLevel}
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">
            Flujo: {order.independentFlow ? "Independiente" : "Tradicional"}
          </div>
          <div className="flex items-center gap-2">
            {getDestinationIcon(order.destination)}
            <span className="capitalize font-medium">{order.destination}</span>
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Score: {order.priorityScore.finalScore.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center text-sm bg-gray-50 rounded px-2 py-1">
            <span>
              {item.quantity}x {item.name}
            </span>
            <span className="font-medium">${item.price}</span>
          </div>
        ))}
      </div>

      {hasPermission("update_order_status") && (
        <div className="flex gap-2 mt-3">
          {order.status === "pending" && (
            <Button size="sm" onClick={() => handleOrderStatusUpdate(order.id, "in-progress")}>
              <Play className="w-4 h-4 mr-1" />
              Iniciar
            </Button>
          )}
          {order.status === "in-progress" && (
            <Button size="sm" onClick={() => handleOrderStatusUpdate(order.id, "completed")}>
              <CheckCircle className="w-4 h-4 mr-1" />
              Completar
            </Button>
          )}
        </div>
      )}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Martha de Bianchetti</h1>
              <p className="text-gray-600">Sistema Inteligente Anti-Nodos Críticos</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Sistema Equilibrado
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  <Activity className="w-3 h-3 mr-1" />
                  Prioridades Activas
                </Badge>
                <Badge variant="outline">
                  {currentUser?.name} ({currentUser?.role})
                </Badge>
              </div>
              <div className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4 mr-1" />
                Salir
              </Button>
            </div>
          </div>

          {/* Tabs de Navegación */}
          <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Vista General</TabsTrigger>
              <TabsTrigger value="cajero" disabled={!hasPermission("process_payments")}>
                Cajero (No Crítico)
              </TabsTrigger>
              <TabsTrigger value="mozo" disabled={!hasPermission("manage_tables")}>
                Mozo
              </TabsTrigger>
              <TabsTrigger value="produccion" disabled={!hasPermission("manage_production")}>
                Producción
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Monitor de Estabilidad */}
              <SystemStabilityMonitor stability={systemStability} />

              {/* Colas Inteligentes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PriorityQueueVisualizer orders={prioritizedOrders} area="cocina" />
                <PriorityQueueVisualizer orders={prioritizedOrders} area="barra" />
              </div>

              {/* Flujo de Pedidos Independientes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Flujo Inteligente de Pedidos (No FIFO)
                    <Badge className="bg-purple-100 text-purple-700">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Por Prioridad
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {prioritizedOrders.slice(0, 6).map((order) => (
                      <IndependentFlowVisualizer key={order.id} order={order} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Panel del Cajero - NO CRÍTICO */}
            <TabsContent value="cajero" className="space-y-6">
              <RoleSegmentationPanel currentRole="cajero" segmentation={roleSegmentationData} />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Panel del Cajero - Función Específica
                    <Badge className="bg-green-100 text-green-700">
                      <Shield className="w-3 h-3 mr-1" />
                      No Crítico
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Solo Pagos Pendientes</h3>
                      {prioritizedOrders
                        .filter((order) => !order.canBypassCashier && order.status === "completed")
                        .map((order) => (
                          <div key={order.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between mb-3">
                              <Badge>#{order.id}</Badge>
                              <div className="text-lg font-bold">
                                ${order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                              </div>
                            </div>
                            <div className="space-y-1 mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span>${item.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                            <Button size="sm" className="w-full">
                              Procesar Pago Únicamente
                            </Button>
                          </div>
                        ))}
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium mb-4">Estado del Rol</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Función:</span>
                          <span className="font-medium text-green-600">Solo Pagos</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dependencias:</span>
                          <span className="font-medium text-green-600">Ninguna</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impacto si se detiene:</span>
                          <span className="font-medium text-green-600">Mínimo</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pedidos que bypasean:</span>
                          <span className="font-medium text-blue-600">
                            {prioritizedOrders.filter((o) => o.canBypassCashier).length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Panel del Mozo */}
            <TabsContent value="mozo" className="space-y-6">
              <RoleSegmentationPanel currentRole="mozo" segmentation={roleSegmentationData} />

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Panel del Mozo - Gestión de Mesas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Pedidos de Mesa por Prioridad</h3>
                      {prioritizedOrders
                        .filter((order) => order.channel === "mesa")
                        .map((order) => (
                          <div key={order.id} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>Mesa {order.tableNumber}</Badge>
                              <Badge
                                className={
                                  order.urgencyLevel === "critical"
                                    ? "bg-red-500 text-white"
                                    : order.urgencyLevel === "high"
                                      ? "bg-orange-500 text-white"
                                      : order.urgencyLevel === "medium"
                                        ? "bg-yellow-500 text-black"
                                        : "bg-green-500 text-white"
                                }
                              >
                                {order.urgencyLevel}
                              </Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.quantity}x {item.name}
                                </div>
                              ))}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                              Score de Prioridad: {order.priorityScore.finalScore.toFixed(1)}
                            </div>
                            <Button size="sm" variant="outline" className="w-full">
                              Gestionar Mesa
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Panel de Producción */}
            <TabsContent value="produccion" className="space-y-6">
              <RoleSegmentationPanel currentRole="produccion" segmentation={roleSegmentationData} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PriorityQueueVisualizer orders={prioritizedOrders} area="cocina" />
                <PriorityQueueVisualizer orders={prioritizedOrders} area="barra" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

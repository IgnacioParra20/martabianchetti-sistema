"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Coffee,
  Users,
  ShoppingCart,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  User,
  ChefHat,
  CreditCard,
  LogOut,
  BarChart3,
  Zap,
  Target,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "./hooks/useAuth"
import { useTaskAssignment } from "./hooks/useTaskAssignment"
import { LoginScreen } from "./components/login-screen"
import { MetricsDashboard } from "./components/metrics-dashboard"
import { IntelligentAlerts } from "./components/intelligent-alerts"
import type { Order, QueueStatus, Alert, Metrics } from "./types/system"

// Mock data mejorado
const mockOrders: Order[] = [
  {
    id: "001",
    channel: "mesa",
    destination: "cocina",
    items: [
      { id: "1", name: "Sandwich Club", quantity: 1, price: 850, notes: "Sin tomate" },
      { id: "2", name: "Café Americano", quantity: 1, price: 320 },
    ],
    status: "pending",
    timestamp: new Date(),
    estimatedTime: 12,
    priority: "medium",
    tableNumber: 5,
  },
  {
    id: "002",
    channel: "caja",
    destination: "barra",
    items: [
      { id: "3", name: "Cappuccino", quantity: 2, price: 420 },
      { id: "4", name: "Croissant", quantity: 1, price: 280 },
    ],
    status: "in-progress",
    timestamp: new Date(),
    estimatedTime: 5,
    priority: "high",
  },
  {
    id: "003",
    channel: "digital",
    destination: "cocina",
    items: [
      { id: "5", name: "Ensalada César", quantity: 1, price: 950 },
      { id: "6", name: "Jugo Natural", quantity: 1, price: 380 },
    ],
    status: "pending",
    timestamp: new Date(),
    estimatedTime: 15,
    priority: "medium",
  },
]

const mockQueues: QueueStatus[] = [
  { area: "Cocina", load: 75, waitTime: 12, orders: 8, capacity: 12, efficiency: 85 },
  { area: "Barra", load: 45, waitTime: 5, orders: 3, capacity: 8, efficiency: 92 },
  { area: "Caja", load: 30, waitTime: 2, orders: 2, capacity: 6, efficiency: 95 },
]

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "stock",
    message: "Stock bajo: Leche (quedan 2 litros)",
    priority: "medium",
    timestamp: new Date(),
    status: "active",
    predictive: false,
  },
  {
    id: "2",
    type: "performance",
    message: "Se detecta posible cuello de botella en cocina en 15 min",
    priority: "high",
    timestamp: new Date(),
    status: "active",
    predictive: true,
    autoAssign: true,
  },
  {
    id: "3",
    type: "system",
    message: "Tiempo de espera promedio superó el objetivo (>8min)",
    priority: "critical",
    timestamp: new Date(),
    status: "active",
    predictive: true,
  },
]

const mockMetrics: Metrics = {
  ordersPerHour: 24,
  averageWaitTime: 9.5,
  customerSatisfaction: 87,
  efficiency: 85,
  revenue: 15420,
  peakHours: ["11:00-12:00", "14:00-15:00", "19:00-20:00"],
}

export default function Component() {
  const { currentUser, isAuthenticated, logout, hasPermission } = useAuth()
  const { tasks, autoAssignEnabled, setAutoAssignEnabled, assignOrder, updateTaskStatus, getTasksForUser } =
    useTaskAssignment()

  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [queues, setQueues] = useState<QueueStatus[]>(mockQueues)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [metrics, setMetrics] = useState<Metrics>(mockMetrics)
  const [activeRole, setActiveRole] = useState<"general" | "cajero" | "mozo" | "produccion">("general")

  // Ref to track processed orders to prevent infinite loops
  const processedOrdersRef = useRef<Set<string>>(new Set())

  // Auto-asignación de pedidos - Fixed to prevent infinite loops
  useEffect(() => {
    if (autoAssignEnabled && currentUser) {
      const pendingOrders = orders.filter(
        (order) => order.status === "pending" && !order.assignedTo && !processedOrdersRef.current.has(order.id),
      )

      pendingOrders.forEach((order) => {
        // Mark as processed to prevent reprocessing
        processedOrdersRef.current.add(order.id)

        // Simular asignación automática
        const assignedStaffId = assignOrder(order, [currentUser])
        if (assignedStaffId) {
          setOrders((prev) =>
            prev.map((o) => (o.id === order.id ? { ...o, status: "assigned", assignedTo: assignedStaffId } : o)),
          )
        }
      })
    }
  }, [orders, autoAssignEnabled, currentUser])

  // Reset processed orders when auto-assignment is toggled
  useEffect(() => {
    if (!autoAssignEnabled) {
      processedOrdersRef.current.clear()
    }
  }, [autoAssignEnabled])

  if (!isAuthenticated) {
    return <LoginScreen />
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-red-500 bg-red-50"
      case "medium":
        return "border-l-yellow-500 bg-yellow-50"
      case "low":
        return "border-l-green-500 bg-green-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  const handleAlertAction = (alertId: string, action: "acknowledge" | "resolve" | "snooze") => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: action === "resolve" ? "resolved" : "acknowledged" } : alert,
      ),
    )
  }

  const handleOrderStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

    // Actualizar tarea correspondiente
    const taskId = `task-${orderId}`
    updateTaskStatus(taskId, newStatus === "completed" ? "completed" : "in-progress")
  }

  const userTasks = currentUser ? getTasksForUser(currentUser.id) : []

  const OrderFlow = ({ order }: { order: Order }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-4 shadow-sm border-l-4 ${getPriorityColor(order.priority)}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getChannelIcon(order.channel)}
          <span className="font-medium capitalize">{order.channel}</span>
          <Badge variant="outline">#{order.id}</Badge>
          {order.tableNumber && <Badge variant="secondary">Mesa {order.tableNumber}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={
              order.priority === "high"
                ? "bg-red-100 text-red-700"
                : order.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
            }
          >
            {order.priority}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            {order.estimatedTime} min
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">Destino:</div>
          <div className="flex items-center gap-2">
            {getDestinationIcon(order.destination)}
            <span className="capitalize font-medium">{order.destination}</span>
            {order.assignedTo && (
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Auto-asignado
              </Badge>
            )}
          </div>
        </div>

        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="text-blue-500"
        >
          <ArrowRight className="w-5 h-5" />
        </motion.div>
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
        {order.items.some((item) => item.notes) && (
          <div className="text-xs text-gray-600 italic">Notas: {order.items.find((item) => item.notes)?.notes}</div>
        )}
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
              <p className="text-gray-600">Sistema de Gestión Inteligente</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  <Target className="w-3 h-3 mr-1" />
                  {autoAssignEnabled ? "Auto-asignación ON" : "Manual"}
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

          {/* Métricas en Tiempo Real */}
          {hasPermission("view_metrics") && <MetricsDashboard metrics={metrics} realTime={true} />}

          {/* Role-based Navigation */}
          <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Vista General</TabsTrigger>
              <TabsTrigger value="cajero" disabled={!hasPermission("process_payments")}>
                Cajero
              </TabsTrigger>
              <TabsTrigger value="mozo" disabled={!hasPermission("manage_tables")}>
                Mozo
              </TabsTrigger>
              <TabsTrigger value="produccion" disabled={!hasPermission("manage_production")}>
                Producción
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Alertas Inteligentes */}
              <IntelligentAlerts alerts={alerts} onAlertAction={handleAlertAction} />

              {/* Estado de Colas Mejorado */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Estado Operativo en Tiempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {queues.map((queue) => (
                      <div key={queue.area} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">{queue.area}</h3>
                          <Badge variant="outline">
                            {queue.orders}/{queue.capacity}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Carga</span>
                              <span>{queue.load}%</span>
                            </div>
                            <Progress value={queue.load} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Eficiencia</span>
                              <span
                                className={
                                  queue.efficiency >= 90
                                    ? "text-green-600"
                                    : queue.efficiency >= 70
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                }
                              >
                                {queue.efficiency}%
                              </span>
                            </div>
                            <Progress value={queue.efficiency} className="h-2" />
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Tiempo estimado</span>
                            <span className="font-medium">{queue.waitTime} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Flujo de Pedidos con Asignación Dinámica */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Asignación Dinámica de Pedidos
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={autoAssignEnabled ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAutoAssignEnabled(!autoAssignEnabled)}
                      >
                        {autoAssignEnabled ? "Automático" : "Manual"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orders.map((order) => (
                      <OrderFlow key={order.id} order={order} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resto de las pestañas con funcionalidad mejorada */}
            <TabsContent value="cajero" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Panel del Cajero - Enfoque en Pagos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Pedidos Pendientes de Pago</h3>
                      {orders
                        .filter((order) => order.channel === "caja" || order.status === "completed")
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
                              Procesar Pago
                            </Button>
                          </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-medium mb-4">Mis Tareas</h3>
                        <div className="space-y-2">
                          {userTasks
                            .filter((task) => task.status !== "completed")
                            .map((task) => (
                              <div
                                key={task.id}
                                className="flex justify-between items-center p-2 bg-white rounded border"
                              >
                                <span className="text-sm">{task.description}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTaskStatus(task.id, "completed")}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="font-medium mb-4">Estado de Caja</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Cola actual:</span>
                            <span className="font-medium">2 min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pedidos pendientes:</span>
                            <span className="font-medium">
                              {orders.filter((o) => o.channel === "caja" && o.status !== "completed").length}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ingresos del turno:</span>
                            <span className="font-medium text-green-600">$3,240</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mozo" className="space-y-6">
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
                      <h3 className="font-medium">Pedidos de Mesa Asignados</h3>
                      {orders
                        .filter((order) => order.channel === "mesa" && order.assignedTo === currentUser?.id)
                        .map((order) => (
                          <div key={order.id} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>Mesa {order.tableNumber}</Badge>
                              <Badge
                                className={
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "in-progress"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                }
                              >
                                {order.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.quantity}x {item.name}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              {order.status === "completed" && (
                                <Button size="sm" variant="outline" className="flex-1">
                                  Servir Mesa
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                Ver Detalles
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h3 className="font-medium mb-4">Tareas Adicionales</h3>
                        <div className="space-y-2">
                          {userTasks
                            .filter((task) => task.type !== "order")
                            .map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center justify-between p-2 bg-white rounded border"
                              >
                                <span className="text-sm">{task.description}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateTaskStatus(task.id, "completed")}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="produccion" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChefHat className="w-5 h-5" />
                    Panel de Producción - Cocina y Barra
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Cola de Cocina</h3>
                      {orders
                        .filter((order) => order.destination === "cocina")
                        .sort((a, b) => (a.priority === "high" ? -1 : 1))
                        .map((order) => (
                          <div key={order.id} className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge>#{order.id}</Badge>
                                {order.tableNumber && <Badge variant="outline">Mesa {order.tableNumber}</Badge>}
                              </div>
                              <Badge
                                className={
                                  order.priority === "high"
                                    ? "bg-red-100 text-red-700"
                                    : order.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-green-100 text-green-700"
                                }
                              >
                                {order.priority}
                              </Badge>
                            </div>
                            <div className="space-y-1 mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.quantity}x {item.name}
                                  {item.notes && <span className="text-gray-500 italic"> - {item.notes}</span>}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              {order.status === "assigned" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOrderStatusUpdate(order.id, "in-progress")}
                                >
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
                            <div className="mt-2 text-xs text-gray-500">Tiempo estimado: {order.estimatedTime} min</div>
                          </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Cola de Barra</h3>
                      {orders
                        .filter((order) => order.destination === "barra")
                        .map((order) => (
                          <div key={order.id} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>#{order.id}</Badge>
                              <div className="text-sm text-gray-500">{order.estimatedTime} min</div>
                            </div>
                            <div className="space-y-1 mb-3">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.quantity}x {item.name}
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              {order.status === "assigned" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOrderStatusUpdate(order.id, "in-progress")}
                                >
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
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

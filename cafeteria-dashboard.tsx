"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Coffee,
  Users,
  ShoppingCart,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Bell,
  Play,
  User,
  ChefHat,
  CreditCard,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipos de datos
interface Order {
  id: string
  channel: "mesa" | "caja" | "digital"
  destination: "cocina" | "barra"
  items: string[]
  status: "pending" | "in-progress" | "completed"
  timestamp: Date
  estimatedTime: number
}

interface QueueStatus {
  area: string
  load: number
  waitTime: number
  orders: number
}

interface Alert {
  id: string
  type: "stock" | "supplier" | "emergency"
  message: string
  priority: "low" | "medium" | "high"
  timestamp: Date
  status: "active" | "acknowledged" | "resolved"
}

const mockOrders: Order[] = [
  {
    id: "001",
    channel: "mesa",
    destination: "cocina",
    items: ["Sandwich Club", "Café Americano"],
    status: "pending",
    timestamp: new Date(),
    estimatedTime: 12,
  },
  {
    id: "002",
    channel: "caja",
    destination: "barra",
    items: ["Cappuccino", "Croissant"],
    status: "in-progress",
    timestamp: new Date(),
    estimatedTime: 5,
  },
  {
    id: "003",
    channel: "digital",
    destination: "cocina",
    items: ["Ensalada César", "Jugo Natural"],
    status: "pending",
    timestamp: new Date(),
    estimatedTime: 15,
  },
]

const mockQueues: QueueStatus[] = [
  { area: "Cocina", load: 75, waitTime: 12, orders: 8 },
  { area: "Barra", load: 45, waitTime: 5, orders: 3 },
  { area: "Caja", load: 30, waitTime: 2, orders: 2 },
]

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "stock",
    message: "Stock bajo: Leche (quedan 2 litros)",
    priority: "medium",
    timestamp: new Date(),
    status: "active",
  },
  {
    id: "2",
    type: "supplier",
    message: "Proveedor de pan llegará en 30 min",
    priority: "low",
    timestamp: new Date(),
    status: "active",
  },
  {
    id: "3",
    type: "emergency",
    message: "Máquina de café requiere mantenimiento",
    priority: "high",
    timestamp: new Date(),
    status: "active",
  },
]

export default function Component() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [queues, setQueues] = useState<QueueStatus[]>(mockQueues)
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [activeRole, setActiveRole] = useState<"general" | "cajero" | "mozo" | "produccion">("general")

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

  const getLoadColor = (load: number) => {
    if (load >= 70) return "bg-red-500"
    if (load >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 border-red-500 text-red-700"
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-700"
      case "low":
        return "bg-blue-100 border-blue-500 text-blue-700"
      default:
        return "bg-gray-100 border-gray-500 text-gray-700"
    }
  }

  const handleAlertAction = (alertId: string, action: "acknowledge" | "resolve") => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: action === "acknowledge" ? "acknowledged" : "resolved" } : alert,
      ),
    )
  }

  const OrderFlow = ({ order }: { order: Order }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg p-4 shadow-sm border"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getChannelIcon(order.channel)}
          <span className="font-medium capitalize">{order.channel}</span>
          <Badge variant="outline">#{order.id}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          {order.estimatedTime} min
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="text-sm text-gray-600 mb-1">Destino:</div>
          <div className="flex items-center gap-2">
            {getDestinationIcon(order.destination)}
            <span className="capitalize font-medium">{order.destination}</span>
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

      <div className="space-y-1">
        {order.items.map((item, index) => (
          <div key={index} className="text-sm bg-gray-50 rounded px-2 py-1">
            {item}
          </div>
        ))}
      </div>
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
              <p className="text-gray-600">Sistema de Gestión de Pedidos</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700">
                Sistema Activo
              </Badge>
              <div className="text-sm text-gray-500">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>

          {/* Role Selector */}
          <Tabs value={activeRole} onValueChange={(value) => setActiveRole(value as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Vista General</TabsTrigger>
              <TabsTrigger value="cajero">Cajero</TabsTrigger>
              <TabsTrigger value="mozo">Mozo</TabsTrigger>
              <TabsTrigger value="produccion">Producción</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Alerts Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Alertas del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {alerts
                        .filter((alert) => alert.status === "active")
                        .map((alert) => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`p-3 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <AlertTriangle className="w-4 h-4" />
                                  <span className="font-medium capitalize">{alert.type}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {alert.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm">{alert.message}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAlertAction(alert.id, "acknowledge")}
                                >
                                  Aceptar
                                </Button>
                                <Button size="sm" onClick={() => handleAlertAction(alert.id, "resolve")}>
                                  Resolver
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              {/* Queue Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Estado de Colas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {queues.map((queue) => (
                      <div key={queue.area} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{queue.area}</h3>
                          <Badge variant="outline">{queue.orders} pedidos</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Carga</span>
                            <span>{queue.load}%</span>
                          </div>
                          <Progress value={queue.load} className="h-2" />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Tiempo estimado</span>
                            <span>{queue.waitTime} min</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Flow */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    Derivación Automática de Pedidos
                  </CardTitle>
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

            <TabsContent value="cajero" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Panel del Cajero
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Pedidos en Caja</h3>
                      {orders
                        .filter((order) => order.channel === "caja")
                        .map((order) => (
                          <div key={order.id} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>#{order.id}</Badge>
                              <Button size="sm">Procesar Pago</Button>
                            </div>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium mb-4">Estado de Caja</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Cola actual:</span>
                          <span className="font-medium">2 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pedidos pendientes:</span>
                          <span className="font-medium">2</span>
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
                    Panel del Mozo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Pedidos de Mesa</h3>
                      {orders
                        .filter((order) => order.channel === "mesa")
                        .map((order) => (
                          <div key={order.id} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>Mesa #{order.id}</Badge>
                              <Button size="sm" variant="outline">
                                Servir
                              </Button>
                            </div>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item}
                                </div>
                              ))}
                            </div>
                            <div className="mt-2 text-xs text-gray-500">Tiempo estimado: {order.estimatedTime} min</div>
                          </div>
                        ))}
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-medium mb-4">Tareas Pendientes</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm">Limpiar mesa 3</span>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded border">
                          <span className="text-sm">Reponer servilletas</span>
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
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
                    Panel de Producción
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="font-medium">Cola de Cocina</h3>
                      {orders
                        .filter((order) => order.destination === "cocina")
                        .map((order) => (
                          <div key={order.id} className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <div className="flex items-center justify-between mb-2">
                              <Badge>#{order.id}</Badge>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Play className="w-4 h-4" />
                                </Button>
                                <Button size="sm">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item}
                                </div>
                              ))}
                            </div>
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
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Play className="w-4 h-4" />
                                </Button>
                                <Button size="sm">
                                  <CheckCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item}
                                </div>
                              ))}
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

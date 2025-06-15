"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChefHat, Clock, AlertTriangle, CheckCircle, Flame } from "lucide-react"
import type { Order } from "../types/system"

interface KitchenScreenProps {
  kitchenOrders: Order[]
  barOrders: Order[]
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void
}

export function KitchenScreen({ kitchenOrders, barOrders, onUpdateOrderStatus }: KitchenScreenProps) {
  const getPriorityColor = (priority: Order["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPriorityIcon = (priority: Order["priority"]) => {
    switch (priority) {
      case "urgent":
        return <Flame className="w-4 h-4" />
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getWaitTime = (order: Order) => {
    return Math.floor((Date.now() - order.createdAt.getTime()) / 60000)
  }

  const OrderCard = ({ order, station }: { order: Order; station: "kitchen" | "bar" }) => (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">#{order.id}</Badge>
          {order.tableNumber && <Badge>Mesa {order.tableNumber}</Badge>}
          <Badge className={getPriorityColor(order.priority)}>
            {getPriorityIcon(order.priority)}
            <span className="ml-1 capitalize">{order.priority}</span>
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Esperando</div>
          <div className="font-bold">{getWaitTime(order)} min</div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {order.items
          .filter((item) => item.station === station || item.station === "both")
          .map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">
                {item.quantity}x {item.name}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.preparationTime}min
                </Badge>
                <div className="w-2 h-2 rounded-full bg-orange-400" title={`Complejidad: ${item.complexity}`} />
              </div>
            </div>
          ))}
      </div>

      {order.notes && (
        <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <strong>Notas:</strong> {order.notes}
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso estimado</span>
          <span>{Math.min(100, (getWaitTime(order) / order.estimatedTime) * 100).toFixed(0)}%</span>
        </div>
        <Progress value={Math.min(100, (getWaitTime(order) / order.estimatedTime) * 100)} className="h-2" />
      </div>

      <div className="flex gap-2">
        {order.status === "pending" && (
          <Button size="sm" onClick={() => onUpdateOrderStatus(order.id, "preparing")} className="flex-1">
            Iniciar Preparación
          </Button>
        )}
        {order.status === "preparing" && (
          <Button size="sm" onClick={() => onUpdateOrderStatus(order.id, "ready")} className="flex-1">
            <CheckCircle className="w-4 h-4 mr-1" />
            Marcar Listo
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ChefHat className="w-6 h-6" />
          Panel de Producción
        </h1>
        <p className="text-gray-600">Gestión de pedidos por estación - Prioridad inteligente</p>
      </div>

      {/* Métricas de producción */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{kitchenOrders.length}</p>
              <p className="text-sm text-gray-600">Cola Cocina</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{barOrders.length}</p>
              <p className="text-sm text-gray-600">Cola Barra</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {
                  [...kitchenOrders, ...barOrders].filter((o) => o.priority === "urgent" || o.priority === "high")
                    .length
                }
              </p>
              <p className="text-sm text-gray-600">Alta Prioridad</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {Math.round(
                  [...kitchenOrders, ...barOrders].reduce((sum, order) => sum + getWaitTime(order), 0) /
                    Math.max([...kitchenOrders, ...barOrders].length, 1),
                )}
              </p>
              <p className="text-sm text-gray-600">Tiempo Promedio (min)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cola de Cocina */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Cola de Cocina
              <Badge variant="outline">{kitchenOrders.length} pedidos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {kitchenOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No hay pedidos en cocina</p>
              </div>
            ) : (
              <div className="space-y-4">
                {kitchenOrders.map((order) => (
                  <OrderCard key={order.id} order={order} station="kitchen" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cola de Barra */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Cola de Barra
              <Badge variant="outline">{barOrders.length} pedidos</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {barOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No hay pedidos en barra</p>
              </div>
            ) : (
              <div className="space-y-4">
                {barOrders.map((order) => (
                  <OrderCard key={order.id} order={order} station="bar" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Información del sistema de prioridades */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">Sistema de Priorización Inteligente</span>
        </div>
        <p className="text-sm text-blue-600">
          Los pedidos se ordenan automáticamente por urgencia, complejidad y tiempo de espera. No siguen orden FIFO
          tradicional para optimizar la eficiencia operativa.
        </p>
      </div>
    </div>
  )
}

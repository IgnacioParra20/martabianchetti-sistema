"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react"
import type { Order, OrderItem } from "../types/system"

interface WaiterScreenProps {
  waiterOrders: Order[]
  menuItems: OrderItem[]
  onUpdateOrderStatus: (orderId: string, status: Order["status"]) => void
  onAddOrder: (order: Omit<Order, "id" | "createdAt">) => void
  waiterId: string
}

export function WaiterScreen({
  waiterOrders,
  menuItems,
  onUpdateOrderStatus,
  onAddOrder,
  waiterId,
}: WaiterScreenProps) {
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [newOrder, setNewOrder] = useState({
    tableNumber: "",
    items: [] as OrderItem[],
    notes: "",
  })

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "preparing":
        return "bg-blue-100 text-blue-700"
      case "ready":
        return "bg-green-100 text-green-700"
      case "delivered":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "preparing":
        return <AlertCircle className="w-4 h-4" />
      case "ready":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const addItemToOrder = (item: OrderItem) => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { ...item, quantity: 1 }],
    }))
  }

  const submitNewOrder = () => {
    if (newOrder.tableNumber && newOrder.items.length > 0) {
      const totalComplexity = newOrder.items.reduce((sum, item) => sum + item.complexity, 0)
      const totalTime = newOrder.items.reduce((sum, item) => sum + item.preparationTime, 0)

      onAddOrder({
        tableNumber: Number.parseInt(newOrder.tableNumber),
        channel: "mesa",
        items: newOrder.items,
        status: "pending",
        estimatedTime: totalTime,
        priority: totalComplexity > 15 ? "high" : totalComplexity > 8 ? "medium" : "low",
        complexity: totalComplexity,
        assignedWaiter: waiterId,
        paymentStatus: "pending",
        notes: newOrder.notes,
        customerType: "regular",
      })

      setNewOrder({ tableNumber: "", items: [], notes: "" })
      setShowNewOrder(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Panel del Mozo
            </h1>
            <p className="text-gray-600">Gestión de mesas y pedidos asignados</p>
          </div>
          <Button onClick={() => setShowNewOrder(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Estadísticas del mozo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{waiterOrders.length}</p>
              <p className="text-sm text-gray-600">Mesas Asignadas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{waiterOrders.filter((o) => o.status === "pending").length}</p>
              <p className="text-sm text-gray-600">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{waiterOrders.filter((o) => o.status === "ready").length}</p>
              <p className="text-sm text-gray-600">Listos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {waiterOrders.filter((o) => o.status === "delivered" && o.paymentStatus === "pending").length}
              </p>
              <p className="text-sm text-gray-600">Por Cobrar</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos del mozo */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mis Mesas</CardTitle>
        </CardHeader>
        <CardContent>
          {waiterOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-2" />
              <p>No tienes mesas asignadas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waiterOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Mesa {order.tableNumber}</Badge>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">#{order.id}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    {order.status === "ready" && (
                      <Button size="sm" onClick={() => onUpdateOrderStatus(order.id, "delivered")} className="flex-1">
                        Entregar
                      </Button>
                    )}
                    {order.status === "delivered" && order.paymentStatus === "pending" && (
                      <Button size="sm" variant="outline" className="flex-1">
                        Solicitar Cuenta
                      </Button>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    Tiempo: {Math.floor((Date.now() - order.createdAt.getTime()) / 60000)} min
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para nuevo pedido */}
      {showNewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nuevo Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Número de Mesa</label>
                <Input
                  type="number"
                  value={newOrder.tableNumber}
                  onChange={(e) => setNewOrder((prev) => ({ ...prev, tableNumber: e.target.value }))}
                  placeholder="Ej: 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Seleccionar Items</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => addItemToOrder(item)}
                      className="justify-between h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">${item.price}</div>
                      </div>
                      <Plus className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>

              {newOrder.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Items Seleccionados</label>
                  <div className="space-y-2">
                    {newOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Notas (Opcional)</label>
                <Textarea
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instrucciones especiales..."
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={submitNewOrder} disabled={!newOrder.tableNumber || newOrder.items.length === 0}>
                  Crear Pedido
                </Button>
                <Button variant="outline" onClick={() => setShowNewOrder(false)}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

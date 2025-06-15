"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, CheckCircle, Clock, DollarSign } from "lucide-react"
import type { Order } from "../types/system"

interface CashierScreenProps {
  readyOrders: Order[]
  onProcessPayment: (orderId: string) => void
}

export function CashierScreen({ readyOrders, onProcessPayment }: CashierScreenProps) {
  const calculateTotal = (order: Order) => {
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const pendingPayments = readyOrders.filter((order) => order.paymentStatus === "pending")

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Panel del Cajero
        </h1>
        <p className="text-gray-600">Gestión exclusiva de pagos - Sin otras responsabilidades</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos Pendientes</p>
                <p className="text-2xl font-bold">{pendingPayments.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total a Cobrar</p>
                <p className="text-2xl font-bold">
                  ${pendingPayments.reduce((sum, order) => sum + calculateTotal(order), 0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="text-lg font-semibold text-green-600">Operativo</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pedidos listos para cobrar */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos Listos para Cobrar</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No hay pagos pendientes</p>
              <p className="text-sm">Todos los pedidos están al día</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingPayments.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">#{order.id}</Badge>
                      {order.tableNumber && <Badge>Mesa {order.tableNumber}</Badge>}
                      <Badge className="bg-green-100 text-green-700">Listo</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${calculateTotal(order)}</p>
                      <p className="text-sm text-gray-600">Total a cobrar</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-medium">${item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => onProcessPayment(order.id)} className="flex-1">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Procesar Pago
                    </Button>
                    <Button variant="outline">Imprimir Ticket</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mensaje de rol no crítico */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Rol No Crítico Activo</span>
        </div>
        <p className="text-sm text-green-600">
          Tu función es independiente. Si necesitas ausentarte, el sistema continúa operando normalmente. Los pedidos se
          procesan sin depender de tu intervención.
        </p>
      </div>
    </div>
  )
}

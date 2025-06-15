"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Clock, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Activity } from "lucide-react"
import type { Order, QueueMetrics, Alert } from "../types/system"

interface SupervisorDashboardProps {
  orders: Order[]
  queueMetrics: QueueMetrics
  alerts: Alert[]
}

export function SupervisorDashboard({ orders, queueMetrics, alerts }: SupervisorDashboardProps) {
  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "paid")
  const completedToday = orders.filter((o) => o.status === "delivered" || o.status === "paid")
  const revenue = completedToday.reduce((sum, order) => {
    return sum + order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0)
  }, 0)

  const getStatusDistribution = () => {
    const distribution = {
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
    }
    return distribution
  }

  const statusDistribution = getStatusDistribution()

  const getHealthColor = (value: number) => {
    if (value >= 80) return "text-green-600"
    if (value >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Dashboard de Supervisión
        </h1>
        <p className="text-gray-600">Monitoreo completo del sistema operativo</p>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Activos</p>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Promedio</p>
                <p className={`text-2xl font-bold ${getHealthColor(100 - queueMetrics.averageWaitTime * 10)}`}>
                  {queueMetrics.averageWaitTime.toFixed(1)}min
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Eficiencia</p>
                <p className={`text-2xl font-bold ${getHealthColor(queueMetrics.efficiency)}`}>
                  {queueMetrics.efficiency.toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ingresos Hoy</p>
                <p className="text-2xl font-bold">${revenue}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="operations">Operaciones</TabsTrigger>
          <TabsTrigger value="performance">Rendimiento</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Distribución de estados */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{statusDistribution.pending}</div>
                  <div className="text-sm text-gray-600">Pendientes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{statusDistribution.preparing}</div>
                  <div className="text-sm text-gray-600">Preparando</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{statusDistribution.ready}</div>
                  <div className="text-sm text-gray-600">Listos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">{statusDistribution.delivered}</div>
                  <div className="text-sm text-gray-600">Entregados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carga por estación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Carga de Cocina</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Capacidad utilizada</span>
                    <span className={getHealthColor(100 - queueMetrics.kitchenLoad)}>{queueMetrics.kitchenLoad}%</span>
                  </div>
                  <Progress value={queueMetrics.kitchenLoad} className="h-3" />
                  <div className="text-sm text-gray-600">
                    {queueMetrics.kitchenLoad > 80
                      ? "Sobrecargada"
                      : queueMetrics.kitchenLoad > 60
                        ? "Alta carga"
                        : "Normal"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carga de Barra</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Capacidad utilizada</span>
                    <span className={getHealthColor(100 - queueMetrics.barLoad)}>{queueMetrics.barLoad}%</span>
                  </div>
                  <Progress value={queueMetrics.barLoad} className="h-3" />
                  <div className="text-sm text-gray-600">
                    {queueMetrics.barLoad > 80 ? "Sobrecargada" : queueMetrics.barLoad > 60 ? "Alta carga" : "Normal"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          {/* Lista de todos los pedidos */}
          <Card>
            <CardHeader>
              <CardTitle>Todos los Pedidos Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{order.id}</Badge>
                      {order.tableNumber && <Badge>Mesa {order.tableNumber}</Badge>}
                      <Badge
                        className={
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "preparing"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className="text-sm text-gray-600">{order.items.map((item) => item.name).join(", ")}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {Math.floor((Date.now() - order.createdAt.getTime()) / 60000)} min
                      </div>
                      <div className="text-xs text-gray-500">Est: {order.estimatedTime} min</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Métricas de rendimiento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eficiencia General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getHealthColor(queueMetrics.efficiency)}`}>
                    {queueMetrics.efficiency.toFixed(0)}%
                  </div>
                  <Progress value={queueMetrics.efficiency} className="mt-2" />
                  <div className="text-sm text-gray-600 mt-2">
                    {queueMetrics.efficiency >= 80
                      ? "Excelente"
                      : queueMetrics.efficiency >= 60
                        ? "Bueno"
                        : "Necesita mejora"}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">{completedToday.length}</div>
                  <div className="text-sm text-gray-600">Hoy</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tiempo Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getHealthColor(100 - queueMetrics.averageWaitTime * 10)}`}>
                    {queueMetrics.averageWaitTime.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">minutos</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Sistema de alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Alertas del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No hay alertas activas</p>
                  <p className="text-sm">El sistema está funcionando correctamente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === "error"
                          ? "bg-red-50 border-red-500"
                          : alert.type === "warning"
                            ? "bg-yellow-50 border-yellow-500"
                            : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-gray-600">{alert.timestamp.toLocaleTimeString()}</p>
                        </div>
                        <Badge
                          className={
                            alert.type === "error"
                              ? "bg-red-100 text-red-700"
                              : alert.type === "warning"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }
                        >
                          {alert.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

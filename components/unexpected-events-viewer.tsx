"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Clock, MessageSquare, TrendingDown, Truck, Users } from "lucide-react"
import type { SimulationData, UnexpectedEvent } from "../hooks/useAdvancedSimulation"

interface UnexpectedEventsViewerProps {
  events: UnexpectedEvent[]
  asIsData: SimulationData[]
}

export function UnexpectedEventsViewer({ events, asIsData }: UnexpectedEventsViewerProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No se registraron eventos inesperados</p>
            <p className="text-sm">En esta simulación no ocurrieron interrupciones</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "supplier_interruption":
        return <Truck className="w-5 h-5 text-red-500" />
      case "waiter_consultation":
        return <MessageSquare className="w-5 h-5 text-orange-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case "supplier_interruption":
        return "bg-red-100 text-red-700"
      case "waiter_consultation":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const totalImpact = events.reduce((sum, event) => sum + event.duration, 0)
  const totalAffectedClients = events.reduce((sum, event) => sum + event.affectedClients.length, 0)

  return (
    <div className="space-y-6">
      {/* Resumen de Impacto */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Eventos</p>
                <p className="text-2xl font-bold text-red-600">{events.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiempo Total de Impacto</p>
                <p className="text-2xl font-bold text-orange-600">{totalImpact.toFixed(1)} min</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Afectados</p>
                <p className="text-2xl font-bold text-blue-600">{totalAffectedClients}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Impacto Promedio</p>
                <p className="text-2xl font-bold text-purple-600">
                  {events.length > 0 ? (totalImpact / events.length).toFixed(1) : "0"} min
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Eventos Inesperados Registrados
          </CardTitle>
          <p className="text-sm text-gray-600">
            Estos eventos solo afectan el escenario actual (As-Is). En el escenario mejorado (To-Be) se eliminan
            mediante segmentación de tareas.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.type)}
                    <div>
                      <h3 className="font-semibold">{event.name}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  <Badge className={getEventColor(event.type)}>
                    {event.type === "supplier_interruption" && "Proveedor"}
                    {event.type === "waiter_consultation" && "Consulta"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Ocurrió en:</span>
                    <div className="font-medium">{event.occurredAt.toFixed(1)} min</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Duración:</span>
                    <div className="font-medium text-red-600">{event.duration} min</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Clientes Afectados:</span>
                    <div className="font-medium">{event.affectedClients.length}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Impacto Total:</span>
                    <div className="font-medium text-orange-600">{event.totalImpact} min</div>
                  </div>
                </div>

                {event.affectedClients.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-sm text-gray-500">Clientes afectados: </span>
                    <span className="text-sm font-medium">#{event.affectedClients.join(", #")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Impacto por Tipo de Evento */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis por Tipo de Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Evento</TableHead>
                <TableHead>Frecuencia</TableHead>
                <TableHead>Duración Promedio</TableHead>
                <TableHead>Impacto Total</TableHead>
                <TableHead>Clientes Afectados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {["supplier_interruption", "waiter_consultation"].map((type) => {
                const typeEvents = events.filter((e) => e.type === type)
                if (typeEvents.length === 0) return null

                const avgDuration = typeEvents.reduce((sum, e) => sum + e.duration, 0) / typeEvents.length
                const totalDuration = typeEvents.reduce((sum, e) => sum + e.duration, 0)
                const totalClients = typeEvents.reduce((sum, e) => sum + e.affectedClients.length, 0)

                return (
                  <TableRow key={type}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEventIcon(type)}
                        <span>
                          {type === "supplier_interruption" && "Interrupción del Proveedor"}
                          {type === "waiter_consultation" && "Consulta Mozo-Cajero"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{typeEvents.length}</TableCell>
                    <TableCell>{avgDuration.toFixed(1)} min</TableCell>
                    <TableCell className="font-medium text-red-600">{totalDuration} min</TableCell>
                    <TableCell>{totalClients}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Beneficios de la Segmentación */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Beneficios de la Segmentación de Tareas (To-Be)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-green-700">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p>
                <strong>Eliminación de interrupciones del proveedor:</strong> El cajero se dedica exclusivamente a
                atender clientes, mientras que un supervisor maneja las consultas de proveedores.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p>
                <strong>Reducción de consultas mozo-cajero:</strong> Los mozos tienen acceso directo a información de
                productos y precios, eliminando la necesidad de interrumpir al cajero.
              </p>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="font-medium text-green-800">
                🎯 Resultado: Tiempo de espera reducido en {(totalImpact / asIsData.length || 0).toFixed(1)} minutos
                promedio por cliente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

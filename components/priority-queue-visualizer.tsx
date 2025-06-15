"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Clock, Zap, CheckCircle } from "lucide-react"
import type { OrderWithPriority } from "../types/priority-system"

interface PriorityQueueVisualizerProps {
  orders: OrderWithPriority[]
  area: "cocina" | "barra"
}

export function PriorityQueueVisualizer({ orders, area }: PriorityQueueVisualizerProps) {
  const areaOrders = orders
    .filter((order) => order.destination === area)
    .sort((a, b) => b.priorityScore.finalScore - a.priorityScore.finalScore)

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
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

  const getComplexityIcon = (complexity: number) => {
    if (complexity >= 8) return <AlertTriangle className="w-4 h-4" />
    if (complexity >= 5) return <Clock className="w-4 h-4" />
    return <Zap className="w-4 h-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 capitalize">
          {getComplexityIcon(8)}
          Cola Inteligente - {area}
          <Badge variant="outline">{areaOrders.length} pedidos</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {areaOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No hay pedidos en cola</p>
            </div>
          ) : (
            areaOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getUrgencyColor(order.urgencyLevel)}>#{index + 1}</Badge>
                    <Badge variant="outline">#{order.id}</Badge>
                    {order.independentFlow && (
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        Flujo Independiente
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Score: {order.priorityScore.finalScore.toFixed(1)}</span>
                    {getComplexityIcon(order.complexityScore)}
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex justify-between items-center text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <div className="flex items-center gap-2">
                        {order.estimatedComplexity[itemIndex] && (
                          <Badge
                            variant="outline"
                            className={
                              order.estimatedComplexity[itemIndex].complexity === "complex"
                                ? "border-red-300 text-red-700"
                                : order.estimatedComplexity[itemIndex].complexity === "medium"
                                  ? "border-yellow-300 text-yellow-700"
                                  : "border-green-300 text-green-700"
                            }
                          >
                            {order.estimatedComplexity[itemIndex].baseTime}min
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Urgencia: {order.urgencyLevel}</span>
                    <span>Complejidad: {order.complexityScore}</span>
                    <span>Espera: {order.priorityScore.waitTime}min</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Prioridad</span>
                      <span>{Math.round(order.priorityScore.finalScore * 10)}%</span>
                    </div>
                    <Progress value={order.priorityScore.finalScore * 10} className="h-2" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

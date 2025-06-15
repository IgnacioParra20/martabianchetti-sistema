"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Users, DollarSign, Target, AlertCircle, Activity } from "lucide-react"
import type { Metrics } from "../types/system"

interface MetricsDashboardProps {
  metrics: Metrics
  realTime?: boolean
}

export function MetricsDashboard({ metrics, realTime = true }: MetricsDashboardProps) {
  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600"
    if (efficiency >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getEfficiencyBg = (efficiency: number) => {
    if (efficiency >= 90) return "bg-green-100"
    if (efficiency >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Pedidos por Hora */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pedidos/Hora</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.ordersPerHour}</div>
          <p className="text-xs text-muted-foreground">
            {realTime && <span className="text-green-600">●</span>} En tiempo real
          </p>
        </CardContent>
      </Card>

      {/* Tiempo Promedio de Espera */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.averageWaitTime}min</div>
          <p className="text-xs text-muted-foreground">Objetivo: &lt;8min</p>
        </CardContent>
      </Card>

      {/* Satisfacción del Cliente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfacción</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.customerSatisfaction}%</div>
          <Progress value={metrics.customerSatisfaction} className="mt-2" />
        </CardContent>
      </Card>

      {/* Eficiencia Operativa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getEfficiencyColor(metrics.efficiency)}`}>{metrics.efficiency}%</div>
          <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getEfficiencyBg(metrics.efficiency)}`}>
            {metrics.efficiency >= 90 ? "Excelente" : metrics.efficiency >= 70 ? "Bueno" : "Necesita mejora"}
          </div>
        </CardContent>
      </Card>

      {/* Revenue */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos del Día</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600">+12% vs ayer</span>
          </div>
        </CardContent>
      </Card>

      {/* Horas Pico */}
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Horas Pico Detectadas</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {metrics.peakHours.map((hour, index) => (
              <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                {hour}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Considera reforzar personal en estos horarios</p>
        </CardContent>
      </Card>
    </div>
  )
}

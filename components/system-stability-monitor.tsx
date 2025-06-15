"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, TrendingUp, Activity, CheckCircle, XCircle, Zap } from "lucide-react"
import type { SystemStability } from "../types/priority-system"

interface SystemStabilityMonitorProps {
  stability: SystemStability
}

export function SystemStabilityMonitor({ stability }: SystemStabilityMonitorProps) {
  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600"
    if (health >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthIcon = (health: number) => {
    if (health >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (health >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />
    return <XCircle className="w-5 h-5 text-red-600" />
  }

  const getStabilityColor = (stability: string) => {
    switch (stability) {
      case "stable":
        return "bg-green-100 text-green-700 border-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "critical":
        return "bg-red-100 text-red-700 border-red-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Monitor de Estabilidad del Sistema
          {getHealthIcon(stability.overallHealth)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Salud General */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Salud General del Sistema</span>
            <span className={`font-bold text-lg ${getHealthColor(stability.overallHealth)}`}>
              {stability.overallHealth}%
            </span>
          </div>
          <Progress value={stability.overallHealth} className="h-3" />
        </div>

        {/* Distribución de Carga */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Distribución de Carga por Área
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {stability.loadDistribution.map((area) => (
              <div key={area.area} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize">{area.area}</span>
                  <Badge className={getStabilityColor(area.stability)}>{area.stability}</Badge>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carga</span>
                  <span>{area.load}%</span>
                </div>
                <Progress value={area.load} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Nodos Críticos */}
        <div>
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Análisis de Nodos Críticos
          </h3>
          {stability.criticalNodes.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Sistema Equilibrado</span>
              </div>
              <p className="text-sm text-green-600 mt-1">
                No se detectaron nodos críticos. El cajero opera independientemente.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stability.criticalNodes.map((node) => (
                <Alert key={node} className="border-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Nodo crítico detectado:</strong> {node}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>

        {/* Cuellos de Botella */}
        {stability.bottlenecks.length > 0 && (
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Cuellos de Botella Detectados
            </h3>
            <div className="space-y-2">
              {stability.bottlenecks.map((bottleneck) => (
                <div key={bottleneck} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium capitalize">{bottleneck}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {stability.recommendations.length > 0 && (
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Recomendaciones del Sistema
            </h3>
            <div className="space-y-2">
              {stability.recommendations.map((recommendation, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Indicador de Cajero No Crítico */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Cajero - Nodo No Crítico</span>
          </div>
          <p className="text-sm text-green-600">
            ✅ El cajero opera independientemente sin bloquear el sistema
            <br />✅ Los pedidos fluyen sin depender del punto de caja
            <br />✅ Sistema equilibrado y escalable
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, TrendingUp, Clock, Brain, CheckCircle, X, Pause } from "lucide-react"
import type { Alert } from "../types/system"

interface IntelligentAlertsProps {
  alerts: Alert[]
  onAlertAction: (alertId: string, action: "acknowledge" | "resolve" | "snooze") => void
}

export function IntelligentAlerts({ alerts, onAlertAction }: IntelligentAlertsProps) {
  const [filter, setFilter] = useState<"all" | "predictive" | "critical">("all")

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "predictive") return alert.predictive
    if (filter === "critical") return alert.priority === "critical"
    return alert.status === "active"
  })

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      case "high":
        return <TrendingUp className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 border-red-500 text-red-700"
      case "high":
        return "bg-orange-100 border-orange-500 text-orange-700"
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-700"
      default:
        return "bg-blue-100 border-blue-500 text-blue-700"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "performance":
        return <TrendingUp className="w-4 h-4" />
      case "system":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Alertas Inteligentes
            {filteredAlerts.length > 0 && <Badge variant="destructive">{filteredAlerts.length}</Badge>}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              Todas
            </Button>
            <Button
              variant={filter === "predictive" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("predictive")}
            >
              Predictivas
            </Button>
            <Button
              variant={filter === "critical" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("critical")}
            >
              Críticas
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>No hay alertas activas</p>
                <p className="text-sm">El sistema está funcionando correctamente</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`p-4 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityIcon(alert.priority)}
                        <span className="font-medium capitalize">{alert.type}</span>
                        <Badge variant="outline" className="text-xs">
                          {alert.priority}
                        </Badge>
                        {alert.predictive && (
                          <Badge className="bg-purple-100 text-purple-700 text-xs">
                            <Brain className="w-3 h-3 mr-1" />
                            Predictiva
                          </Badge>
                        )}
                        {alert.autoAssign && (
                          <Badge className="bg-green-100 text-green-700 text-xs">Auto-asignada</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <div className="text-xs text-gray-500">{alert.timestamp.toLocaleTimeString()}</div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAlertAction(alert.id, "snooze")}
                        className="text-xs"
                      >
                        <Pause className="w-3 h-3 mr-1" />
                        Posponer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAlertAction(alert.id, "acknowledge")}
                        className="text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Aceptar
                      </Button>
                      <Button size="sm" onClick={() => onAlertAction(alert.id, "resolve")} className="text-xs">
                        <X className="w-3 h-3 mr-1" />
                        Resolver
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}

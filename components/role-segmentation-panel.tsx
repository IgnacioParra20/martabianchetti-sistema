"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, CreditCard, ChefHat, Coffee, CheckCircle, XCircle, Shield, AlertTriangle } from "lucide-react"
import type { RoleSegmentation } from "../types/priority-system"

interface RoleSegmentationPanelProps {
  currentRole: string
  segmentation: RoleSegmentation[]
}

export function RoleSegmentationPanel({ currentRole, segmentation }: RoleSegmentationPanelProps) {
  const currentRoleData = segmentation.find((role) => role.role === currentRole)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "cajero":
        return <CreditCard className="w-5 h-5" />
      case "mozo":
        return <User className="w-5 h-5" />
      case "produccion":
        return <ChefHat className="w-5 h-5" />
      case "barra":
        return <Coffee className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  const getLoadColor = (load: number, maxCapacity: number) => {
    const percentage = (load / maxCapacity) * 100
    if (percentage >= 80) return "text-red-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  if (!currentRoleData) return null

  return (
    <div className="space-y-6">
      {/* Panel Principal del Rol */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getRoleIcon(currentRole)}
            Panel Exclusivo - {currentRoleData.role.charAt(0).toUpperCase() + currentRoleData.role.slice(1)}
            {currentRoleData.canOperateIndependently && (
              <Badge className="bg-green-100 text-green-700">
                <Shield className="w-3 h-3 mr-1" />
                Independiente
              </Badge>
            )}
            {currentRoleData.isBottleneck && (
              <Badge className="bg-red-100 text-red-700">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Cuello de Botella
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Carga Actual */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Carga Operativa</span>
              <span className={`font-bold ${getLoadColor(currentRoleData.currentLoad, currentRoleData.maxCapacity)}`}>
                {currentRoleData.currentLoad}/{currentRoleData.maxCapacity}
              </span>
            </div>
            <Progress value={(currentRoleData.currentLoad / currentRoleData.maxCapacity) * 100} className="h-3" />
          </div>

          {/* Tareas Exclusivas */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Tareas Exclusivas de tu Rol
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {currentRoleData.exclusiveTasks.map((task, index) => (
                <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-700">{task}</span>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tareas Prohibidas */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              Tareas NO Asignadas (Otros Roles)
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {currentRoleData.prohibitedTasks.map((task, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">{task}</span>
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje Específico para Cajero */}
          {currentRole === "cajero" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Rol No Crítico Confirmado</span>
              </div>
              <p className="text-sm text-blue-600">
                Tu función está optimizada para ser independiente. Si detienes tu actividad, el resto del sistema
                continúa operando normalmente. Los pedidos fluyen automáticamente sin depender de tu intervención.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vista de Todos los Roles */}
      <Card>
        <CardHeader>
          <CardTitle>Segmentación General del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {segmentation.map((role) => (
              <div
                key={role.role}
                className={`border rounded-lg p-4 ${
                  role.role === currentRole ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(role.role)}
                    <span className="font-medium capitalize">{role.role}</span>
                  </div>
                  <div className="flex gap-1">
                    {role.canOperateIndependently && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Independiente</Badge>
                    )}
                    {role.isBottleneck && <Badge className="bg-red-100 text-red-700 text-xs">Sobrecargado</Badge>}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Carga:</span>
                    <span className={getLoadColor(role.currentLoad, role.maxCapacity)}>
                      {role.currentLoad}/{role.maxCapacity}
                    </span>
                  </div>
                  <Progress value={(role.currentLoad / role.maxCapacity) * 100} className="h-2" />
                  <div className="text-xs text-gray-600">{role.exclusiveTasks.length} tareas exclusivas</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

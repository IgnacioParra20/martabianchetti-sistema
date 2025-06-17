"use client"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, CheckCircle } from "lucide-react"
import type { SimulationData } from "../hooks/useAdvancedSimulation"

interface DetailedSimulationTableProps {
  data: SimulationData[]
  scenario: "as-is" | "to-be"
  showAll?: boolean
}

export function DetailedSimulationTable({ data, scenario, showAll = false }: DetailedSimulationTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos para mostrar</p>
      </div>
    )
  }

  const displayData = showAll ? data : data.slice(0, 10)
  const scenarioColor = scenario === "as-is" ? "text-red-600" : "text-green-600"
  const affectedClients = data.filter((d) => d.affectedByEvent).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={scenario === "as-is" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}>
            {scenario === "as-is" ? "Escenario Actual" : "Escenario Mejorado"}
          </Badge>
          {scenario === "as-is" && affectedClients > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="bg-orange-100 text-orange-700 cursor-help">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {affectedClients} afectados por eventos
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clientes que experimentaron demoras debido a eventos inesperados</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {scenario === "to-be" && (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Sin interrupciones
            </Badge>
          )}
        </div>
        {!showAll && data.length > 10 && (
          <span className="text-sm text-gray-500">Mostrando primeros 10 de {data.length} registros</span>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Llegada</TableHead>
              <TableHead>Inicio Servicio</TableHead>
              <TableHead>Fin Servicio</TableHead>
              <TableHead>Tiempo Servicio</TableHead>
              <TableHead>Tiempo Espera</TableHead>
              <TableHead className={`font-semibold ${scenarioColor}`}>Tiempo Total</TableHead>
              {scenario === "as-is" && <TableHead>Evento Afectante</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row) => (
              <TableRow key={row.id} className={row.affectedByEvent ? "bg-orange-50" : ""}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-1">
                    #{row.id}
                    {row.affectedByEvent && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className="w-3 h-3 text-orange-500 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cliente afectado por: {row.affectedByEvent}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
                <TableCell>{row.arrivalTime.toFixed(2)} min</TableCell>
                <TableCell>{row.serviceStartTime.toFixed(2)} min</TableCell>
                <TableCell>{row.serviceEndTime.toFixed(2)} min</TableCell>
                <TableCell>{row.serviceTime.toFixed(2)} min</TableCell>
                <TableCell>
                  <span className={row.waitTime > 0 ? "text-orange-600 font-medium" : "text-gray-500"}>
                    {row.waitTime.toFixed(2)} min
                  </span>
                </TableCell>
                <TableCell className={`font-semibold ${scenarioColor}`}>{row.totalTime.toFixed(2)} min</TableCell>
                {scenario === "as-is" && (
                  <TableCell>
                    {row.affectedByEvent ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge className="bg-orange-100 text-orange-700 text-xs cursor-help">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {row.affectedByEvent}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Demora adicional: {row.eventDelay?.toFixed(1)} min</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <span className="text-gray-400 text-xs">Sin eventos</span>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Resumen estadístico mejorado */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div className="bg-gray-50 rounded p-3">
          <div className="text-xs text-gray-600">Promedio Total</div>
          <div className={`text-lg font-bold ${scenarioColor}`}>
            {(data.reduce((sum, d) => sum + d.totalTime, 0) / data.length).toFixed(1)} min
          </div>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <div className="text-xs text-gray-600">Promedio Espera</div>
          <div className="text-lg font-bold text-orange-600">
            {(data.reduce((sum, d) => sum + d.waitTime, 0) / data.length).toFixed(1)} min
          </div>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <div className="text-xs text-gray-600">Tiempo Máximo</div>
          <div className="text-lg font-bold text-gray-700">
            {Math.max(...data.map((d) => d.totalTime)).toFixed(1)} min
          </div>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <div className="text-xs text-gray-600">{scenario === "as-is" ? "Clientes Afectados" : "Interrupciones"}</div>
          <div className={`text-lg font-bold ${scenario === "as-is" ? "text-orange-600" : "text-green-600"}`}>
            {scenario === "as-is" ? affectedClients : "0"}
          </div>
        </div>
      </div>
    </div>
  )
}

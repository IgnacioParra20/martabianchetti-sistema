"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    BarChart3,
    Calculator,
    ChevronDown,
    Clock,
    Download,
    FileSpreadsheet,
    Info,
    Play,
    Settings,
    TrendingUp,
    Users,
} from "lucide-react"
import { useState } from "react"
import { useAdvancedSimulation } from "../hooks/useAdvancedSimulation"
import { ChiSquareTest } from "./chi-square-test"
import { CongruentialMethodInfo } from "./congruential-method-info"
import { DetailedSimulationTable } from "./detailed-simulation-table"
import { RandomNumbersViewer } from "./random-numbers-viewer"
import { SimulationChart } from "./simulation-chart"

export function AdminSimulationDashboard() {
  const [numClients, setNumClients] = useState(20)
  const [seed, setSeed] = useState(12345)
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [isMethodInfoOpen, setIsMethodInfoOpen] = useState(false)

  const { asIsData, toBeData, randomNumbers, chiSquareResult, isRunning, runSimulation, getStatistics, exportData } =
    useAdvancedSimulation()

  const handleRunSimulation = () => {
    runSimulation(numClients, seed)
  }

  const handleExportData = (format: "csv" | "json") => {
    exportData(format)
  }

  const asIsStats = asIsData.length > 0 ? getStatistics(asIsData) : null
  const toBeStats = toBeData.length > 0 ? getStatistics(toBeData) : null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold">Simulador Avanzado de Tiempos de Servicio</h1>
            <Badge className="bg-purple-100 text-purple-700">Administrador Exclusivo</Badge>
          </div>
          <div className="flex gap-2">
            {asIsData.length > 0 && (
              <>
                <Button variant="outline" onClick={() => handleExportData("csv")}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button variant="outline" onClick={() => handleExportData("json")}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar JSON
                </Button>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-600">
          Análisis comparativo mediante generación pseudoaleatoria con método congruencial mixto
        </p>
      </div>

      {/* Controles de Simulación */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Parámetros de Simulación
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Utiliza generador congruencial mixto: X(n+1) = (a × X(n) + c) mod m</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Número de Clientes</label>
              <Input
                type="number"
                value={numClients}
                onChange={(e) => setNumClients(Math.max(5, Math.min(100, Number.parseInt(e.target.value) || 20)))}
                min="5"
                max="100"
                placeholder="20"
              />
              <p className="text-xs text-gray-500 mt-1">Rango: 5-100 clientes</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semilla (Seed)</label>
              <Input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number.parseInt(e.target.value) || 12345)}
                placeholder="12345"
              />
              <p className="text-xs text-gray-500 mt-1">Valor inicial del generador</p>
            </div>
            <Button onClick={handleRunSimulation} disabled={isRunning} className="h-10">
              {isRunning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Ejecutar Simulación
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setIsMethodInfoOpen(!isMethodInfoOpen)} className="h-10">
              <Info className="w-4 h-4 mr-2" />
              Método Congruencial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información del Método Congruencial */}
      {isMethodInfoOpen && (
        <div className="mb-6">
          <CongruentialMethodInfo />
        </div>
      )}

      {/* Resultados de la Simulación */}
      {asIsData.length > 0 && (
        <>
          {/* Métricas Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clientes Simulados</p>
                    <p className="text-2xl font-bold">{asIsData.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Promedio (As-Is)</p>
                    <p className="text-2xl font-bold text-red-600">{asIsStats?.averageTotal.toFixed(1)}min</p>
                  </div>
                  <Clock className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tiempo Promedio (To-Be)</p>
                    <p className="text-2xl font-bold text-green-600">{toBeStats?.averageTotal.toFixed(1)}min</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Mejora Obtenida</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {asIsStats && toBeStats
                        ? `${(((asIsStats.averageTotal - toBeStats.averageTotal) / asIsStats.averageTotal) * 100).toFixed(1)}%`
                        : "0%"}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pestañas Principales */}
          <Tabs defaultValue="comparison" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="comparison">Comparación Histogramas</TabsTrigger>
              <TabsTrigger value="random-numbers">Números Pseudoaleatorios</TabsTrigger>
              <TabsTrigger value="detailed-data">Datos Detallados</TabsTrigger>
              <TabsTrigger value="validation">Validación Estadística</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Escenario Actual (As-Is)</CardTitle>
                    <p className="text-sm text-gray-600">Sistema sin optimizaciones</p>
                  </CardHeader>
                  <CardContent>
                    <SimulationChart data={asIsData} title="As-Is" color="#ef4444" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Escenario Mejorado (To-Be)</CardTitle>
                    <p className="text-sm text-gray-600">Sistema con segmentación de tareas</p>
                  </CardHeader>
                  <CardContent>
                    <SimulationChart data={toBeData} title="To-Be" color="#22c55e" />
                  </CardContent>
                </Card>
              </div>

              {/* Tablas Detalladas debajo de cada gráfico */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Datos As-Is - Detallados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailedSimulationTable data={asIsData} scenario="as-is" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Datos To-Be - Detallados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailedSimulationTable data={toBeData} scenario="to-be" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="random-numbers" className="space-y-6">
              <RandomNumbersViewer randomNumbers={randomNumbers} seed={seed} onExport={handleExportData} />
            </TabsContent>

            <TabsContent value="detailed-data" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5" />
                      Datos Completos de Simulación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="as-is-data">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="as-is-data">Datos As-Is</TabsTrigger>
                        <TabsTrigger value="to-be-data">Datos To-Be</TabsTrigger>
                      </TabsList>
                      <TabsContent value="as-is-data">
                        <DetailedSimulationTable data={asIsData} scenario="as-is" showAll />
                      </TabsContent>
                      <TabsContent value="to-be-data">
                        <DetailedSimulationTable data={toBeData} scenario="to-be" showAll />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="validation" className="space-y-6">
              <ChiSquareTest result={chiSquareResult} />
            </TabsContent>
          </Tabs>

          {/* Estadísticas Avanzadas (Colapsable) */}
          <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Estadísticas Comparativas Detalladas
                    </CardTitle>
                    <ChevronDown className={`w-5 h-5 transition-transform ${isStatsOpen ? "rotate-180" : ""}`} />
                  </div>
                </CardHeader>
              </Card>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {asIsStats && (
                      <div>
                        <h3 className="font-semibold text-red-600 mb-3">Estadísticas As-Is</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tiempo Total Promedio:</span>
                            <span className="font-medium">{asIsStats.averageTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo de Espera Promedio:</span>
                            <span className="font-medium">{asIsStats.averageWait.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo de Servicio Promedio:</span>
                            <span className="font-medium">{asIsStats.averageService.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo Máximo:</span>
                            <span className="font-medium">{asIsStats.maxTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo Mínimo:</span>
                            <span className="font-medium">{asIsStats.minTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Desviación Estándar:</span>
                            <span className="font-medium">{asIsStats.stdDeviation.toFixed(2)} min</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {toBeStats && (
                      <div>
                        <h3 className="font-semibold text-green-600 mb-3">Estadísticas To-Be</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tiempo Total Promedio:</span>
                            <span className="font-medium">{toBeStats.averageTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo de Espera Promedio:</span>
                            <span className="font-medium">{toBeStats.averageWait.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo de Servicio Promedio:</span>
                            <span className="font-medium">{toBeStats.averageService.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo Máximo:</span>
                            <span className="font-medium">{toBeStats.maxTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo Mínimo:</span>
                            <span className="font-medium">{toBeStats.minTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Desviación Estándar:</span>
                            <span className="font-medium">{toBeStats.stdDeviation.toFixed(2)} min</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Comparación de Mejoras */}
                  {asIsStats && toBeStats && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-blue-600 mb-3">Análisis de Mejoras</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">Reducción Tiempo Total</div>
                          <div className="text-lg font-bold text-blue-600">
                            {(
                              ((asIsStats.averageTotal - toBeStats.averageTotal) / asIsStats.averageTotal) *
                              100
                            ).toFixed(1)}
                            %
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">Reducción Tiempo Espera</div>
                          <div className="text-lg font-bold text-blue-600">
                            {(((asIsStats.averageWait - toBeStats.averageWait) / asIsStats.averageWait) * 100).toFixed(
                              1,
                            )}
                            %
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="text-sm text-gray-600">Ahorro Promedio</div>
                          <div className="text-lg font-bold text-blue-600">
                            {(asIsStats.averageTotal - toBeStats.averageTotal).toFixed(1)} min
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </div>
  )
}

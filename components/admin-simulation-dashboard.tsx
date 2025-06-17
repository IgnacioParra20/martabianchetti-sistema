"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronDown,
  Clock,
  Coffee,
  Download,
  Equal,
  FileSpreadsheet,
  Info,
  Play,
  Settings,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { useAdvancedSimulation } from "../hooks/useAdvancedSimulation"
import { ChiSquareTest } from "./chi-square-test"
import { CongruentialMethodInfo } from "./congruential-method-info"
import { DetailedSimulationTable } from "./detailed-simulation-table"
import { RandomNumbersViewer } from "./random-numbers-viewer"
import { SimulationChart } from "./simulation-chart"
import { UnexpectedEventsViewer } from "./unexpected-events-viewer"

export function AdminSimulationDashboard() {
  const [numClients, setNumClients] = useState(5)
  const [seed, setSeed] = useState(12345)
  const [isStatsOpen, setIsStatsOpen] = useState(false)
  const [isMethodInfoOpen, setIsMethodInfoOpen] = useState(false)

  const {
    asIsData,
    toBeData,
    randomNumbers,
    unexpectedEvents,
    chiSquareResult,
    isRunning,
    runSimulation,
    getStatistics,
    exportData,
  } = useAdvancedSimulation()

  const handleRunSimulation = () => {
    runSimulation(numClients, seed)
  }

  const handleExportData = (format: "csv" | "json") => {
    exportData(format)
  }

  const asIsStats = asIsData.length > 0 ? getStatistics(asIsData) : null
  const toBeStats = toBeData.length > 0 ? getStatistics(toBeData) : null
  const hasEvents = unexpectedEvents.length > 0
  const hasImprovements = asIsStats && toBeStats && Math.abs(asIsStats.averageTotal - toBeStats.averageTotal) > 0.1

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-bold">Simulador Cafetería "Martha de Bianchetti"</h1>
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
          Análisis comparativo con lógica adaptativa: mejoras solo cuando hay eventos inesperados
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
                  <p>Lógica adaptativa: To-Be mejora solo si hay eventos en As-Is</p>
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
                onChange={(e) => setNumClients(Math.max(1, Math.min(10, Number.parseInt(e.target.value) || 5)))}
                min="1"
                max="10"
                placeholder="5"
              />
              <p className="text-xs text-gray-500 mt-1">Rango: 1-10 clientes</p>
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
          {/* Indicador de Lógica Adaptativa */}
          <Card className={`mb-6 ${hasEvents ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {hasEvents ? (
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                )}
                <div>
                  <h3 className={`font-semibold ${hasEvents ? "text-orange-800" : "text-blue-800"}`}>
                    {hasEvents ? "Eventos Detectados - Mejoras Aplicadas" : "Sin Eventos - No Se Requieren Mejoras"}
                  </h3>
                  <p className={`text-sm mt-1 ${hasEvents ? "text-orange-700" : "text-blue-700"}`}>
                    {hasEvents ? (
                      <>
                        Se detectaron <strong>{unexpectedEvents.length} eventos inesperados</strong> en el escenario
                        actual. El escenario mejorado (To-Be) implementa segmentación de tareas para eliminar estas
                        interrupciones.
                      </>
                    ) : (
                      <>
                        No se detectaron eventos inesperados en el escenario actual. El escenario mejorado (To-Be)
                        mantiene los mismos valores ya que no hay problemas que resolver.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas Resumen con Lógica Condicional */}
          <div
            className={`grid gap-6 mb-6 ${hasEvents ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"}`}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
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
                <div className="flex items-center justify-between mb-3">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tiempo Promedio {hasEvents ? "(As-Is)" : ""}</p>
                        <p className="text-2xl font-bold text-red-600">{asIsStats?.averageTotal.toFixed(1)}min</p>
                        <p className="text-xs text-red-500">{hasEvents ? "Con interrupciones" : "Sistema actual"}</p>
                      </div>
                      <Clock className="w-8 h-8 text-red-500" />
                    </div>
                    {hasEvents && (
                      <div className="mt-3 pt-3 border-t border-red-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Tiempo por eventos:</span>
                          <span className="text-sm font-bold text-orange-600">
                            +{asIsStats?.eventsImpact ? (asIsStats.eventsImpact / asIsData.length).toFixed(1) : "0"}{" "}
                            min/cliente
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">Total eventos:</span>
                          <span className="text-sm font-medium text-orange-600">
                            {asIsStats?.eventsImpact?.toFixed(1) || "0"} min
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {hasEvents && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Tiempo Promedio (To-Be)</p>
                          <p className="text-2xl font-bold text-green-600">{toBeStats?.averageTotal.toFixed(1)}min</p>
                          <p className="text-xs text-green-500">Sin interrupciones</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <div className="mt-3 pt-3 border-t border-green-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Eventos eliminados:</span>
                          <span className="text-sm font-bold text-green-600">{unexpectedEvents.length}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">Mejora obtenida:</span>
                          <span className="text-sm font-medium text-green-600">
                            {asIsStats && toBeStats
                              ? `${(((asIsStats.averageTotal - toBeStats.averageTotal) / asIsStats.averageTotal) * 100).toFixed(1)}%`
                              : "0%"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{hasEvents ? "Eventos Registrados" : "Estado del Sistema"}</p>
                    <p className={`text-2xl font-bold ${hasEvents ? "text-red-600" : "text-green-600"}`}>
                      {hasEvents ? unexpectedEvents.length : "Óptimo"}
                    </p>
                    <p className={`text-xs ${hasEvents ? "text-red-500" : "text-green-500"}`}>
                      {hasEvents ? "Requieren atención" : "Sin problemas"}
                    </p>
                  </div>
                  {hasEvents ? (
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  ) : (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segunda fila de métricas - Solo si hay eventos */}
          {hasEvents && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Tiempo Espera (As-Is)</p>
                          <p className="text-2xl font-bold text-orange-600">{asIsStats?.averageWait.toFixed(1)}min</p>
                          <p className="text-xs text-orange-500">Con eventos</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-500" />
                      </div>
                      <div className="mt-3 pt-3 border-t border-orange-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Clientes afectados:</span>
                          <span className="text-sm font-bold text-orange-600">{asIsStats?.clientsAffected || 0}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">% afectados:</span>
                          <span className="text-sm font-medium text-orange-600">
                            {asIsData.length > 0
                              ? (((asIsStats?.clientsAffected || 0) / asIsData.length) * 100).toFixed(1)
                              : "0"}
                            %
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Tiempo Espera (To-Be)</p>
                      <p className="text-2xl font-bold text-green-600">{toBeStats?.averageWait.toFixed(1)}min</p>
                      <p className="text-xs text-green-500">Sin eventos</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Impacto Total</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {asIsStats?.eventsImpact?.toFixed(1) || "0"} min
                      </p>
                      <p className="text-xs text-purple-500">Tiempo perdido</p>
                    </div>
                    <Clock className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pestañas Principales */}
          <Tabs defaultValue="comparison" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="comparison">Comparación Histogramas</TabsTrigger>
              <TabsTrigger value="events">Eventos Inesperados</TabsTrigger>
              <TabsTrigger value="random-numbers">Números Pseudoaleatorios</TabsTrigger>
              <TabsTrigger value="detailed-data">Datos Detallados</TabsTrigger>
              <TabsTrigger value="validation">Validación Estadística</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison" className="space-y-6">
              <div className={`grid gap-6 ${hasEvents ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      {hasEvents ? "Escenario Actual (As-Is)" : "Escenario Actual"}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {hasEvents
                        ? "Sistema con interrupciones y eventos inesperados"
                        : "Sistema funcionando sin eventos inesperados"}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <SimulationChart data={asIsData} title={hasEvents ? "As-Is" : "Actual"} color="#ef4444" />
                  </CardContent>
                </Card>

                {hasEvents && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Escenario Mejorado (To-Be)
                      </CardTitle>
                      <p className="text-sm text-gray-600">Sistema sin interrupciones (eventos eliminados)</p>
                    </CardHeader>
                    <CardContent>
                      <SimulationChart data={toBeData} title="To-Be" color="#22c55e" />
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Tablas Detalladas debajo de cada gráfico */}
              <div className={`grid gap-6 ${hasEvents ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      {hasEvents ? "Datos As-Is - Con Eventos Inesperados" : "Datos del Sistema Actual"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DetailedSimulationTable data={asIsData} scenario="as-is" />
                  </CardContent>
                </Card>

                {hasEvents && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-green-600 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Datos To-Be - Sin Interrupciones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DetailedSimulationTable data={toBeData} scenario="to-be" />
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <UnexpectedEventsViewer events={unexpectedEvents} asIsData={asIsData} />
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
                    {hasEvents ? (
                      <Tabs defaultValue="as-is-data">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="as-is-data">Datos As-Is (Con Eventos)</TabsTrigger>
                          <TabsTrigger value="to-be-data">Datos To-Be (Sin Eventos)</TabsTrigger>
                        </TabsList>
                        <TabsContent value="as-is-data">
                          <DetailedSimulationTable data={asIsData} scenario="as-is" showAll />
                        </TabsContent>
                        <TabsContent value="to-be-data">
                          <DetailedSimulationTable data={toBeData} scenario="to-be" showAll />
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <DetailedSimulationTable data={asIsData} scenario="as-is" showAll />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="validation" className="space-y-6">
              <ChiSquareTest result={chiSquareResult} />
            </TabsContent>
          </Tabs>

          {/* Estadísticas Comparativas con Lógica Adaptativa */}
          <Collapsible open={isStatsOpen} onOpenChange={setIsStatsOpen}>
            <CollapsibleTrigger asChild>
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Análisis Detallado con Lógica Adaptativa
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
                        <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4" />
                          Estadísticas As-Is ({hasEvents ? "Con Eventos" : "Sin Eventos"})
                        </h3>
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
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-orange-600">Clientes Afectados por Eventos:</span>
                            <span className="font-medium text-orange-600">{asIsStats.clientsAffected}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-orange-600">Tiempo Total de Impacto:</span>
                            <span className="font-medium text-orange-600">
                              {asIsStats.eventsImpact?.toFixed(2)} min
                            </span>
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
                        <h3
                          className={`font-semibold mb-3 flex items-center gap-2 ${hasImprovements ? "text-green-600" : "text-blue-600"}`}
                        >
                          {hasImprovements ? <CheckCircle className="w-4 h-4" /> : <Equal className="w-4 h-4" />}
                          Estadísticas To-Be ({hasImprovements ? "Mejorado" : "Sin Cambios"})
                        </h3>
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
                          <div className="flex justify-between border-t pt-2">
                            <span className={hasImprovements ? "text-green-600" : "text-blue-600"}>
                              Eventos Inesperados:
                            </span>
                            <span className={`font-medium ${hasImprovements ? "text-green-600" : "text-blue-600"}`}>
                              0 ({hasImprovements ? "Eliminados" : "No Detectados"})
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={hasImprovements ? "text-green-600" : "text-blue-600"}>
                              Tiempo de Impacto:
                            </span>
                            <span className={`font-medium ${hasImprovements ? "text-green-600" : "text-blue-600"}`}>
                              0 min
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Desviación Estándar:</span>
                            <span className="font-medium">{toBeStats.stdDeviation.toFixed(2)} min</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Análisis de Mejoras por Segmentación */}
                  {asIsStats && toBeStats && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        {hasImprovements
                          ? "Beneficios de la Segmentación de Tareas"
                          : "Análisis de Estabilidad del Sistema"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className={`rounded-lg p-3 ${hasImprovements ? "bg-blue-50" : "bg-gray-50"}`}>
                          <div className="text-sm text-gray-600">
                            {hasImprovements ? "Reducción Tiempo Total" : "Cambio Tiempo Total"}
                          </div>
                          <div className={`text-lg font-bold ${hasImprovements ? "text-blue-600" : "text-gray-600"}`}>
                            {hasImprovements
                              ? (
                                  ((asIsStats.averageTotal - toBeStats.averageTotal) / asIsStats.averageTotal) *
                                  100
                                ).toFixed(1) + "%"
                              : "0%"}
                          </div>
                        </div>
                        <div className={`rounded-lg p-3 ${hasImprovements ? "bg-blue-50" : "bg-gray-50"}`}>
                          <div className="text-sm text-gray-600">
                            {hasImprovements ? "Reducción Tiempo Espera" : "Cambio Tiempo Espera"}
                          </div>
                          <div className={`text-lg font-bold ${hasImprovements ? "text-blue-600" : "text-gray-600"}`}>
                            {hasImprovements
                              ? (
                                  ((asIsStats.averageWait - toBeStats.averageWait) / asIsStats.averageWait) *
                                  100
                                ).toFixed(1) + "%"
                              : "0%"}
                          </div>
                        </div>
                        <div className={`rounded-lg p-3 ${hasImprovements ? "bg-blue-50" : "bg-gray-50"}`}>
                          <div className="text-sm text-gray-600">
                            {hasImprovements ? "Ahorro Promedio" : "Diferencia Promedio"}
                          </div>
                          <div className={`text-lg font-bold ${hasImprovements ? "text-blue-600" : "text-gray-600"}`}>
                            {(asIsStats.averageTotal - toBeStats.averageTotal).toFixed(1)} min
                          </div>
                        </div>
                        <div className={`rounded-lg p-3 ${hasEvents ? "bg-blue-50" : "bg-gray-50"}`}>
                          <div className="text-sm text-gray-600">
                            {hasEvents ? "Eventos Eliminados" : "Eventos Detectados"}
                          </div>
                          <div className={`text-lg font-bold ${hasEvents ? "text-blue-600" : "text-gray-600"}`}>
                            {unexpectedEvents.length}
                          </div>
                        </div>
                      </div>

                      <div className={`mt-4 p-4 rounded-lg ${hasImprovements ? "bg-green-50" : "bg-blue-50"}`}>
                        <h4 className={`font-medium mb-2 ${hasImprovements ? "text-green-800" : "text-blue-800"}`}>
                          🎯 Conclusión del Análisis
                        </h4>
                        <p className={`text-sm ${hasImprovements ? "text-green-700" : "text-blue-700"}`}>
                          {hasImprovements ? (
                            <>
                              La implementación de segmentación de tareas en la cafetería "Martha de Bianchetti" elimina
                              completamente las interrupciones que afectan al cajero, resultando en una mejora promedio
                              de <strong>{(asIsStats.averageTotal - toBeStats.averageTotal).toFixed(1)} minutos</strong>{" "}
                              por cliente y una reducción del{" "}
                              <strong>
                                {(
                                  ((asIsStats.averageTotal - toBeStats.averageTotal) / asIsStats.averageTotal) *
                                  100
                                ).toFixed(1)}
                                %
                              </strong>
                              en los tiempos de espera.
                            </>
                          ) : (
                            <>
                              El sistema actual de la cafetería "Martha de Bianchetti" ya funciona de manera óptima sin
                              eventos inesperados que requieran intervención. Los tiempos de servicio se mantienen
                              estables en <strong>{asIsStats.averageTotal.toFixed(1)} minutos</strong> promedio por
                              cliente, indicando que no se requieren mejoras adicionales en este momento.
                            </>
                          )}
                        </p>
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

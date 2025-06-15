"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BarChart3, Play, Settings, ChevronDown, TrendingUp, Clock, Users } from "lucide-react"
import { useSimulation } from "../hooks/useSimulation"
import { SimulationChart } from "./simulation-chart"
import { SimulationTable } from "./simulation-table"
import { ChiSquareTest } from "./chi-square-test"

export function SimulationDashboard() {
  const [numClients, setNumClients] = useState(10)
  const [seed, setSeed] = useState(12345)
  const [isStatsOpen, setIsStatsOpen] = useState(false)

  const { asIsData, toBeData, chiSquareResult, isRunning, runSimulation, getStatistics } = useSimulation()

  const handleRunSimulation = () => {
    runSimulation(numClients, seed)
  }

  const asIsStats = asIsData.length > 0 ? getStatistics(asIsData) : null
  const toBeStats = toBeData.length > 0 ? getStatistics(toBeData) : null

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Simulador de Tiempos de Servicio</h1>
          <Badge className="bg-red-100 text-red-700">Solo Administradores</Badge>
        </div>
        <p className="text-gray-600">
          Análisis comparativo de tiempos de espera y servicio mediante simulación pseudoaleatoria
        </p>
      </div>

      {/* Controles de Simulación */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Parámetros de Simulación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-2">Número de Clientes</label>
              <Input
                type="number"
                value={numClients}
                onChange={(e) => setNumClients(Number.parseInt(e.target.value) || 10)}
                min="5"
                max="100"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Semilla (Seed)</label>
              <Input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number.parseInt(e.target.value) || 12345)}
                placeholder="12345"
              />
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
          </div>
        </CardContent>
      </Card>

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

          {/* Gráficos y Tablas */}
          <Tabs defaultValue="charts" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="charts">Histogramas</TabsTrigger>
              <TabsTrigger value="tables">Datos Detallados</TabsTrigger>
              <TabsTrigger value="validation">Validación Estadística</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="tables" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">Datos As-Is</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimulationTable data={asIsData} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">Datos To-Be</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SimulationTable data={toBeData} />
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
                      Estadísticas Detalladas
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
                            <span>Tiempo Máximo:</span>
                            <span className="font-medium">{asIsStats.maxTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo Mínimo:</span>
                            <span className="font-medium">{asIsStats.minTotal.toFixed(2)} min</span>
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
                            <span>Tiempo Máximo:</span>
                            <span className="font-medium">{toBeStats.maxTotal.toFixed(2)} min</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo Mínimo:</span>
                            <span className="font-medium">{toBeStats.minTotal.toFixed(2)} min</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </>
      )}
    </div>
  )
}

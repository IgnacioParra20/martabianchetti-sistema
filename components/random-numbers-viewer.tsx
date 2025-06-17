"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, Filter, Search } from "lucide-react"
import { useState } from "react"
import type { RandomNumberData } from "../hooks/useAdvancedSimulation"

interface RandomNumbersViewerProps {
  randomNumbers: RandomNumberData[]
  seed: number
  onExport: (format: "csv" | "json") => void
}

export function RandomNumbersViewer({ randomNumbers, seed, onExport }: RandomNumbersViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUsage, setFilterUsage] = useState<"all" | "arrival" | "service" | "event">("all")

  if (randomNumbers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay números pseudoaleatorios generados</p>
            <p className="text-sm">Ejecuta una simulación para ver los datos</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredNumbers = randomNumbers.filter((num) => {
    const matchesSearch = searchTerm === "" || num.index.toString().includes(searchTerm)
    const matchesFilter = filterUsage === "all" || num.usage === filterUsage
    return matchesSearch && matchesFilter
  })

  const arrivalNumbers = randomNumbers.filter((n) => n.usage === "arrival")
  const serviceNumbers = randomNumbers.filter((n) => n.usage === "service")
  const eventNumbers = randomNumbers.filter((n) => n.usage === "event")

  const getUsageColor = (usage: string) => {
    switch (usage) {
      case "arrival":
        return "bg-blue-100 text-blue-700"
      case "service":
        return "bg-green-100 text-green-700"
      case "event":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getUsageLabel = (usage: string) => {
    switch (usage) {
      case "arrival":
        return "Llegadas"
      case "service":
        return "Servicio"
      case "event":
        return "Eventos"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="space-y-6">
      {/* Información del Generador */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Generador Congruencial Mixto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded p-3">
              <div className="text-sm text-gray-600">Semilla Inicial</div>
              <div className="text-lg font-bold text-blue-600">{seed.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 rounded p-3">
              <div className="text-sm text-gray-600">Números Generados</div>
              <div className="text-lg font-bold text-green-600">{randomNumbers.length}</div>
            </div>
            <div className="bg-orange-50 rounded p-3">
              <div className="text-sm text-gray-600">Para Eventos</div>
              <div className="text-lg font-bold text-orange-600">{eventNumbers.length}</div>
            </div>
            <div className="bg-purple-50 rounded p-3">
              <div className="text-sm text-gray-600">Rango Normalizado</div>
              <div className="text-lg font-bold text-purple-600">[0, 1)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles y Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Números Pseudoaleatorios Generados</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onExport("csv")}>
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => onExport("json")}>
                <Download className="w-4 h-4 mr-2" />
                JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por índice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterUsage === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterUsage("all")}
              >
                <Filter className="w-4 h-4 mr-2" />
                Todos ({randomNumbers.length})
              </Button>
              <Button
                variant={filterUsage === "arrival" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterUsage("arrival")}
              >
                Llegadas ({arrivalNumbers.length})
              </Button>
              <Button
                variant={filterUsage === "service" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterUsage("service")}
              >
                Servicio ({serviceNumbers.length})
              </Button>
              <Button
                variant={filterUsage === "event" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterUsage("event")}
              >
                Eventos ({eventNumbers.length})
              </Button>
            </div>
          </div>

          <Tabs defaultValue="table" className="space-y-4">
            <TabsList>
              <TabsTrigger value="table">Vista de Tabla</TabsTrigger>
              <TabsTrigger value="distribution">Distribución por Uso</TabsTrigger>
            </TabsList>

            <TabsContent value="table">
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Índice</TableHead>
                      <TableHead>Valor Generado</TableHead>
                      <TableHead>Valor Normalizado</TableHead>
                      <TableHead>Uso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNumbers.slice(0, 50).map((num) => (
                      <TableRow key={num.index}>
                        <TableCell className="font-medium">#{num.index}</TableCell>
                        <TableCell className="font-mono text-sm">{num.value.toLocaleString()}</TableCell>
                        <TableCell className="font-mono text-sm">{num.normalized.toFixed(6)}</TableCell>
                        <TableCell>
                          <Badge className={getUsageColor(num.usage)}>{getUsageLabel(num.usage)}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredNumbers.length > 50 && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Mostrando primeros 50 de {filteredNumbers.length} números filtrados
                </p>
              )}
            </TabsContent>

            <TabsContent value="distribution">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600 text-lg">Números para Llegadas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Cantidad:</span>
                        <span className="font-bold">{arrivalNumbers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Promedio:</span>
                        <span className="font-bold">
                          {arrivalNumbers.length > 0
                            ? (
                                arrivalNumbers.reduce((sum, n) => sum + n.normalized, 0) / arrivalNumbers.length
                              ).toFixed(4)
                            : "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rango:</span>
                        <span className="font-bold">
                          {arrivalNumbers.length > 0
                            ? `${Math.min(...arrivalNumbers.map((n) => n.normalized)).toFixed(3)} - ${Math.max(...arrivalNumbers.map((n) => n.normalized)).toFixed(3)}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 text-lg">Números para Servicio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Cantidad:</span>
                        <span className="font-bold">{serviceNumbers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Promedio:</span>
                        <span className="font-bold">
                          {serviceNumbers.length > 0
                            ? (
                                serviceNumbers.reduce((sum, n) => sum + n.normalized, 0) / serviceNumbers.length
                              ).toFixed(4)
                            : "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rango:</span>
                        <span className="font-bold">
                          {serviceNumbers.length > 0
                            ? `${Math.min(...serviceNumbers.map((n) => n.normalized)).toFixed(3)} - ${Math.max(...serviceNumbers.map((n) => n.normalized)).toFixed(3)}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-orange-600 text-lg">Números para Eventos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Cantidad:</span>
                        <span className="font-bold">{eventNumbers.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Promedio:</span>
                        <span className="font-bold">
                          {eventNumbers.length > 0
                            ? (eventNumbers.reduce((sum, n) => sum + n.normalized, 0) / eventNumbers.length).toFixed(4)
                            : "0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rango:</span>
                        <span className="font-bold">
                          {eventNumbers.length > 0
                            ? `${Math.min(...eventNumbers.map((n) => n.normalized)).toFixed(3)} - ${Math.max(...eventNumbers.map((n) => n.normalized)).toFixed(3)}`
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

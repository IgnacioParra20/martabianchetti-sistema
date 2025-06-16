"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Download, Search } from "lucide-react"
import { useState } from "react"
import type { RandomNumberData } from "../hooks/useAdvancedSimulation"

interface RandomNumbersViewerProps {
  randomNumbers: RandomNumberData[]
  seed: number
  onExport: (format: "csv" | "json") => void
}

export function RandomNumbersViewer({ randomNumbers, seed, onExport }: RandomNumbersViewerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterUsage, setFilterUsage] = useState<"all" | "arrival" | "service">("all")

  if (randomNumbers.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Ejecuta una simulación para ver los números pseudoaleatorios generados</p>
        </CardContent>
      </Card>
    )
  }

  const filteredNumbers = randomNumbers.filter((num) => {
    const matchesSearch =
      searchTerm === "" ||
      num.index.toString().includes(searchTerm) ||
      num.value.toString().includes(searchTerm) ||
      num.normalized.toString().includes(searchTerm)

    const matchesUsage = filterUsage === "all" || num.usage === filterUsage

    return matchesSearch && matchesUsage
  })

  const exportRandomNumbers = (format: "csv" | "json") => {
    const exportData = {
      metadata: {
        seed,
        count: randomNumbers.length,
        method: "Linear Congruential Generator",
        parameters: {
          a: 1664525,
          c: 1013904223,
          m: Math.pow(2, 32),
        },
      },
      numbers: randomNumbers,
    }

    if (format === "json") {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `random-numbers-${seed}-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const csvData = [
        ["Index", "Raw Value", "Normalized", "Usage"],
        ...randomNumbers.map((num) => [num.index, num.value, num.normalized.toFixed(6), num.usage]),
      ]

      const csvContent = csvData.map((row) => row.join(",")).join("\n")
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `random-numbers-${seed}-${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Números Pseudoaleatorios Generados
            <Badge variant="outline">{randomNumbers.length} números</Badge>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportRandomNumbers("csv")}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportRandomNumbers("json")}>
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información del Generador */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Parámetros del Generador Congruencial Mixto</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Semilla (X₀):</span>
              <div className="font-mono font-bold">{seed}</div>
            </div>
            <div>
              <span className="text-gray-600">Multiplicador (a):</span>
              <div className="font-mono font-bold">1,664,525</div>
            </div>
            <div>
              <span className="text-gray-600">Incremento (c):</span>
              <div className="font-mono font-bold">1,013,904,223</div>
            </div>
            <div>
              <span className="text-gray-600">Módulo (m):</span>
              <div className="font-mono font-bold">2³²</div>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600">Fórmula: X(n+1) = (a × X(n) + c) mod m</div>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por índice o valor..."
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
              Todos
            </Button>
            <Button
              variant={filterUsage === "arrival" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterUsage("arrival")}
            >
              Llegadas
            </Button>
            <Button
              variant={filterUsage === "service" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterUsage("service")}
            >
              Servicios
            </Button>
          </div>
        </div>

        {/* Tabla de Números */}
        <div className="max-h-96 overflow-y-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Índice</TableHead>
                <TableHead>Valor Crudo</TableHead>
                <TableHead>Normalizado [0,1]</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead>Hexadecimal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNumbers.map((num) => (
                <TableRow key={num.index}>
                  <TableCell className="font-medium">#{num.index}</TableCell>
                  <TableCell className="font-mono text-sm">{num.value.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-sm">{num.normalized.toFixed(6)}</TableCell>
                  <TableCell>
                    <Badge
                      className={num.usage === "arrival" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
                    >
                      {num.usage === "arrival" ? "Llegada" : "Servicio"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    0x{num.value.toString(16).toUpperCase().padStart(8, "0")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Estadísticas de los números */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600">Total Generados</div>
            <div className="text-lg font-bold">{randomNumbers.length}</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600">Para Llegadas</div>
            <div className="text-lg font-bold text-blue-600">
              {randomNumbers.filter((n) => n.usage === "arrival").length}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600">Para Servicios</div>
            <div className="text-lg font-bold text-green-600">
              {randomNumbers.filter((n) => n.usage === "service").length}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-600">Promedio Normalizado</div>
            <div className="text-lg font-bold text-gray-700">
              {(randomNumbers.reduce((sum, n) => sum + n.normalized, 0) / randomNumbers.length).toFixed(3)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

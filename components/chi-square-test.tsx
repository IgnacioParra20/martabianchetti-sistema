"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, BarChart3 } from "lucide-react"
import type { ChiSquareResult } from "../hooks/useSimulation"

interface ChiSquareTestProps {
  result: ChiSquareResult | null
}

export function ChiSquareTest({ result }: ChiSquareTestProps) {
  if (!result) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Ejecuta una simulación para ver los resultados de la validación estadística</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Prueba de Chi-Cuadrado para Uniformidad
        </CardTitle>
        <p className="text-sm text-gray-600">
          Validación estadística de la distribución de números pseudoaleatorios generados
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resultado Principal */}
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              {result.isUniform ? (
                <CheckCircle className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
              <Badge className={result.isUniform ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                {result.isUniform ? "DISTRIBUCIÓN UNIFORME" : "NO UNIFORME"}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {result.isUniform
                ? "Los números generados siguen una distribución uniforme"
                : "Los números generados NO siguen una distribución uniforme"}
            </p>
          </div>
        </div>

        {/* Detalles Estadísticos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Valores Calculados</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Chi-Cuadrado Calculado:</span>
                <span className="font-bold">{result.chiSquareValue.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Grados de Libertad:</span>
                <span className="font-bold">{result.degreesOfFreedom}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Valor Crítico (α=0.05):</span>
                <span className="font-bold">{result.criticalValue}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">P-Value (aprox.):</span>
                <span className="font-bold">{result.pValue.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Interpretación</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <strong>Hipótesis Nula (H₀):</strong> Los números siguen una distribución uniforme
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <strong>Hipótesis Alternativa (H₁):</strong> Los números NO siguen una distribución uniforme
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <strong>Criterio de Decisión:</strong> Si χ² {"<"} {result.criticalValue}, aceptamos H₀
              </div>
              <div
                className={`p-3 rounded border ${
                  result.isUniform
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                <strong>Conclusión:</strong>{" "}
                {result.isUniform
                  ? `χ² = ${result.chiSquareValue.toFixed(4)} < ${result.criticalValue}, por lo tanto ACEPTAMOS H₀`
                  : `χ² = ${result.chiSquareValue.toFixed(4)} ≥ ${result.criticalValue}, por lo tanto RECHAZAMOS H₀`}
              </div>
            </div>
          </div>
        </div>

        {/* Información Técnica */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-2">Información Técnica</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Método utilizado: Generador Congruencial Mixto</p>
            <p>• Parámetros: a = 1664525, c = 1013904223, m = 2³²</p>
            <p>• Número de bins para la prueba: 10</p>
            <p>• Nivel de significancia: α = 0.05</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Calculator, CheckCircle, Info } from "lucide-react"

export function CongruentialMethodInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Método Congruencial Mixto - Información Técnica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fórmula Principal */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Fórmula Matemática
          </h3>
          <div className="text-center">
            <div className="text-lg font-mono bg-white rounded p-3 border">
              X<sub>n+1</sub> = (a × X<sub>n</sub> + c) mod m
            </div>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Donde X<sub>n</sub> es el número actual, X<sub>n+1</sub> es el siguiente número en la secuencia
          </p>
        </div>

        {/* Parámetros Utilizados */}
        <div>
          <h3 className="font-semibold mb-3">Parámetros Implementados en la Simulación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Multiplicador (a):</span>
                <Badge className="bg-blue-100 text-blue-700 font-mono">1,664,525</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Incremento (c):</span>
                <Badge className="bg-green-100 text-green-700 font-mono">1,013,904,223</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Módulo (m):</span>
                <Badge className="bg-purple-100 text-purple-700 font-mono">2³² = 4,294,967,296</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium">Período Máximo:</span>
                <Badge className="bg-orange-100 text-orange-700">2³² números</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Proceso de Generación */}
        <div>
          <h3 className="font-semibold mb-3">Proceso de Generación para la Cafetería</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Generación de números enteros</p>
                <p className="text-sm text-gray-600">
                  Se aplica la fórmula congruencial para obtener números enteros grandes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Normalización a [0,1)</p>
                <p className="text-sm text-gray-600">
                  Se divide cada número por el módulo (m) para obtener valores entre 0 y 1
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Asignación por uso</p>
                <p className="text-sm text-gray-600">
                  Los números se distribuyen para: tiempos de llegada, tiempos de servicio y eventos inesperados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ventajas y Limitaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Ventajas del Método
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span>Rápido y eficiente computacionalmente</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span>Reproducible con la misma semilla</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span>Período largo con parámetros adecuados</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                <span>Distribución uniforme en [0,1)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Consideraciones
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                <span>No es criptográficamente seguro</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                <span>Puede mostrar patrones con parámetros inadecuados</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                <span>Requiere validación estadística</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                <span>Sensible a la elección de la semilla inicial</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Aplicación en la Simulación */}
        <div className="bg-amber-50 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">Aplicación en la Cafetería "Martha de Bianchetti"</h3>
          <p className="text-sm text-amber-700">
            Este generador se utiliza para crear tres tipos de eventos aleatorios en la simulación:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-amber-700">
            <li>
              • <strong>Tiempos de llegada:</strong> Simulan cuándo llega cada cliente (distribución exponencial)
            </li>
            <li>
              • <strong>Tiempos de servicio:</strong> Determinan cuánto tarda cada cliente en ser atendido
            </li>
            <li>
              • <strong>Eventos inesperados:</strong> Controlan la ocurrencia de interrupciones (solo en As-Is)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

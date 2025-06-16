"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Info, TrendingUp } from "lucide-react"

export function CongruentialMethodInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          Método Congruencial Mixto
          <Badge className="bg-blue-100 text-blue-700">Información Técnica</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fórmula Principal */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Fórmula Matemática</h3>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-blue-900 mb-2">X(n+1) = (a × X(n) + c) mod m</div>
            <div className="text-sm text-blue-700">Donde X(0) es la semilla inicial</div>
          </div>
        </div>

        {/* Parámetros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Parámetros Utilizados
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded p-3">
                <div className="font-medium">Multiplicador (a)</div>
                <div className="font-mono text-lg">1,664,525</div>
                <div className="text-xs text-gray-600">Valor estándar para LCG</div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="font-medium">Incremento (c)</div>
                <div className="font-mono text-lg">1,013,904,223</div>
                <div className="text-xs text-gray-600">Garantiza período completo</div>
              </div>
              <div className="bg-gray-50 rounded p-3">
                <div className="font-medium">Módulo (m)</div>
                <div className="font-mono text-lg">2³² = 4,294,967,296</div>
                <div className="text-xs text-gray-600">Período máximo del generador</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Características
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 rounded p-3 border border-green-200">
                <div className="font-medium text-green-800">✓ Período Completo</div>
                <div className="text-sm text-green-700">Genera 2³² números únicos antes de repetir</div>
              </div>
              <div className="bg-green-50 rounded p-3 border border-green-200">
                <div className="font-medium text-green-800">✓ Distribución Uniforme</div>
                <div className="text-sm text-green-700">Los números se distribuyen uniformemente en [0,1]</div>
              </div>
              <div className="bg-green-50 rounded p-3 border border-green-200">
                <div className="font-medium text-green-800">✓ Reproducible</div>
                <div className="text-sm text-green-700">Misma semilla produce misma secuencia</div>
              </div>
              <div className="bg-yellow-50 rounded p-3 border border-yellow-200">
                <div className="font-medium text-yellow-800">⚠ Correlación Serial</div>
                <div className="text-sm text-yellow-700">Números consecutivos pueden estar correlacionados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Proceso de Generación */}
        <div>
          <h3 className="font-semibold mb-3">Proceso de Generación</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded p-3 text-center">
              <div className="font-bold text-blue-600 text-lg">1</div>
              <div className="text-sm font-medium">Inicializar</div>
              <div className="text-xs text-gray-600">X₀ = semilla</div>
            </div>
            <div className="bg-gray-50 rounded p-3 text-center">
              <div className="font-bold text-blue-600 text-lg">2</div>
              <div className="text-sm font-medium">Calcular</div>
              <div className="text-xs text-gray-600">X₁ = (a×X₀+c) mod m</div>
            </div>
            <div className="bg-gray-50 rounded p-3 text-center">
              <div className="font-bold text-blue-600 text-lg">3</div>
              <div className="text-sm font-medium">Normalizar</div>
              <div className="text-xs text-gray-600">U₁ = X₁ / m</div>
            </div>
            <div className="bg-gray-50 rounded p-3 text-center">
              <div className="font-bold text-blue-600 text-lg">4</div>
              <div className="text-sm font-medium">Repetir</div>
              <div className="text-xs text-gray-600">Para n números</div>
            </div>
          </div>
        </div>

        {/* Aplicaciones en la Simulación */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-semibold text-purple-800 mb-2">Aplicación en la Simulación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-purple-700">Tiempos de Llegada</div>
              <div className="text-purple-600">
                Se usan los primeros n números para generar tiempos entre llegadas usando distribución exponencial
              </div>
            </div>
            <div>
              <div className="font-medium text-purple-700">Tiempos de Servicio</div>
              <div className="text-purple-600">
                Los siguientes n números generan tiempos de servicio con distribución uniforme
              </div>
            </div>
          </div>
        </div>

        {/* Ventajas y Limitaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-700 mb-2">Ventajas</h4>
            <ul className="text-sm space-y-1 text-green-600">
              <li>• Muy rápido computacionalmente</li>
              <li>• Fácil de implementar</li>
              <li>• Reproducible con misma semilla</li>
              <li>• Período muy largo (2³²)</li>
              <li>• Pasa pruebas básicas de uniformidad</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-red-700 mb-2">Limitaciones</h4>
            <ul className="text-sm space-y-1 text-red-600">
              <li>• No es criptográficamente seguro</li>
              <li>• Puede tener correlación serial</li>
              <li>• Estructura en dimensiones altas</li>
              <li>• Sensible a la elección de parámetros</li>
              <li>• No adecuado para aplicaciones críticas</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

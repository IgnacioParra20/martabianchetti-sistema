"use client"

import { useMemo } from "react"
import type { SimulationData } from "../hooks/useSimulation"

interface SimulationChartProps {
  data: SimulationData[]
  title: string
  color: string
}

export function SimulationChart({ data, title, color }: SimulationChartProps) {
  const { histogram, average, maxFreq, chartData } = useMemo(() => {
    if (data.length === 0) return { histogram: [], average: 0, maxFreq: 0, chartData: null }

    // Crear histograma
    const totalTimes = data.map((d) => d.totalTime)
    const minTime = Math.min(...totalTimes)
    const maxTime = Math.max(...totalTimes)
    const numBins = 8
    const binSize = (maxTime - minTime) / numBins

    const bins = Array.from({ length: numBins }, (_, i) => ({
      range: `${(minTime + i * binSize).toFixed(1)}-${(minTime + (i + 1) * binSize).toFixed(1)}`,
      label: `${(minTime + i * binSize).toFixed(1)}`,
      count: 0,
      minValue: minTime + i * binSize,
      maxValue: minTime + (i + 1) * binSize,
    }))

    totalTimes.forEach((time) => {
      const binIndex = Math.min(Math.floor((time - minTime) / binSize), numBins - 1)
      bins[binIndex].count++
    })

    const average = totalTimes.reduce((sum, time) => sum + time, 0) / totalTimes.length
    const maxFreq = Math.max(...bins.map((bin) => bin.count))

    // Datos para el gráfico SVG
    const chartWidth = 600
    const chartHeight = 300
    const margin = { top: 20, right: 20, bottom: 60, left: 50 }
    const plotWidth = chartWidth - margin.left - margin.right
    const plotHeight = chartHeight - margin.top - margin.bottom

    const chartData = {
      width: chartWidth,
      height: chartHeight,
      margin,
      plotWidth,
      plotHeight,
      bins,
      maxFreq,
      average,
      barWidth: (plotWidth / numBins) * 0.8,
      barSpacing: (plotWidth / numBins) * 0.2,
    }

    return { histogram: bins, average, maxFreq, chartData }
  }, [data])

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <p>No hay datos para mostrar</p>
      </div>
    )
  }

  const { width, height, margin, plotWidth, plotHeight, bins, barWidth, barSpacing } = chartData!

  // Calcular posición Y para la línea de promedio
  const averageY = margin.top + plotHeight - (average / maxFreq) * plotHeight * 0.8

  return (
    <div className="space-y-4">
      {/* Gráfico de barras SVG */}
      <div className="bg-white rounded-lg border p-4">
        <svg width={width} height={height} className="overflow-visible">
          {/* Grid horizontal */}
          {[0, 1, 2, 3, 4, 5].map((tick) => {
            const y = margin.top + plotHeight - (tick / 5) * plotHeight
            const value = (tick / 5) * maxFreq
            return (
              <g key={tick}>
                <line x1={margin.left} y1={y} x2={margin.left + plotWidth} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                <text x={margin.left - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
                  {Math.round(value)}
                </text>
              </g>
            )
          })}

          {/* Barras */}
          {bins.map((bin, index) => {
            const x = margin.left + (index * plotWidth) / bins.length + barSpacing / 2
            const barHeight = (bin.count / maxFreq) * plotHeight
            const y = margin.top + plotHeight - barHeight

            return (
              <g key={index}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  stroke="white"
                  strokeWidth="1"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>{`${bin.range} min: ${bin.count} clientes`}</title>
                </rect>

                {/* Etiqueta de frecuencia encima de la barra */}
                {bin.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#374151"
                    fontWeight="500"
                  >
                    {bin.count}
                  </text>
                )}
              </g>
            )
          })}

          {/* Línea de promedio discontinua */}
          <line
            x1={margin.left}
            y1={averageY}
            x2={margin.left + plotWidth}
            y2={averageY}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />

          {/* Etiqueta del promedio */}
          <text
            x={margin.left + plotWidth - 5}
            y={averageY - 8}
            textAnchor="end"
            fontSize="12"
            fill="#ef4444"
            fontWeight="600"
          >
            Promedio: {average.toFixed(1)} min
          </text>

          {/* Eje X */}
          <line
            x1={margin.left}
            y1={margin.top + plotHeight}
            x2={margin.left + plotWidth}
            y2={margin.top + plotHeight}
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Eje Y */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={margin.left}
            y2={margin.top + plotHeight}
            stroke="#374151"
            strokeWidth="2"
          />

          {/* Etiquetas del eje X */}
          {bins.map((bin, index) => {
            const x = margin.left + (index * plotWidth) / bins.length + plotWidth / bins.length / 2
            return (
              <text
                key={index}
                x={x}
                y={margin.top + plotHeight + 20}
                textAnchor="middle"
                fontSize="10"
                fill="#6b7280"
                transform={`rotate(-45, ${x}, ${margin.top + plotHeight + 20})`}
              >
                {bin.range}
              </text>
            )
          })}

          {/* Título del eje X */}
          <text
            x={margin.left + plotWidth / 2}
            y={height - 10}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="500"
          >
            Tiempo Total (minutos)
          </text>

          {/* Título del eje Y */}
          <text
            x={15}
            y={margin.top + plotHeight / 2}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="500"
            transform={`rotate(-90, 15, ${margin.top + plotHeight / 2})`}
          >
            Frecuencia (clientes)
          </text>
        </svg>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 rounded p-3">
          <div className="font-medium text-gray-700">Tiempo Total Promedio</div>
          <div className="text-lg font-bold" style={{ color }}>
            {average.toFixed(1)} min
          </div>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <div className="font-medium text-gray-700">Tiempo de Espera Promedio</div>
          <div className="text-lg font-bold" style={{ color }}>
            {(data.reduce((sum, d) => sum + d.waitTime, 0) / data.length).toFixed(1)} min
          </div>
        </div>
      </div>
    </div>
  )
}

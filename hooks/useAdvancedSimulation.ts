"use client"

import { useCallback, useState } from "react"

export interface SimulationData {
  id: number
  arrivalTime: number
  serviceStartTime: number
  serviceEndTime: number
  serviceTime: number
  totalTime: number
  waitTime: number
}

export interface RandomNumberData {
  index: number
  value: number
  normalized: number
  usage: "arrival" | "service"
}

export interface ChiSquareResult {
  chiSquareValue: number
  degreesOfFreedom: number
  criticalValue: number
  isUniform: boolean
  pValue: number
}

export interface AdvancedStatistics {
  averageTotal: number
  averageWait: number
  averageService: number
  maxTotal: number
  minTotal: number
  stdDeviation: number
  variance: number
}

export function useAdvancedSimulation() {
  const [asIsData, setAsIsData] = useState<SimulationData[]>([])
  const [toBeData, setToBeData] = useState<SimulationData[]>([])
  const [randomNumbers, setRandomNumbers] = useState<RandomNumberData[]>([])
  const [chiSquareResult, setChiSquareResult] = useState<ChiSquareResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  // Generador congruencial mixto mejorado
  const linearCongruentialGenerator = useCallback((seed: number, count: number) => {
    const a = 1664525 // Multiplicador
    const c = 1013904223 // Incremento
    const m = Math.pow(2, 32) // Módulo

    const numbers: RandomNumberData[] = []
    let current = seed

    for (let i = 0; i < count; i++) {
      current = (a * current + c) % m
      const normalized = current / m
      numbers.push({
        index: i + 1,
        value: current,
        normalized,
        usage: i < count / 2 ? "arrival" : "service",
      })
    }

    return numbers
  }, [])

  // Generar tiempos de llegada (distribución exponencial simulada)
  const generateArrivalTimes = useCallback((randomNumbers: number[]) => {
    const lambda = 0.15 // Tasa de llegada (clientes por minuto)
    return randomNumbers.map((r) => -Math.log(1 - r) / lambda)
  }, [])

  // Generar tiempos de servicio (distribución uniforme)
  const generateServiceTimes = useCallback((randomNumbers: number[], scenario: "as-is" | "to-be") => {
    const minService = scenario === "as-is" ? 4 : 2.5 // Mejora en To-Be
    const maxService = scenario === "as-is" ? 15 : 9 // Mejora en To-Be
    return randomNumbers.map((r) => minService + r * (maxService - minService))
  }, [])

  // Simular el sistema con más detalles
  const simulateSystem = useCallback((arrivalTimes: number[], serviceTimes: number[]): SimulationData[] => {
    const data: SimulationData[] = []
    let currentTime = 0

    for (let i = 0; i < arrivalTimes.length; i++) {
      const arrivalTime = i === 0 ? arrivalTimes[i] : data[i - 1].arrivalTime + arrivalTimes[i]
      const serviceStartTime = Math.max(arrivalTime, currentTime)
      const serviceTime = serviceTimes[i]
      const serviceEndTime = serviceStartTime + serviceTime
      const totalTime = serviceEndTime - arrivalTime
      const waitTime = serviceStartTime - arrivalTime

      data.push({
        id: i + 1,
        arrivalTime,
        serviceStartTime,
        serviceEndTime,
        serviceTime,
        totalTime,
        waitTime,
      })

      currentTime = serviceEndTime
    }

    return data
  }, [])

  // Prueba de chi-cuadrado mejorada
  const chiSquareTest = useCallback((data: number[]): ChiSquareResult => {
    const numBins = 10
    const binSize = 1 / numBins
    const expectedFreq = data.length / numBins
    const observed = new Array(numBins).fill(0)

    // Contar frecuencias observadas
    data.forEach((value) => {
      const binIndex = Math.min(Math.floor(value / binSize), numBins - 1)
      observed[binIndex]++
    })

    // Calcular chi-cuadrado
    let chiSquareValue = 0
    for (let i = 0; i < numBins; i++) {
      const diff = observed[i] - expectedFreq
      chiSquareValue += (diff * diff) / expectedFreq
    }

    const degreesOfFreedom = numBins - 1
    const criticalValue = 16.919 // Para α = 0.05 y df = 9
    const isUniform = chiSquareValue < criticalValue

    // Aproximación del p-value mejorada
    const pValue =
      chiSquareValue > criticalValue
        ? Math.max(0.001, 0.05 * Math.exp(-(chiSquareValue - criticalValue) / 5))
        : Math.min(0.999, 0.05 + 0.3 * Math.exp(-(criticalValue - chiSquareValue) / 3))

    return {
      chiSquareValue,
      degreesOfFreedom,
      criticalValue,
      isUniform,
      pValue,
    }
  }, [])

  // Calcular estadísticas avanzadas
  const getStatistics = useCallback((data: SimulationData[]): AdvancedStatistics => {
    const totalTimes = data.map((d) => d.totalTime)
    const waitTimes = data.map((d) => d.waitTime)
    const serviceTimes = data.map((d) => d.serviceTime)

    const averageTotal = totalTimes.reduce((sum, time) => sum + time, 0) / totalTimes.length
    const averageWait = waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length
    const averageService = serviceTimes.reduce((sum, time) => sum + time, 0) / serviceTimes.length

    // Calcular varianza y desviación estándar
    const variance = totalTimes.reduce((sum, time) => sum + Math.pow(time - averageTotal, 2), 0) / totalTimes.length
    const stdDeviation = Math.sqrt(variance)

    return {
      averageTotal,
      averageWait,
      averageService,
      maxTotal: Math.max(...totalTimes),
      minTotal: Math.min(...totalTimes),
      stdDeviation,
      variance,
    }
  }, [])

  // Función de exportación
  const exportData = useCallback(
    (format: "csv" | "json") => {
      if (asIsData.length === 0) return

      const exportObject = {
        metadata: {
          timestamp: new Date().toISOString(),
          numClients: asIsData.length,
          method: "Congruential Mixed Generator",
          parameters: {
            a: 1664525,
            c: 1013904223,
            m: Math.pow(2, 32),
          },
        },
        randomNumbers,
        asIsData,
        toBeData,
        statistics: {
          asIs: getStatistics(asIsData),
          toBe: getStatistics(toBeData),
        },
        chiSquareTest: chiSquareResult,
      }

      if (format === "json") {
        const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `simulation-data-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // CSV export
        const csvData = [
          ["ID", "Scenario", "Arrival Time", "Service Start", "Service End", "Service Time", "Wait Time", "Total Time"],
          ...asIsData.map((d) => [
            d.id,
            "As-Is",
            d.arrivalTime.toFixed(2),
            d.serviceStartTime.toFixed(2),
            d.serviceEndTime.toFixed(2),
            d.serviceTime.toFixed(2),
            d.waitTime.toFixed(2),
            d.totalTime.toFixed(2),
          ]),
          ...toBeData.map((d) => [
            d.id,
            "To-Be",
            d.arrivalTime.toFixed(2),
            d.serviceStartTime.toFixed(2),
            d.serviceEndTime.toFixed(2),
            d.serviceTime.toFixed(2),
            d.waitTime.toFixed(2),
            d.totalTime.toFixed(2),
          ]),
        ]

        const csvContent = csvData.map((row) => row.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `simulation-data-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    },
    [asIsData, toBeData, randomNumbers, chiSquareResult, getStatistics],
  )

  // Ejecutar simulación completa
  const runSimulation = useCallback(
    async (numClients: number, seed: number) => {
      setIsRunning(true)

      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 1500))

      try {
        // Generar números pseudoaleatorios
        const randomNumbersData = linearCongruentialGenerator(seed, numClients * 2)
        const arrivalRandoms = randomNumbersData.slice(0, numClients).map((r) => r.normalized)
        const serviceRandoms = randomNumbersData.slice(numClients).map((r) => r.normalized)

        // Generar tiempos
        const arrivalTimes = generateArrivalTimes(arrivalRandoms)
        const asIsServiceTimes = generateServiceTimes(serviceRandoms, "as-is")
        const toBeServiceTimes = generateServiceTimes(serviceRandoms, "to-be")

        // Simular ambos escenarios
        const asIsResults = simulateSystem(arrivalTimes, asIsServiceTimes)
        const toBeResults = simulateSystem(arrivalTimes, toBeServiceTimes)

        // Prueba de chi-cuadrado
        const chiResult = chiSquareTest(arrivalRandoms)

        setRandomNumbers(randomNumbersData)
        setAsIsData(asIsResults)
        setToBeData(toBeResults)
        setChiSquareResult(chiResult)
      } catch (error) {
        console.error("Error en la simulación:", error)
      } finally {
        setIsRunning(false)
      }
    },
    [linearCongruentialGenerator, generateArrivalTimes, generateServiceTimes, simulateSystem, chiSquareTest],
  )

  return {
    asIsData,
    toBeData,
    randomNumbers,
    chiSquareResult,
    isRunning,
    runSimulation,
    getStatistics,
    exportData,
  }
}

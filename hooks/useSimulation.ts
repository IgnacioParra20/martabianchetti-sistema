"use client"

import { useState, useCallback } from "react"

export interface SimulationData {
  id: number
  arrivalTime: number
  serviceStartTime: number
  serviceEndTime: number
  totalTime: number
  waitTime: number
}

export interface ChiSquareResult {
  chiSquareValue: number
  degreesOfFreedom: number
  criticalValue: number
  isUniform: boolean
  pValue: number
}

export interface Statistics {
  averageTotal: number
  averageWait: number
  maxTotal: number
  minTotal: number
}

export function useSimulation() {
  const [asIsData, setAsIsData] = useState<SimulationData[]>([])
  const [toBeData, setToBeData] = useState<SimulationData[]>([])
  const [chiSquareResult, setChiSquareResult] = useState<ChiSquareResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  // Generador congruencial mixto
  const linearCongruentialGenerator = useCallback((seed: number, count: number) => {
    const a = 1664525 // Multiplicador
    const c = 1013904223 // Incremento
    const m = Math.pow(2, 32) // Módulo

    const numbers: number[] = []
    let current = seed

    for (let i = 0; i < count; i++) {
      current = (a * current + c) % m
      numbers.push(current / m) // Normalizar a [0, 1]
    }

    return numbers
  }, [])

  // Generar tiempos de llegada (distribución exponencial simulada)
  const generateArrivalTimes = useCallback((randomNumbers: number[]) => {
    const lambda = 0.1 // Tasa de llegada (clientes por minuto)
    return randomNumbers.map((r) => -Math.log(1 - r) / lambda)
  }, [])

  // Generar tiempos de servicio (distribución uniforme)
  const generateServiceTimes = useCallback((randomNumbers: number[], scenario: "as-is" | "to-be") => {
    const minService = scenario === "as-is" ? 3 : 2 // Mejora en To-Be
    const maxService = scenario === "as-is" ? 12 : 8 // Mejora en To-Be
    return randomNumbers.map((r) => minService + r * (maxService - minService))
  }, [])

  // Simular el sistema
  const simulateSystem = useCallback((arrivalTimes: number[], serviceTimes: number[]): SimulationData[] => {
    const data: SimulationData[] = []
    let currentTime = 0

    for (let i = 0; i < arrivalTimes.length; i++) {
      const arrivalTime = i === 0 ? arrivalTimes[i] : data[i - 1].arrivalTime + arrivalTimes[i]
      const serviceStartTime = Math.max(arrivalTime, currentTime)
      const serviceEndTime = serviceStartTime + serviceTimes[i]
      const totalTime = serviceEndTime - arrivalTime
      const waitTime = serviceStartTime - arrivalTime

      data.push({
        id: i + 1,
        arrivalTime,
        serviceStartTime,
        serviceEndTime,
        totalTime,
        waitTime,
      })

      currentTime = serviceEndTime
    }

    return data
  }, [])

  // Prueba de chi-cuadrado para uniformidad
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

    // Aproximación del p-value (simplificada)
    const pValue = chiSquareValue > criticalValue ? 0.01 : 0.1

    return {
      chiSquareValue,
      degreesOfFreedom,
      criticalValue,
      isUniform,
      pValue,
    }
  }, [])

  // Calcular estadísticas
  const getStatistics = useCallback((data: SimulationData[]): Statistics => {
    const totalTimes = data.map((d) => d.totalTime)
    const waitTimes = data.map((d) => d.waitTime)

    return {
      averageTotal: totalTimes.reduce((sum, time) => sum + time, 0) / totalTimes.length,
      averageWait: waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length,
      maxTotal: Math.max(...totalTimes),
      minTotal: Math.min(...totalTimes),
    }
  }, [])

  // Ejecutar simulación completa
  const runSimulation = useCallback(
    async (numClients: number, seed: number) => {
      setIsRunning(true)

      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 1000))

      try {
        // Generar números pseudoaleatorios
        const randomNumbers = linearCongruentialGenerator(seed, numClients * 2)
        const arrivalRandoms = randomNumbers.slice(0, numClients)
        const serviceRandoms = randomNumbers.slice(numClients)

        // Generar tiempos
        const arrivalTimes = generateArrivalTimes(arrivalRandoms)
        const asIsServiceTimes = generateServiceTimes(serviceRandoms, "as-is")
        const toBeServiceTimes = generateServiceTimes(serviceRandoms, "to-be")

        // Simular ambos escenarios
        const asIsResults = simulateSystem(arrivalTimes, asIsServiceTimes)
        const toBeResults = simulateSystem(arrivalTimes, toBeServiceTimes)

        // Prueba de chi-cuadrado
        const chiResult = chiSquareTest(arrivalRandoms)

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
    chiSquareResult,
    isRunning,
    runSimulation,
    getStatistics,
  }
}

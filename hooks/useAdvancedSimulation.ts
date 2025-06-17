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
  affectedByEvent?: string
  eventDelay?: number
}

export interface UnexpectedEvent {
  id: string
  type: "supplier_interruption" | "waiter_consultation"
  name: string
  description: string
  occurredAt: number
  duration: number
  affectedClients: number[]
  totalImpact: number
}

export interface RandomNumberData {
  index: number
  value: number
  normalized: number
  usage: "arrival" | "service" | "event"
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
  eventsImpact?: number
  clientsAffected?: number
}

export function useAdvancedSimulation() {
  const [asIsData, setAsIsData] = useState<SimulationData[]>([])
  const [toBeData, setToBeData] = useState<SimulationData[]>([])
  const [randomNumbers, setRandomNumbers] = useState<RandomNumberData[]>([])
  const [unexpectedEvents, setUnexpectedEvents] = useState<UnexpectedEvent[]>([])
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

      let usage: "arrival" | "service" | "event" = "arrival"
      if (i < count / 3) usage = "arrival"
      else if (i < (2 * count) / 3) usage = "service"
      else usage = "event"

      numbers.push({
        index: i + 1,
        value: current,
        normalized,
        usage,
      })
    }

    return numbers
  }, [])

  // Generar eventos inesperados para el escenario As-Is (solo 2 tipos)
  const generateUnexpectedEvents = useCallback((eventRandoms: number[], numClients: number): UnexpectedEvent[] => {
    const events: UnexpectedEvent[] = []
    let eventId = 1

    // 1. Proveedor interrumpe al cajero (probabilidad baja, una vez por simulación)
    if (eventRandoms[0] < 0.3 && numClients >= 3) {
      // 30% de probabilidad si hay al menos 3 clientes
      const occurredAt = 2 + eventRandoms[1] * (numClients - 2) // Ocurre entre cliente 2 y penúltimo
      events.push({
        id: `event_${eventId++}`,
        type: "supplier_interruption",
        name: "Interrupción del Proveedor",
        description: "El proveedor interrumpe al cajero para resolver dudas sobre productos",
        occurredAt,
        duration: 15, // 15 minutos fijos
        affectedClients: [],
        totalImpact: 15,
      })
    }

    // 2. Consultas de producto entre mozo y cajero (probabilidad moderada, múltiples veces)
    let consultationIndex = 2
    while (consultationIndex < eventRandoms.length - 2 && eventRandoms[consultationIndex] < 0.4) {
      // 40% probabilidad por consulta
      const occurredAt = 1 + eventRandoms[consultationIndex + 1] * numClients
      events.push({
        id: `event_${eventId++}`,
        type: "waiter_consultation",
        name: "Consulta Mozo-Cajero",
        description: "El mozo consulta al cajero sobre disponibilidad o precio de productos",
        occurredAt,
        duration: 5, // 5 minutos
        affectedClients: [],
        totalImpact: 5,
      })
      consultationIndex += 3
    }

    // Ordenar eventos por tiempo de ocurrencia
    return events.sort((a, b) => a.occurredAt - b.occurredAt)
  }, [])

  // Generar tiempos de llegada simples
  const generateArrivalTimes = useCallback((randomNumbers: number[]) => {
    // Intervalos entre llegadas de 1-4 minutos
    return randomNumbers.map((r) => 1 + r * 3)
  }, [])

  // Generar tiempos de servicio realistas (5 minutos promedio)
  const generateServiceTimes = useCallback((randomNumbers: number[]) => {
    // Tiempo de servicio del cajero: 4-6 minutos (promedio 5)
    const minService = 4
    const maxService = 6
    return randomNumbers.map((r) => minService + r * (maxService - minService))
  }, [])

  // Simular el sistema base (sin eventos) - TIEMPO TOTAL MÁXIMO 15-25 MIN
  const simulateBaseSystem = useCallback(
    (arrivalTimes: number[], serviceTimes: number[], hasEvents: boolean): SimulationData[] => {
      const data: SimulationData[] = []

      for (let i = 0; i < arrivalTimes.length; i++) {
        // Tiempo de llegada acumulativo
        const arrivalTime = i === 0 ? 0 : data[i - 1].arrivalTime + arrivalTimes[i]

        // Tiempo de servicio (5 minutos promedio)
        const serviceTime = serviceTimes[i]

        // Calcular tiempo de espera para que el TOTAL esté entre 15-25 min
        let baseWaitTime = 0
        if (hasEvents) {
          // Con eventos: tiempo total objetivo 20-25 min para permitir mejora de 5+ min
          const randomFactor = arrivalTimes[i] % 1 || 0.5
          const targetTotal = 20 + randomFactor * 5 // 20-25 minutos total
          baseWaitTime = targetTotal - serviceTime // Espera = Total - Servicio
          baseWaitTime = Math.max(12, Math.min(20, baseWaitTime)) // Limitar entre 12-20 min
        } else {
          // Sin eventos: tiempo total objetivo 15-18 min (más eficiente)
          const randomFactor = arrivalTimes[i] % 1 || 0.5
          const targetTotal = 15 + randomFactor * 3 // 15-18 minutos total
          baseWaitTime = targetTotal - serviceTime // Espera = Total - Servicio
          baseWaitTime = Math.max(8, Math.min(13, baseWaitTime)) // Limitar entre 8-13 min
        }

        const serviceStartTime = arrivalTime + baseWaitTime
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
      }

      return data
    },
    [],
  )

  // Aplicar eventos al sistema base para crear As-Is
  const applyEventsToSystem = useCallback((baseData: SimulationData[], events: UnexpectedEvent[]): SimulationData[] => {
    const asIsData = baseData.map((client) => ({ ...client }))

    events.forEach((event) => {
      // Determinar qué clientes son afectados por este evento
      asIsData.forEach((client, index) => {
        // Si el evento ocurre cerca del cliente actual
        if (Math.abs(event.occurredAt - client.id) <= 1.5) {
          const eventImpact = event.duration * 0.4 // 40% del tiempo del evento afecta este cliente

          // Agregar el impacto del evento PERO mantener el límite de 25 min
          const newTotalTime = client.totalTime + eventImpact

          // Si supera 25 minutos, ajustar el impacto
          const maxAllowedTotal = 25
          const actualImpact =
            newTotalTime > maxAllowedTotal ? Math.max(0, maxAllowedTotal - client.totalTime) : eventImpact

          // Aplicar el impacto ajustado
          client.waitTime += actualImpact
          client.serviceStartTime += actualImpact
          client.serviceEndTime += actualImpact
          client.totalTime += actualImpact

          // Marcar como afectado
          if (!client.affectedByEvent) {
            client.affectedByEvent = event.name
            client.eventDelay = actualImpact
          }

          event.affectedClients.push(client.id)
        }
      })
    })

    return asIsData
  }, [])

  // Crear escenario To-Be con mejora MÍNIMA de 5 minutos
  const createToBe = useCallback((asIsData: SimulationData[]): SimulationData[] => {
    return asIsData.map((client) => {
      // Calcular la mejora base (eventos eliminados)
      const eventImpactReduction = client.eventDelay || 0

      // Mejora adicional del sistema (segmentación de roles, procesos optimizados)
      const systemImprovement = 3 // 3 minutos de mejora por optimización de procesos

      // Mejora total mínima de 5 minutos
      const totalImprovement = Math.max(5, eventImpactReduction + systemImprovement)

      // Aplicar la mejora pero asegurar que no sea negativo
      const newWaitTime = Math.max(2, client.waitTime - totalImprovement)
      const newServiceStartTime = client.arrivalTime + newWaitTime
      const newServiceEndTime = newServiceStartTime + client.serviceTime
      const newTotalTime = newServiceEndTime - client.arrivalTime

      return {
        ...client,
        waitTime: newWaitTime,
        serviceStartTime: newServiceStartTime,
        serviceEndTime: newServiceEndTime,
        totalTime: newTotalTime,
        // Limpiar marcadores de eventos
        affectedByEvent: undefined,
        eventDelay: undefined,
      }
    })
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

  // Calcular estadísticas avanzadas con impacto de eventos
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

    // Calcular impacto de eventos (solo para As-Is)
    const clientsAffected = data.filter((d) => d.affectedByEvent).length
    const eventsImpact = data.reduce((sum, d) => sum + (d.eventDelay || 0), 0)

    return {
      averageTotal,
      averageWait,
      averageService,
      maxTotal: Math.max(...totalTimes),
      minTotal: Math.min(...totalTimes),
      stdDeviation,
      variance,
      eventsImpact,
      clientsAffected,
    }
  }, [])

  // Función de exportación mejorada
  const exportData = useCallback(
    (format: "csv" | "json") => {
      if (asIsData.length === 0) return

      const hasEvents = unexpectedEvents.length > 0
      const exportObject = {
        metadata: {
          timestamp: new Date().toISOString(),
          numClients: asIsData.length,
          method: "Congruential Mixed Generator with Minimum 5-Minute Improvement",
          cafeteria: "Martha de Bianchetti",
          logic: "To-Be = As-Is - Events - System Improvements (Min 5 min reduction)",
          constraint: "Total time never exceeds 25 minutes, To-Be improves by at least 5 minutes",
          eventTypes: ["Supplier Interruption", "Waiter-Cashier Consultation"],
          improvementLogic: hasEvents
            ? "Events detected - To-Be shows minimum 5-minute improvement through event elimination + system optimization"
            : "No events detected - To-Be not generated",
          parameters: {
            a: 1664525,
            c: 1013904223,
            m: Math.pow(2, 32),
            arrivalInterval: "1-4 min",
            serviceTime: "4-6 min (promedio 5 min)",
            totalTimeWithEvents: "20-25 min (máximo)",
            totalTimeWithoutEvents: "15-18 min",
            minimumImprovement: "5 min",
            systemOptimization: "3 min (role segmentation + process optimization)",
          },
        },
        randomNumbers,
        unexpectedEvents,
        asIsData,
        toBeData: hasEvents ? toBeData : null,
        statistics: {
          asIs: getStatistics(asIsData),
          toBe: hasEvents ? getStatistics(toBeData) : null,
        },
        chiSquareTest: chiSquareResult,
      }

      if (format === "json") {
        const blob = new Blob([JSON.stringify(exportObject, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `martha-bianchetti-simulation-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
      } else {
        // CSV export con eventos
        const csvData = [
          [
            "ID",
            "Scenario",
            "Arrival Time",
            "Service Start",
            "Service End",
            "Service Time",
            "Wait Time",
            "Total Time",
            "Affected By Event",
            "Event Delay",
          ],
          ...asIsData.map((d) => [
            d.id,
            "As-Is",
            d.arrivalTime.toFixed(2),
            d.serviceStartTime.toFixed(2),
            d.serviceEndTime.toFixed(2),
            d.serviceTime.toFixed(2),
            d.waitTime.toFixed(2),
            d.totalTime.toFixed(2),
            d.affectedByEvent || "No",
            d.eventDelay?.toFixed(2) || "0",
          ]),
        ]

        if (hasEvents) {
          csvData.push(
            ...toBeData.map((d) => [
              d.id,
              "To-Be",
              d.arrivalTime.toFixed(2),
              d.serviceStartTime.toFixed(2),
              d.serviceEndTime.toFixed(2),
              d.serviceTime.toFixed(2),
              d.waitTime.toFixed(2),
              d.totalTime.toFixed(2),
              "No (Events + System Optimized)",
              "0",
            ]),
          )
        }

        const csvContent = csvData.map((row) => row.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `martha-bianchetti-simulation-${Date.now()}.csv`
        a.click()
        URL.revokeObjectURL(url)
      }
    },
    [asIsData, toBeData, randomNumbers, unexpectedEvents, chiSquareResult, getStatistics],
  )

  // Ejecutar simulación completa con mejora mínima garantizada
  const runSimulation = useCallback(
    async (numClients: number, seed: number) => {
      setIsRunning(true)

      // Simular delay para mostrar loading
      await new Promise((resolve) => setTimeout(resolve, 1500))

      try {
        // Generar números pseudoaleatorios (más números para eventos)
        const randomNumbersData = linearCongruentialGenerator(seed, numClients * 3)
        const arrivalRandoms = randomNumbersData.slice(0, numClients).map((r) => r.normalized)
        const serviceRandoms = randomNumbersData.slice(numClients, numClients * 2).map((r) => r.normalized)
        const eventRandoms = randomNumbersData.slice(numClients * 2).map((r) => r.normalized)

        // Generar eventos inesperados
        const events = generateUnexpectedEvents(eventRandoms, numClients)
        const hasEvents = events.length > 0

        // Generar tiempos base
        const arrivalTimes = generateArrivalTimes(arrivalRandoms)
        const serviceTimes = generateServiceTimes(serviceRandoms)

        // Crear sistema base (sin eventos)
        const baseSystem = simulateBaseSystem(arrivalTimes, serviceTimes, hasEvents)

        let asIsResults: SimulationData[]
        let toBeResults: SimulationData[] = []

        if (hasEvents) {
          // Si hay eventos: As-Is = Base + Eventos, To-Be = Base con mejora mínima de 5 min
          asIsResults = applyEventsToSystem(baseSystem, events)
          toBeResults = createToBe(asIsResults) // To-Be con mejora mínima de 5 minutos
        } else {
          // Si no hay eventos: solo As-Is (que es el sistema base optimizado)
          asIsResults = baseSystem
          // No generar To-Be si no hay eventos
        }

        // Prueba de chi-cuadrado
        const chiResult = chiSquareTest(arrivalRandoms)

        setRandomNumbers(randomNumbersData)
        setUnexpectedEvents(events)
        setAsIsData(asIsResults)
        setToBeData(toBeResults)
        setChiSquareResult(chiResult)
      } catch (error) {
        console.error("Error en la simulación:", error)
      } finally {
        setIsRunning(false)
      }
    },
    [
      linearCongruentialGenerator,
      generateArrivalTimes,
      generateServiceTimes,
      generateUnexpectedEvents,
      simulateBaseSystem,
      applyEventsToSystem,
      createToBe,
      chiSquareTest,
    ],
  )

  return {
    asIsData,
    toBeData,
    randomNumbers,
    unexpectedEvents,
    chiSquareResult,
    isRunning,
    runSimulation,
    getStatistics,
    exportData,
  }
}

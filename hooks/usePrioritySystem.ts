"use client"

import { useState, useCallback } from "react"
import type { OrderWithPriority, PriorityScore, OrderComplexity, SystemStability } from "../types/priority-system"

const COMPLEXITY_CATALOG: OrderComplexity[] = [
  {
    id: "1",
    name: "Café Americano",
    baseTime: 2,
    complexity: "simple",
    category: "beverage",
    preparationArea: "barra",
  },
  { id: "2", name: "Cappuccino", baseTime: 3, complexity: "simple", category: "beverage", preparationArea: "barra" },
  { id: "3", name: "Medialuna", baseTime: 1, complexity: "simple", category: "food", preparationArea: "barra" },
  { id: "4", name: "Sandwich Club", baseTime: 8, complexity: "complex", category: "food", preparationArea: "cocina" },
  { id: "5", name: "Ensalada César", baseTime: 12, complexity: "complex", category: "food", preparationArea: "cocina" },
  { id: "6", name: "Tostado", baseTime: 5, complexity: "medium", category: "food", preparationArea: "cocina" },
]

export function usePrioritySystem() {
  const [orders, setOrders] = useState<OrderWithPriority[]>([])

  const calculatePriorityScore = useCallback((order: any): PriorityScore => {
    const complexityItems = order.items.map(
      (item: any) => COMPLEXITY_CATALOG.find((c) => c.name === item.name) || COMPLEXITY_CATALOG[0],
    )

    const avgComplexity =
      complexityItems.reduce((sum: number, item: OrderComplexity) => {
        const complexityValue = item.complexity === "simple" ? 2 : item.complexity === "medium" ? 5 : 8
        return sum + complexityValue
      }, 0) / complexityItems.length

    const waitTime = Math.floor((Date.now() - order.timestamp.getTime()) / 60000) // minutos

    const urgencyMap = {
      low: 2,
      medium: 5,
      high: 8,
      critical: 10,
    }

    const customerTypeMultiplier = {
      regular: 1,
      vip: 1.5,
      delivery: 1.2,
    }

    const urgency = urgencyMap[order.priority as keyof typeof urgencyMap] || 5
    const customerMultiplier = customerTypeMultiplier[order.customerType as keyof typeof customerTypeMultiplier] || 1

    // Algoritmo de priorización: no FIFO, sino basado en múltiples factores
    const finalScore = urgency * 0.4 + avgComplexity * 0.3 + waitTime * 0.2 + customerMultiplier * 0.1

    return {
      urgency,
      complexity: avgComplexity,
      waitTime,
      customerType: order.customerType || "regular",
      finalScore,
    }
  }, [])

  const determineUrgencyLevel = useCallback((score: number): "low" | "medium" | "high" | "critical" => {
    if (score >= 8) return "critical"
    if (score >= 6) return "high"
    if (score >= 4) return "medium"
    return "low"
  }, [])

  const canBypassCashier = useCallback((order: any): boolean => {
    // Pedidos que pueden fluir independientemente del cajero
    const isDigitalOrder = order.channel === "digital"
    const isTableOrder = order.channel === "mesa"
    const isPrePaid = order.paymentStatus === "paid"

    return isDigitalOrder || isTableOrder || isPrePaid
  }, [])

  const processOrderWithPriority = useCallback(
    (baseOrder: any): OrderWithPriority => {
      const priorityScore = calculatePriorityScore(baseOrder)
      const urgencyLevel = determineUrgencyLevel(priorityScore.finalScore)

      const complexityItems = baseOrder.items.map(
        (item: any) => COMPLEXITY_CATALOG.find((c) => c.name === item.name) || COMPLEXITY_CATALOG[0],
      )

      const complexityScore = complexityItems.reduce((sum: number, item: OrderComplexity) => {
        return sum + (item.complexity === "simple" ? 1 : item.complexity === "medium" ? 3 : 5)
      }, 0)

      return {
        ...baseOrder,
        complexityScore,
        urgencyLevel,
        estimatedComplexity: complexityItems,
        priorityScore,
        canBypassCashier: canBypassCashier(baseOrder),
        independentFlow: canBypassCashier(baseOrder),
      }
    },
    [calculatePriorityScore, determineUrgencyLevel, canBypassCashier],
  )

  const sortOrdersByPriority = useCallback((orders: OrderWithPriority[]): OrderWithPriority[] => {
    return [...orders].sort((a, b) => {
      // Primero por urgencia crítica
      if (a.urgencyLevel === "critical" && b.urgencyLevel !== "critical") return -1
      if (b.urgencyLevel === "critical" && a.urgencyLevel !== "critical") return 1

      // Luego por score de prioridad (NO FIFO)
      return b.priorityScore.finalScore - a.priorityScore.finalScore
    })
  }, [])

  const getSystemStability = useCallback((): SystemStability => {
    const areas = ["cocina", "barra", "caja", "mesas"]
    const loadDistribution = areas.map((area) => {
      const areaOrders = orders.filter((order) => {
        if (area === "cocina") return order.destination === "cocina"
        if (area === "barra") return order.destination === "barra"
        if (area === "caja") return order.channel === "caja" && !order.canBypassCashier
        if (area === "mesas") return order.channel === "mesa"
        return false
      })

      const load = Math.min(100, (areaOrders.length / 10) * 100) // Máximo 10 pedidos = 100%
      const stability = load > 80 ? "critical" : load > 60 ? "warning" : "stable"

      return { area, load, stability }
    })

    const criticalAreas = loadDistribution.filter((area) => area.stability === "critical")
    const bottlenecks = criticalAreas.map((area) => area.area)

    // El cajero NO debe aparecer como nodo crítico
    const criticalNodes = bottlenecks.filter((node) => node !== "caja")

    const overallHealth = Math.max(0, 100 - criticalAreas.length * 25)

    const recommendations = []
    if (bottlenecks.includes("cocina")) recommendations.push("Considerar refuerzo en cocina")
    if (bottlenecks.includes("barra")) recommendations.push("Optimizar flujo de bebidas")
    if (bottlenecks.includes("caja")) recommendations.push("Activar más flujos independientes del cajero")

    return {
      overallHealth,
      bottlenecks,
      criticalNodes,
      recommendations,
      loadDistribution,
    }
  }, [orders])

  return {
    orders,
    setOrders,
    processOrderWithPriority,
    sortOrdersByPriority,
    getSystemStability,
    complexityCatalog: COMPLEXITY_CATALOG,
  }
}

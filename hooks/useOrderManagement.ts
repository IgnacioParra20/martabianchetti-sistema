"use client"

import { useState, useCallback, useMemo } from "react"
import type { Order, OrderItem, QueueMetrics } from "../types/system"

const MENU_ITEMS: OrderItem[] = [
  {
    id: "1",
    name: "Café Americano",
    category: "beverage",
    quantity: 1,
    price: 320,
    preparationTime: 2,
    complexity: 1,
    station: "bar",
  },
  {
    id: "2",
    name: "Cappuccino",
    category: "beverage",
    quantity: 1,
    price: 420,
    preparationTime: 3,
    complexity: 2,
    station: "bar",
  },
  {
    id: "3",
    name: "Sandwich Club",
    category: "food",
    quantity: 1,
    price: 850,
    preparationTime: 8,
    complexity: 7,
    station: "kitchen",
  },
  {
    id: "4",
    name: "Ensalada César",
    category: "food",
    quantity: 1,
    price: 950,
    preparationTime: 12,
    complexity: 8,
    station: "kitchen",
  },
  {
    id: "5",
    name: "Medialuna",
    category: "food",
    quantity: 1,
    price: 280,
    preparationTime: 1,
    complexity: 1,
    station: "bar",
  },
  {
    id: "6",
    name: "Tostado",
    category: "food",
    quantity: 1,
    price: 650,
    preparationTime: 5,
    complexity: 4,
    station: "kitchen",
  },
]

export function useOrderManagement() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "001",
      tableNumber: 5,
      channel: "mesa",
      items: [MENU_ITEMS[2], MENU_ITEMS[0]], // Sandwich + Café
      status: "preparing",
      createdAt: new Date(Date.now() - 600000), // 10 min ago
      estimatedTime: 10,
      priority: "high",
      complexity: 8,
      assignedWaiter: "mozo1",
      paymentStatus: "pending",
      customerType: "regular",
    },
    {
      id: "002",
      tableNumber: 3,
      channel: "mesa",
      items: [MENU_ITEMS[1], MENU_ITEMS[4]], // Cappuccino + Medialuna
      status: "ready",
      createdAt: new Date(Date.now() - 300000), // 5 min ago
      estimatedTime: 4,
      priority: "medium",
      complexity: 3,
      assignedWaiter: "mozo1",
      paymentStatus: "pending",
      customerType: "regular",
    },
    {
      id: "003",
      channel: "takeaway",
      items: [MENU_ITEMS[3]], // Ensalada
      status: "pending",
      createdAt: new Date(Date.now() - 120000), // 2 min ago
      estimatedTime: 12,
      priority: "urgent",
      complexity: 8,
      paymentStatus: "paid",
      customerType: "delivery",
    },
  ])

  // Algoritmo de priorización inteligente (NO FIFO)
  const calculatePriority = useCallback((order: Order): number => {
    const now = Date.now()
    const waitTime = (now - order.createdAt.getTime()) / 60000 // minutos

    // Factores de priorización
    const urgencyWeight =
      order.priority === "urgent" ? 10 : order.priority === "high" ? 7 : order.priority === "medium" ? 4 : 2
    const complexityWeight = 10 - order.complexity // Menos complejo = más prioridad
    const waitTimeWeight = Math.min(waitTime * 2, 10) // Máximo 10 puntos por tiempo
    const customerWeight = order.customerType === "vip" ? 3 : order.customerType === "delivery" ? 2 : 1

    return urgencyWeight * 0.4 + complexityWeight * 0.2 + waitTimeWeight * 0.3 + customerWeight * 0.1
  }, [])

  // Ordenar pedidos por prioridad inteligente
  const prioritizedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      const priorityA = calculatePriority(a)
      const priorityB = calculatePriority(b)
      return priorityB - priorityA
    })
  }, [orders, calculatePriority])

  // Métricas del sistema
  const queueMetrics = useMemo((): QueueMetrics => {
    const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "paid")
    const kitchenOrders = activeOrders.filter((o) => o.items.some((item) => item.station === "kitchen"))
    const barOrders = activeOrders.filter((o) => o.items.some((item) => item.station === "bar"))

    const totalWaitTime = activeOrders.reduce((sum, order) => {
      const waitTime = (Date.now() - order.createdAt.getTime()) / 60000
      return sum + waitTime
    }, 0)

    return {
      totalOrders: activeOrders.length,
      averageWaitTime: activeOrders.length > 0 ? totalWaitTime / activeOrders.length : 0,
      kitchenLoad: Math.min((kitchenOrders.length / 8) * 100, 100), // Max 8 orders = 100%
      barLoad: Math.min((barOrders.length / 5) * 100, 100), // Max 5 orders = 100%
      efficiency: Math.max(0, 100 - (totalWaitTime / activeOrders.length) * 2),
    }
  }, [orders])

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              actualTime: status === "ready" ? (Date.now() - order.createdAt.getTime()) / 60000 : order.actualTime,
            }
          : order,
      ),
    )
  }, [])

  const addOrder = useCallback((newOrder: Omit<Order, "id" | "createdAt">) => {
    const order: Order = {
      ...newOrder,
      id: `${Date.now()}`,
      createdAt: new Date(),
    }
    setOrders((prev) => [...prev, order])
  }, [])

  const getOrdersByStation = useCallback(
    (station: "kitchen" | "bar") => {
      return prioritizedOrders.filter((order) =>
        order.items.some((item) => item.station === station || item.station === "both"),
      )
    },
    [prioritizedOrders],
  )

  const getOrdersByWaiter = useCallback(
    (waiterId: string) => {
      return orders.filter((order) => order.assignedWaiter === waiterId)
    },
    [orders],
  )

  const getReadyOrders = useCallback(() => {
    return orders.filter((order) => order.status === "ready")
  }, [orders])

  return {
    orders,
    prioritizedOrders,
    queueMetrics,
    menuItems: MENU_ITEMS,
    updateOrderStatus,
    addOrder,
    getOrdersByStation,
    getOrdersByWaiter,
    getReadyOrders,
  }
}

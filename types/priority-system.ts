import type { Order } from "./order" // Assuming Order is defined in another file

export interface OrderComplexity {
  id: string
  name: string
  baseTime: number // minutos
  complexity: "simple" | "medium" | "complex"
  category: "beverage" | "food" | "dessert"
  preparationArea: "barra" | "cocina" | "both"
}

export interface PriorityScore {
  urgency: number // 1-10
  complexity: number // 1-10
  waitTime: number // minutos esperando
  customerType: "regular" | "vip" | "delivery"
  finalScore: number
}

export interface OrderWithPriority extends Order {
  complexityScore: number
  urgencyLevel: "low" | "medium" | "high" | "critical"
  estimatedComplexity: OrderComplexity[]
  priorityScore: PriorityScore
  canBypassCashier: boolean
  independentFlow: boolean
}

export interface SystemStability {
  overallHealth: number // 0-100
  bottlenecks: string[]
  criticalNodes: string[]
  recommendations: string[]
  loadDistribution: {
    area: string
    load: number
    stability: "stable" | "warning" | "critical"
  }[]
}

export interface RoleSegmentation {
  role: string
  exclusiveTasks: string[]
  prohibitedTasks: string[]
  currentLoad: number
  maxCapacity: number
  isBottleneck: boolean
  canOperateIndependently: boolean
}

export interface User {
  id: string
  name: string
  role: "cajero" | "mozo" | "produccion" | "supervisor" | "admin"
  isActive: boolean
  currentShift?: string
  avatar?: string
}

export interface Order {
  id: string
  channel: "mesa" | "takeaway" | "delivery"
  destination: "cocina" | "barra"
  items: OrderItem[]
  status: "pending" | "preparing" | "ready" | "delivered" | "paid"
  timestamp: Date
  estimatedTime: number
  actualTime?: number
  priority: "low" | "medium" | "high" | "urgent"
  complexity: number // 1-10 scale
  assignedTo?: string
  assignedWaiter?: string
  paymentStatus: "pending" | "paid"
  notes?: string
  customerType: "regular" | "vip" | "delivery"
  tableNumber?: number
}

export interface OrderItem {
  id: string
  name: string
  category: "beverage" | "food" | "dessert"
  quantity: number
  price: number
  preparationTime: number
  complexity: number
  notes?: string
  station: "kitchen" | "bar" | "both"
}

export interface QueueStatus {
  area: string
  load: number
  waitTime: number
  orders: number
  capacity: number
  efficiency: number
}

export interface QueueMetrics {
  totalOrders: number
  averageWaitTime: number
  kitchenLoad: number
  barLoad: number
  efficiency: number
}

export interface Alert {
  id: string
  type: "stock" | "supplier" | "emergency" | "system" | "performance" | "warning" | "error" | "info"
  message: string
  priority: "low" | "medium" | "high" | "critical"
  timestamp: Date
  status: "active" | "acknowledged" | "resolved"
  predictive?: boolean
  autoAssign?: boolean
  acknowledged: boolean
  role?: string
}

export interface Metrics {
  ordersPerHour: number
  averageWaitTime: number
  customerSatisfaction: number
  efficiency: number
  revenue: number
  peakHours: string[]
}

export interface Task {
  id: string
  type: "order" | "cleaning" | "maintenance" | "service"
  description: string
  assignedTo?: string
  priority: "low" | "medium" | "high"
  estimatedTime: number
  status: "pending" | "assigned" | "in-progress" | "completed"
  dueTime?: Date
}

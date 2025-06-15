export interface Order {
  id: string
  channel: "mesa" | "caja" | "digital"
  destination: "cocina" | "barra"
  items: OrderItem[]
  status: "pending" | "assigned" | "in-progress" | "completed" | "cancelled"
  timestamp: Date
  estimatedTime: number
  assignedTo?: string
  priority: "low" | "medium" | "high"
  tableNumber?: number
  customerType?: "regular" | "vip" | "delivery"
  paymentStatus?: "pending" | "paid"
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  notes?: string
  price: number
}

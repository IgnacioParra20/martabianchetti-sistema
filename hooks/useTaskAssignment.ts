"use client"

import { useState, useCallback } from "react"
import type { Order, Task, User } from "../types/system"

export function useTaskAssignment() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)

  // Algoritmo de asignación dinámica
  const assignTaskDynamically = useCallback(
    (order: Order, availableStaff: User[]) => {
      const relevantStaff = availableStaff.filter((staff) => {
        switch (order.destination) {
          case "cocina":
            return staff.role === "produccion"
          case "barra":
            return staff.role === "produccion"
          default:
            if (order.channel === "mesa") return staff.role === "mozo"
            if (order.channel === "caja") return staff.role === "cajero"
            return true
        }
      })

      if (relevantStaff.length === 0) return null

      // Asignar al empleado con menos tareas pendientes
      const staffWorkload = relevantStaff.map((staff) => ({
        staff,
        workload: tasks.filter((task) => task.assignedTo === staff.id && task.status !== "completed").length,
      }))

      const leastBusyStaff = staffWorkload.reduce((min, current) => (current.workload < min.workload ? current : min))

      return leastBusyStaff.staff.id
    },
    [tasks],
  )

  const createTaskFromOrder = useCallback(
    (order: Order, assignedTo?: string): Task => ({
      id: `task-${order.id}`,
      type: "order",
      description: `Procesar pedido #${order.id} - ${order.items.map((i) => i.name).join(", ")}`,
      assignedTo,
      priority: order.priority,
      estimatedTime: order.estimatedTime,
      status: assignedTo ? "assigned" : "pending",
      dueTime: new Date(Date.now() + order.estimatedTime * 60000),
    }),
    [],
  )

  const assignOrder = useCallback(
    (order: Order, availableStaff: User[]) => {
      if (!autoAssignEnabled) return null

      const assignedStaffId = assignTaskDynamically(order, availableStaff)
      const task = createTaskFromOrder(order, assignedStaffId)

      setTasks((prev) => {
        // Check if task already exists to prevent duplicates
        const existingTask = prev.find((t) => t.id === task.id)
        if (existingTask) return prev
        return [...prev, task]
      })
      return assignedStaffId
    },
    [autoAssignEnabled, assignTaskDynamically, createTaskFromOrder],
  )

  const updateTaskStatus = useCallback((taskId: string, status: Task["status"]) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }, [])

  const reassignTask = useCallback((taskId: string, newAssignee: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, assignedTo: newAssignee, status: "assigned" } : task)),
    )
  }, [])

  const getTasksForUser = useCallback(
    (userId: string) => {
      return tasks.filter((task) => task.assignedTo === userId)
    },
    [tasks],
  )

  const getPendingTasks = useCallback(() => {
    return tasks.filter((task) => task.status === "pending")
  }, [tasks])

  return {
    tasks,
    autoAssignEnabled,
    setAutoAssignEnabled,
    assignOrder,
    updateTaskStatus,
    reassignTask,
    getTasksForUser,
    getPendingTasks,
  }
}

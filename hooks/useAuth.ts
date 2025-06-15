"use client"

import { useState, useEffect } from "react"
import type { User } from "../types/system"

const mockUsers: User[] = [
  {
    id: "cajero1",
    name: "Ana García",
    role: "cajero",
    isActive: true,
    currentShift: "morning",
    avatar: "👩‍💼",
  },
  {
    id: "mozo1",
    name: "Carlos López",
    role: "mozo",
    isActive: true,
    currentShift: "morning",
    avatar: "👨‍🍳",
  },
  {
    id: "produccion1",
    name: "María Rodríguez",
    role: "produccion",
    isActive: true,
    currentShift: "morning",
    avatar: "👩‍🍳",
  },
  {
    id: "supervisor1",
    name: "Juan Pérez",
    role: "supervisor",
    isActive: true,
    currentShift: "morning",
    avatar: "👨‍💼",
  },
  {
    id: "admin1",
    name: "Laura Martín",
    role: "admin",
    isActive: true,
    avatar: "👩‍💻",
  },
]

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          console.log("Usuario encontrado en localStorage:", user)
          setCurrentUser(user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Error al leer usuario guardado:", error)
        localStorage.removeItem("currentUser")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId)
    if (user && user.isActive) {
      console.log("Iniciando sesión para:", user.name, "Rol:", user.role)

      // Actualizar estados
      setCurrentUser(user)
      setIsAuthenticated(true)

      // Guardar en localStorage
      localStorage.setItem("currentUser", JSON.stringify(user))

      console.log("Login exitoso, usuario autenticado:", user.role)
      return user // Retornar el usuario para uso inmediato
    }

    console.error("Login fallido: Usuario no encontrado o inactivo")
    return null
  }

  const logout = () => {
    console.log("Cerrando sesión")
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  const hasPermission = (permission: string) => {
    if (!currentUser) return false

    const permissions = {
      admin: ["all"],
      supervisor: ["view_metrics", "view_all_orders", "manage_staff"],
      cajero: ["process_payments", "view_ready_orders"],
      mozo: ["manage_tables", "take_orders", "serve_orders"],
      produccion: ["manage_production", "update_order_status", "view_kitchen_orders"],
    }

    const userPermissions = permissions[currentUser.role] || []
    return userPermissions.includes("all") || userPermissions.includes(permission)
  }

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission,
    allUsers: mockUsers,
  }
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Coffee } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

export function LoginScreen() {
  const { login, allUsers } = useAuth()
  const [selectedUser, setSelectedUser] = useState<string>("")

  const handleLogin = () => {
    if (selectedUser) {
      const success = login(selectedUser)
      if (success) {
        // El componente padre se re-renderizará automáticamente
        console.log("Login successful, redirecting...")
      } else {
        console.error("Login failed")
        // Aquí podrías mostrar un mensaje de error si fuera necesario
      }
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700"
      case "supervisor":
        return "bg-blue-100 text-blue-700"
      case "cajero":
        return "bg-green-100 text-green-700"
      case "mozo":
        return "bg-orange-100 text-orange-700"
      case "produccion":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "cajero":
        return "Solo cobros - Rol no crítico"
      case "mozo":
        return "Gestión de mesas y pedidos"
      case "produccion":
        return "Cocina y barra"
      case "supervisor":
        return "Monitoreo operativo"
      case "admin":
        return "Acceso completo"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Coffee className="w-8 h-8 text-amber-600" />
            <div>
              <CardTitle className="text-2xl">Martha de Bianchetti</CardTitle>
              <p className="text-sm text-gray-600">Sistema Operativo Inteligente</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Seleccionar Usuario:</h3>
            <div className="space-y-2">
              {allUsers
                .filter((user) => user.isActive)
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedUser === user.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{getRoleDescription(user.role)}</div>
                        </div>
                      </div>
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <Button onClick={handleLogin} disabled={!selectedUser} className="w-full">
            {selectedUser
              ? `Acceder como ${allUsers.find((u) => u.id === selectedUser)?.role}`
              : "Selecciona un usuario"}
          </Button>

          <div className="text-xs text-center text-gray-500">Sistema con roles diferenciados - Sin nodos críticos</div>
        </CardContent>
      </Card>
    </div>
  )
}

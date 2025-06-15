"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Shield, Home } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleHome = () => {
    if (currentUser) {
      router.push(`/${currentUser.role}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header global */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleHome} className="flex items-center gap-2 hover:opacity-80">
              <h1 className="text-xl font-bold">Martha de Bianchetti</h1>
            </button>
            <Badge className="bg-blue-100 text-blue-700">
              <Shield className="w-3 h-3 mr-1" />
              Sistema Sin Nodos Críticos
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentUser.avatar}</span>
                <div className="text-right">
                  <div className="font-medium">{currentUser.name}</div>
                  <div className="text-sm text-gray-600 capitalize">{currentUser.role}</div>
                </div>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleHome}>
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      {children}
    </div>
  )
}

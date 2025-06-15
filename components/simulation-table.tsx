"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { SimulationData } from "../hooks/useSimulation"

interface SimulationTableProps {
  data: SimulationData[]
}

export function SimulationTable({ data }: SimulationTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos para mostrar</p>
      </div>
    )
  }

  return (
    <div className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Cliente</TableHead>
            <TableHead>Llegada</TableHead>
            <TableHead>Inicio Servicio</TableHead>
            <TableHead>Fin Servicio</TableHead>
            <TableHead>Tiempo Total</TableHead>
            <TableHead>Tiempo Espera</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">#{row.id}</TableCell>
              <TableCell>{row.arrivalTime.toFixed(2)} min</TableCell>
              <TableCell>{row.serviceStartTime.toFixed(2)} min</TableCell>
              <TableCell>{row.serviceEndTime.toFixed(2)} min</TableCell>
              <TableCell className="font-medium">{row.totalTime.toFixed(2)} min</TableCell>
              <TableCell>{row.waitTime.toFixed(2)} min</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

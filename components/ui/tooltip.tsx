import React, { createContext, ReactNode, useContext, useState } from "react"

type TooltipProviderProps = { children: ReactNode }
export const TooltipProvider: React.FC<TooltipProviderProps> = ({ children }) => <>{children}</>

type TooltipContextType = {
  open: boolean
  setOpen: (open: boolean) => void
}
const TooltipContext = createContext<TooltipContextType | undefined>(undefined)

type TooltipProps = { children: ReactNode }
export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [open, setOpen] = useState(false)
  return (
    <TooltipContext.Provider value={{ open, setOpen }}>
      <span style={{ position: "relative", display: "inline-block" }}>{children}</span>
    </TooltipContext.Provider>
  )
}

type TooltipTriggerProps = { children: ReactNode; asChild?: boolean }
export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  const ctx = useContext(TooltipContext)
  if (!ctx) return <>{children}</>
  return (
    <span
      onMouseEnter={() => ctx.setOpen(true)}
      onMouseLeave={() => ctx.setOpen(false)}
      style={{ cursor: "pointer" }}
    >
      {children}
    </span>
  )
}

type TooltipContentProps = { children: ReactNode }
export const TooltipContent: React.FC<TooltipContentProps> = ({ children }) => {
  const ctx = useContext(TooltipContext)
  if (!ctx || !ctx.open) return null
  return (
    <span
      style={{
        position: "absolute",
        bottom: "120%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#333",
        color: "#fff",
        padding: "4px 8px",
        borderRadius: "4px",
        whiteSpace: "nowrap",
        zIndex: 1000,
        fontSize: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {children}
    </span>
  )
}
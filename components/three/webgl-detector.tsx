"use client"

import type React from "react"

export function useWebGLSupport() {
  return true
}

interface WebGLFallbackProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function WebGLFallback({ children, fallback }: WebGLFallbackProps) {
  return <>{children}</>
}

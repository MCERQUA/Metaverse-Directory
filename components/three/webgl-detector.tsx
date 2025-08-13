"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function useWebGLSupport() {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
      setHasWebGL(!!gl)
    } catch (e) {
      setHasWebGL(false)
    }
  }, [])

  return hasWebGL
}

interface WebGLFallbackProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function WebGLFallback({ children, fallback }: WebGLFallbackProps) {
  const hasWebGL = useWebGLSupport()

  if (hasWebGL === null) {
    return (
      <div className="bg-slate-800 rounded-lg flex items-center justify-center p-4">
        <div className="text-slate-400 text-sm">Checking 3D support...</div>
      </div>
    )
  }

  if (!hasWebGL) {
    return (
      fallback || (
        <div className="bg-slate-800 rounded-lg flex items-center justify-center p-4">
          <div className="text-center text-slate-400">
            <div className="text-sm">WebGL not supported</div>
            <div className="text-xs mt-1">3D previews unavailable</div>
          </div>
        </div>
      )
    )
  }

  return <>{children}</>
}

"use client"

import { useState, useRef, useEffect } from "react"

interface CSSPanoramaViewerProps {
  imageUrl: string
  className?: string
  autoRotate?: boolean
}

export function CSSPanoramaViewer({ 
  imageUrl, 
  className = "",
  autoRotate = false 
}: CSSPanoramaViewerProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startRotation, setStartRotation] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setStartRotation({ ...rotation })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()

    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y

    setRotation({
      x: Math.max(-30, Math.min(30, startRotation.x - deltaY * 0.2)),
      y: startRotation.y + deltaX * 0.3
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setStartPos({ x: touch.clientX, y: touch.clientY })
    setStartRotation({ ...rotation })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.x
    const deltaY = touch.clientY - startPos.y

    setRotation({
      x: Math.max(-30, Math.min(30, startRotation.x - deltaY * 0.2)),
      y: startRotation.y + deltaX * 0.3
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Auto-rotation feature
  useEffect(() => {
    if (!autoRotate || isDragging) return

    const interval = setInterval(() => {
      setRotation(prev => ({
        ...prev,
        y: prev.y + 0.1
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [isDragging, autoRotate])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{
        perspective: '1000px',
        perspectiveOrigin: '50% 50%',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="absolute inset-0"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          WebkitTransform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          WebkitTransformStyle: 'preserve-3d'
        }}
      >
        <div
          className="absolute"
          style={{
            width: '200%',
            height: '100%',
            left: '-50%',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat-x'
          }}
        />
      </div>
    </div>
  )
}

// Fallback component for testing
export function SimplePanoramaViewer({ imageUrl }: { imageUrl: string }) {
  const [rotY, setRotY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [startX, setStartX] = useState(0)

  return (
    <div 
      className="fixed inset-0"
      style={{ 
        width: '100%', 
        height: '100%', 
        perspective: '1000px',
        overflow: 'hidden',
        cursor: dragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={(e) => {
        setDragging(true)
        setStartX(e.clientX - rotY)
      }}
      onMouseMove={(e) => {
        if (dragging) setRotY(e.clientX - startX)
      }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      <div style={{
        width: '200%',
        height: '100%',
        left: '-50%',
        position: 'absolute',
        transform: `rotateY(${rotY * 0.3}deg)`,
        transformStyle: 'preserve-3d',
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center'
      }} />
    </div>
  )
}
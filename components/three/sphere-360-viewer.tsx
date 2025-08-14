"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface Sphere360ViewerProps {
  imageUrl: string
  className?: string
}

export function Sphere360Viewer({ imageUrl, className = "" }: Sphere360ViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const animationIdRef = useRef<number | null>(null)
  
  const [isDragging, setIsDragging] = useState(false)
  const [previousMousePosition, setPreviousMousePosition] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup - inside the sphere
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 0.1)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create sphere geometry (inverted for 360 view from inside)
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1) // Invert the sphere

    // Load texture
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      imageUrl,
      (texture) => {
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBFormat
        
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        })
        
        const sphere = new THREE.Mesh(geometry, material)
        sphereRef.current = sphere
        scene.add(sphere)
      },
      undefined,
      (error) => {
        console.error("Error loading 360 image:", error)
      }
    )

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      
      if (sphereRef.current) {
        // Apply rotation based on drag
        camera.rotation.y = rotation.x
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y))
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
      
      if (sphereRef.current) {
        const material = sphereRef.current.material as THREE.MeshBasicMaterial
        material.map?.dispose()
        material.dispose()
        geometry.dispose()
      }
    }
  }, [imageUrl])

  // Update rotation when it changes
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.rotation.y = rotation.x
      cameraRef.current.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotation.y))
    }
  }, [rotation])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setPreviousMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - previousMousePosition.x
    const deltaY = e.clientY - previousMousePosition.y

    setRotation(prev => ({
      x: prev.x + deltaX * 0.005,
      y: prev.y + deltaY * 0.005
    }))

    setPreviousMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      setPreviousMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return

    const deltaX = e.touches[0].clientX - previousMousePosition.x
    const deltaY = e.touches[0].clientY - previousMousePosition.y

    setRotation(prev => ({
      x: prev.x + deltaX * 0.005,
      y: prev.y + deltaY * 0.005
    }))

    setPreviousMousePosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={mountRef}
      className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    />
  )
}
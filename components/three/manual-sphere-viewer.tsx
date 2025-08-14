"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface ManualSphereViewerProps {
  imageUrl: string
  className?: string
}

export function ManualSphereViewer({ imageUrl, className = "" }: ManualSphereViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [mouseDown, setMouseDown] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [targetRotationX, setTargetRotationX] = useState(0)
  const [targetRotationY, setTargetRotationY] = useState(0)
  const rotationX = useRef(0)
  const rotationY = useRef(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (!mountRef.current) return

    const container = mountRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera - positioned at center looking outward
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      1,
      1100
    )
    camera.position.set(0, 0, 0)
    scene.add(camera)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Sphere geometry - inverted to see from inside
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)

    // Texture loader
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(imageUrl)
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.colorSpace = THREE.SRGBColorSpace

    // Material
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    })

    // Mesh
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // Mouse move handler
    const onDocumentMouseMove = (event: MouseEvent) => {
      if (!mouseDown) return
      
      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY
      
      setTargetRotationY(prev => prev + deltaX * 0.01)
      setTargetRotationX(prev => Math.max(-Math.PI/2, Math.min(Math.PI/2, prev + deltaY * 0.01)))
      
      setMouseX(event.clientX)
      setMouseY(event.clientY)
    }

    // Touch move handler
    const onDocumentTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      
      const touch = event.touches[0]
      const deltaX = touch.clientX - mouseX
      const deltaY = touch.clientY - mouseY
      
      setTargetRotationY(prev => prev + deltaX * 0.01)
      setTargetRotationX(prev => Math.max(-Math.PI/2, Math.min(Math.PI/2, prev + deltaY * 0.01)))
      
      setMouseX(touch.clientX)
      setMouseY(touch.clientY)
    }

    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove)
    document.addEventListener('touchmove', onDocumentTouchMove)

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      
      // Smooth rotation
      rotationX.current += (targetRotationX - rotationX.current) * 0.05
      rotationY.current += (targetRotationY - rotationY.current) * 0.05
      
      // Update camera rotation
      const phi = (90 - rotationX.current * 180 / Math.PI) * Math.PI / 180
      const theta = rotationY.current
      
      camera.position.x = 1 * Math.sin(phi) * Math.cos(theta)
      camera.position.y = 1 * Math.cos(phi)
      camera.position.z = 1 * Math.sin(phi) * Math.sin(theta)
      
      camera.lookAt(scene.position)
      
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current) return
      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove)
      document.removeEventListener('touchmove', onDocumentTouchMove)
      window.removeEventListener('resize', handleResize)
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
    }
  }, [imageUrl, mouseDown, mouseX, mouseY, targetRotationX, targetRotationY])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setMouseDown(true)
    setMouseX(e.clientX)
    setMouseY(e.clientY)
  }

  const handleMouseUp = () => {
    setMouseDown(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setMouseDown(true)
      setMouseX(e.touches[0].clientX)
      setMouseY(e.touches[0].clientY)
    }
  }

  const handleTouchEnd = () => {
    setMouseDown(false)
  }

  return (
    <div 
      ref={mountRef}
      className={`w-full h-full ${className}`}
      style={{ 
        cursor: mouseDown ? 'grabbing' : 'grab',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  )
}
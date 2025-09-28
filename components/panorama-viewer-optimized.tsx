'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface OptimizedPanoramaViewerProps {
  imageUrl: string;
  id: string;
  autoRotate?: number;
  showControls?: boolean;
  initialPitch?: number;
  initialYaw?: number;
  height?: string;
  className?: string;
  placeholder?: string;
  lazy?: boolean;
}

// Global state for script loading
let pannellumScriptLoaded = false;
const scriptLoadPromise = new Promise<void>((resolve) => {
  if (typeof window !== 'undefined' && (window as any).pannellum) {
    pannellumScriptLoaded = true;
    resolve();
  } else {
    (window as any).__pannellumResolve = resolve;
  }
});

// Global WebGL context manager to prevent exhaustion
class WebGLContextManager {
  private static instance: WebGLContextManager;
  private activeViewers = new Map<string, any>();
  private pendingCleanup = new Set<string>();
  private maxViewers = 2; // Very conservative limit
  private cleanupTimeout: NodeJS.Timeout | null = null;

  static getInstance(): WebGLContextManager {
    if (!WebGLContextManager.instance) {
      WebGLContextManager.instance = new WebGLContextManager();
    }
    return WebGLContextManager.instance;
  }

  canCreateViewer(): boolean {
    return this.activeViewers.size < this.maxViewers;
  }

  registerViewer(id: string, viewer: any): void {
    // If at max capacity, force cleanup oldest
    if (this.activeViewers.size >= this.maxViewers) {
      const oldestId = Array.from(this.activeViewers.keys())[0];
      this.forceCleanup(oldestId);
    }
    this.activeViewers.set(id, viewer);
    this.pendingCleanup.delete(id);
  }

  scheduleCleanup(id: string, delay: number = 3000): void {
    this.pendingCleanup.add(id);

    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
    }

    this.cleanupTimeout = setTimeout(() => {
      if (this.pendingCleanup.has(id)) {
        this.forceCleanup(id);
      }
    }, delay);
  }

  cancelCleanup(id: string): void {
    this.pendingCleanup.delete(id);
  }

  forceCleanup(id: string): void {
    const viewer = this.activeViewers.get(id);
    if (viewer) {
      try {
        // Destroy Pannellum viewer
        if (typeof viewer.destroy === 'function') {
          viewer.destroy();
        }
      } catch (e) {
        console.warn(`Error destroying viewer ${id}:`, e);
      }

      // Force WebGL context cleanup
      const container = document.getElementById(id);
      if (container) {
        const canvases = container.querySelectorAll('canvas');
        canvases.forEach(canvas => {
          const gl = (canvas as HTMLCanvasElement).getContext('webgl') ||
                     (canvas as HTMLCanvasElement).getContext('experimental-webgl');
          if (gl) {
            const loseContext = gl.getExtension('WEBGL_lose_context');
            if (loseContext) {
              loseContext.loseContext();
            }
          }
        });

        // Clear container
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }

      this.activeViewers.delete(id);
      this.pendingCleanup.delete(id);
    }
  }

  cleanupAll(): void {
    const ids = Array.from(this.activeViewers.keys());
    ids.forEach(id => this.forceCleanup(id));
  }

  getActiveCount(): number {
    return this.activeViewers.size;
  }
}

const contextManager = WebGLContextManager.getInstance();

export default function OptimizedPanoramaViewer({
  imageUrl,
  id,
  autoRotate = -2,
  showControls = false,
  initialPitch = 10,
  initialYaw = 180,
  height = '100%',
  className = '',
  placeholder,
  lazy = true
}: OptimizedPanoramaViewerProps) {
  const [isVisible, setIsVisible] = useState(!lazy);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isQueued, setIsQueued] = useState(false);
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Setup Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            // When going out of view, mark as not visible but don't cleanup immediately
            // This prevents destroying and recreating viewers when scrolling quickly
            setIsVisible(false);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading slightly before visible
        threshold: 0.01
      }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy]);

  // Initialize panorama viewer when visible
  useEffect(() => {
    if (!containerRef.current) return;

    const initializeViewer = async () => {
      // Only initialize if visible and not already initialized
      if (!isVisible || isInitialized) return;

      // Wait for script to load
      await scriptLoadPromise;

      // Check if we can create a new viewer
      if (!contextManager.canCreateViewer()) {
        setIsQueued(true);
        // Wait and retry
        setTimeout(() => {
          if (isVisible && !isInitialized) {
            initializeViewer();
          }
        }, 500);
        return;
      }
      setIsQueued(false);

      const pannellum = (window as any).pannellum;
      if (!pannellum || !containerRef.current) return;

      try {
        // Create viewer configuration
        const config = {
          type: 'equirectangular',
          panorama: imageUrl,
          autoLoad: true,
          autoRotate: autoRotate,
          showZoomCtrl: showControls,
          showFullscreenCtrl: showControls,
          showControls: showControls,
          pitch: initialPitch,
          yaw: initialYaw,
          hfov: 110,
          minHfov: 50,
          maxHfov: 120,
          mouseZoom: showControls,
          doubleClickZoom: false,
          draggable: true,
          friction: 0.15,
          compass: false,
          preview: placeholder || imageUrl,
          // Performance optimizations
          hotSpotDebug: false,
          disableKeyboardCtrl: !showControls,
        };

        // Initialize viewer
        viewerRef.current = pannellum.viewer(id, config);
        contextManager.registerViewer(id, viewerRef.current);
        setIsInitialized(true);

        // Hide preview after panorama loads
        setTimeout(() => setShowPreview(false), 500);
      } catch (error) {
        console.error(`Failed to initialize panorama ${id}:`, error);
      }
    };

    // Handle visibility changes
    if (isVisible && !isInitialized) {
      contextManager.cancelCleanup(id);
      initializeViewer();
    } else if (!isVisible && isInitialized) {
      // Schedule cleanup when out of view
      contextManager.scheduleCleanup(id, 3000);
      handleCleanup();
      setIsInitialized(false);
      setShowPreview(true);
    }
  }, [isVisible, isInitialized, imageUrl, id, autoRotate, showControls, initialPitch, initialYaw, placeholder]);

  // Removed - now handled by WebGLContextManager

  const handleCleanup = () => {
    if (viewerRef.current || contextManager.getActiveCount() > 0) {
      contextManager.forceCleanup(id);
      viewerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      contextManager.forceCleanup(id);
    };
  }, [id]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        onLoad={() => {
          pannellumScriptLoaded = true;
          if ((window as any).__pannellumResolve) {
            (window as any).__pannellumResolve();
          }
        }}
        strategy="afterInteractive"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      />
      
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{ height, width: '100%' }}
      >
        {/* Preview/Placeholder while loading */}
        {showPreview && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{ 
              backgroundImage: `url(${placeholder || imageUrl})`,
              opacity: showPreview ? 1 : 0
            }}
          >
            {/* Loading indicator */}
            {isVisible && !isInitialized && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                {isQueued ? (
                  <div className="text-white text-sm bg-black/50 px-3 py-2 rounded">Waiting for resources...</div>
                ) : (
                  <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                )}
              </div>
            )}
          </div>
        )}
        
        {/* Pannellum container */}
        <div
          id={id}
          className={`absolute inset-0 transition-opacity duration-500`}
          style={{
            opacity: isInitialized && !showPreview ? 1 : 0,
            pointerEvents: isInitialized ? 'auto' : 'none'
          }}
          data-panorama-viewer={id}
        />
      </div>
    </>
  );
}
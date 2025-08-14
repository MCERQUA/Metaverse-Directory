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

// Pool of viewer instances for reuse
const viewerPool: any[] = [];
const MAX_ACTIVE_VIEWERS = 6; // Limit concurrent active viewers
const activeViewers = new Set<string>();

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
            // Keep observing to handle going out of view
          } else if (isInitialized) {
            // Cleanup when out of view for memory management
            handleCleanup();
            setIsInitialized(false);
            setShowPreview(true);
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
  }, [lazy, isInitialized]);

  // Initialize panorama viewer when visible
  useEffect(() => {
    if (!isVisible || isInitialized || !containerRef.current) return;

    const initializeViewer = async () => {
      // Wait for script to load
      await scriptLoadPromise;

      // Check if we've hit the max active viewers limit
      if (activeViewers.size >= MAX_ACTIVE_VIEWERS) {
        // Find and cleanup the oldest viewer
        const oldestId = Array.from(activeViewers)[0];
        const oldestContainer = document.getElementById(oldestId);
        if (oldestContainer) {
          // Force cleanup of oldest viewer
          cleanupViewer(oldestId);
        }
      }

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
        activeViewers.add(id);
        setIsInitialized(true);
        
        // Hide preview after panorama loads
        setTimeout(() => setShowPreview(false), 500);
      } catch (error) {
        console.error(`Failed to initialize panorama ${id}:`, error);
      }
    };

    initializeViewer();
  }, [isVisible, isInitialized, imageUrl, id, autoRotate, showControls, initialPitch, initialYaw, placeholder]);

  const cleanupViewer = (viewerId: string) => {
    const container = document.getElementById(viewerId);
    if (container) {
      // Find and destroy the viewer
      const viewers = (window as any).pannellum?.viewer;
      if (viewers) {
        try {
          // Pannellum doesn't expose a direct way to get viewer by ID
          // so we need to manually trigger cleanup
          const event = new Event('destroy');
          container.dispatchEvent(event);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
      activeViewers.delete(viewerId);
    }
  };

  const handleCleanup = () => {
    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
        activeViewers.delete(id);
      } catch (e) {
        // Ignore errors during cleanup
      }
      viewerRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      handleCleanup();
    };
  }, []);

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
                <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
        )}
        
        {/* Pannellum container */}
        <div
          id={id}
          className={`absolute inset-0 transition-opacity duration-500`}
          style={{ opacity: isInitialized && !showPreview ? 1 : 0 }}
        />
      </div>
    </>
  );
}
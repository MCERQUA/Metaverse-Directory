'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface PanoramaViewerProps {
  imageUrl: string;
  id: string;
  autoRotate?: number;
  showControls?: boolean;
  initialPitch?: number;
  initialYaw?: number;
  height?: string;
  className?: string;
}

export default function PanoramaViewer({
  imageUrl,
  id,
  autoRotate = -2,
  showControls = false,
  initialPitch = 10,
  initialYaw = 180,
  height = '100%',
  className = ''
}: PanoramaViewerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current) return;

    // Clean up previous viewer if it exists
    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    // Small delay to ensure DOM is ready for multiple instances
    const timer = setTimeout(() => {
      // Initialize Pannellum viewer
      const pannellum = (window as any).pannellum;
      if (pannellum && containerRef.current) {
        viewerRef.current = pannellum.viewer(id, {
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
        preview: imageUrl
      });
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    };
  }, [isScriptLoaded, imageUrl, id, autoRotate, showControls, initialPitch, initialYaw]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="afterInteractive"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      />
      <div
        id={id}
        ref={containerRef}
        className={`relative ${className}`}
        style={{ height, width: '100%' }}
      />
    </>
  );
}
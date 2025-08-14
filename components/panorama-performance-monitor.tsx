'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  activeViewers: number;
  memoryUsage?: number;
  fps: number;
  loadTime: number;
}

export function PanoramaPerformanceMonitor({ show = false }: { show?: boolean }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    activeViewers: 0,
    fps: 60,
    loadTime: 0
  });

  useEffect(() => {
    if (!show) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Count active panorama viewers
        const activeViewers = document.querySelectorAll('.pnlm-container').length;
        
        // Get memory usage if available
        let memoryUsage: number | undefined;
        if ('memory' in performance) {
          const memInfo = (performance as any).memory;
          memoryUsage = Math.round(memInfo.usedJSHeapSize / 1048576); // Convert to MB
        }

        setMetrics({
          activeViewers,
          memoryUsage,
          fps,
          loadTime: Math.round(performance.now())
        });

        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg text-xs font-mono z-50 min-w-[200px]">
      <div className="font-bold mb-2 text-green-400">Performance Monitor</div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Active Panoramas:</span>
          <span className={metrics.activeViewers > 6 ? 'text-red-400' : 'text-green-400'}>
            {metrics.activeViewers}
          </span>
        </div>
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={metrics.fps < 30 ? 'text-red-400' : metrics.fps < 50 ? 'text-yellow-400' : 'text-green-400'}>
            {metrics.fps}
          </span>
        </div>
        {metrics.memoryUsage && (
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className={metrics.memoryUsage > 500 ? 'text-red-400' : 'text-green-400'}>
              {metrics.memoryUsage} MB
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Uptime:</span>
          <span>{(metrics.loadTime / 1000).toFixed(1)}s</span>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-600 text-[10px] text-gray-400">
        Max recommended: 6 viewers
      </div>
    </div>
  );
}
'use client';

import { InteractiveSpaceCardOptimized } from "@/components/space-grid/interactive-space-card-optimized";
import { PanoramaPerformanceMonitor } from "@/components/panorama-performance-monitor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

// Demo spaces with panorama views
const demoSpaces = [
  {
    id: 1001,
    name: "Mikes Room",
    creator: "MetaVerse Studios",
    category: "Social",
    visitors: 15234,
    rating: 4.9,
    thumbnail: "/room1-360.jpg",
    image360: "/room1-360.jpg",
    liveUrl: "https://3d-mc.netlify.app/",
    featured: true,
    isRealSpace: true,
  },
  {
    id: 1003,
    name: "White Space",
    creator: "MetaVerse Studios",
    category: "Art",
    visitors: 12450,
    rating: 4.9,
    thumbnail: "/white-room.jpg",
    image360: "/white-room.jpg",
    liveUrl: "https://3d-mc.netlify.app/white",
    featured: true,
    isRealSpace: true,
  },
  // Duplicate entries to test multiple instances
  {
    id: 2001,
    name: "Mikes Room 2",
    creator: "MetaVerse Studios",
    category: "Social",
    visitors: 8234,
    rating: 4.8,
    thumbnail: "/room1-360.jpg",
    image360: "/room1-360.jpg",
    liveUrl: "https://3d-mc.netlify.app/",
    featured: false,
    isRealSpace: true,
  },
  {
    id: 2003,
    name: "White Space 2",
    creator: "MetaVerse Studios",
    category: "Art",
    visitors: 6450,
    rating: 4.7,
    thumbnail: "/white-room.jpg",
    image360: "/white-room.jpg",
    liveUrl: "https://3d-mc.netlify.app/white",
    featured: false,
    isRealSpace: true,
  },
  {
    id: 3001,
    name: "Mikes Room 3",
    creator: "MetaVerse Studios",
    category: "Social",
    visitors: 5234,
    rating: 4.6,
    thumbnail: "/room1-360.jpg",
    image360: "/room1-360.jpg",
    liveUrl: "https://3d-mc.netlify.app/",
    featured: false,
    isRealSpace: true,
  },
  {
    id: 3003,
    name: "White Space 3",
    creator: "MetaVerse Studios",
    category: "Art",
    visitors: 4450,
    rating: 4.5,
    thumbnail: "/white-room.jpg",
    image360: "/white-room.jpg",
    liveUrl: "https://3d-mc.netlify.app/white",
    featured: false,
    isRealSpace: true,
  },
  // Even more for stress testing
  {
    id: 4001,
    name: "Mikes Room 4",
    creator: "MetaVerse Studios",
    category: "Social",
    visitors: 3234,
    rating: 4.4,
    thumbnail: "/room1-360.jpg",
    image360: "/room1-360.jpg",
    liveUrl: "https://3d-mc.netlify.app/",
    featured: false,
    isRealSpace: true,
  },
  {
    id: 4003,
    name: "White Space 4",
    creator: "MetaVerse Studios",
    category: "Art",
    visitors: 2450,
    rating: 4.3,
    thumbnail: "/white-room.jpg",
    image360: "/white-room.jpg",
    liveUrl: "https://3d-mc.netlify.app/white",
    featured: false,
    isRealSpace: true,
  },
];

export default function OptimizedPanoramaDemo() {
  const [showMonitor, setShowMonitor] = useState(true);
  const [cardCount, setCardCount] = useState(8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Optimized Panorama Demo</h1>
            <p className="text-gray-400">
              Testing multiple 360° panorama viewers with performance optimization
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMonitor(!showMonitor)}
            className="gap-2"
          >
            <Activity className="h-4 w-4" />
            {showMonitor ? 'Hide' : 'Show'} Monitor
          </Button>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-semibold mb-4">Demo Controls</h2>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-400">Number of cards:</span>
            <div className="flex gap-2">
              {[2, 4, 6, 8].map((count) => (
                <Button
                  key={count}
                  variant={cardCount === count ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCardCount(count)}
                >
                  {count}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>📌 Scroll down to see lazy loading in action</p>
            <p>📌 Only visible panoramas are rendered (check performance monitor)</p>
            <p>📌 Maximum 6 concurrent viewers to prevent browser limits</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="font-semibold text-green-400 mb-2">✅ Lazy Loading</h3>
            <p className="text-sm text-gray-400">
              Panoramas only load when scrolled into view using Intersection Observer
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="font-semibold text-green-400 mb-2">✅ Resource Pooling</h3>
            <p className="text-sm text-gray-400">
              Limits active viewers to 6 concurrent instances to prevent WebGL context issues
            </p>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="font-semibold text-green-400 mb-2">✅ Memory Management</h3>
            <p className="text-sm text-gray-400">
              Automatically cleans up viewers when scrolled out of view
            </p>
          </div>
        </div>

        {/* Space Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoSpaces.slice(0, cardCount).map((space) => (
            <InteractiveSpaceCardOptimized
              key={space.id}
              {...space}
            />
          ))}
        </div>

        {/* Add vertical spacing to test scroll behavior */}
        <div className="mt-16 py-8 border-t border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Performance Notes</h2>
          <div className="prose prose-invert max-w-none text-gray-300">
            <ul className="space-y-2">
              <li>
                <strong>WebGL Context Limit:</strong> Browsers typically support only 8-16 WebGL contexts. 
                Our system limits active panoramas to 6 to stay well within safe limits.
              </li>
              <li>
                <strong>Lazy Loading:</strong> Panoramas are only initialized when they enter the viewport 
                with a 50px margin, preventing unnecessary resource usage.
              </li>
              <li>
                <strong>Automatic Cleanup:</strong> When panoramas scroll out of view, they are destroyed 
                to free up memory and WebGL contexts.
              </li>
              <li>
                <strong>Progressive Enhancement:</strong> Static thumbnail images are shown first, 
                then replaced with interactive panoramas when ready.
              </li>
              <li>
                <strong>Optimized Rotation:</strong> Auto-rotation speed increases on hover for better 
                interactivity without constant high resource usage.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Monitor */}
      <PanoramaPerformanceMonitor show={showMonitor} />
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SplitSquareHorizontal, Layers, Info, Eye } from "lucide-react";
import Image from "next/image";

interface GradCAMViewerProps {
  originalUrl: string;
  gradcamUrl: string | null;
}

type ViewMode = "original" | "heatmap" | "side-by-side";

export default function GradCAMViewer({ originalUrl, gradcamUrl }: GradCAMViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
  const [showTooltip, setShowTooltip] = useState(false);

  const tabs: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "original",
      label: "Original",
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    {
      id: "heatmap",
      label: "Heatmap",
      icon: <Layers className="w-3.5 h-3.5" />,
    },
    {
      id: "side-by-side",
      label: "Compare",
      icon: <SplitSquareHorizontal className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toggle bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-700">Image Analysis</h3>
        <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === tab.id
                  ? "bg-white text-[#2E7D32] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image display area */}
      <AnimatePresence mode="wait">
        {viewMode === "side-by-side" ? (
          <motion.div
            key="side-by-side"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {/* Original */}
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium px-1">Original Image</p>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src={originalUrl}
                  alt="Original plant image"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>

            {/* Grad-CAM */}
            <div className="space-y-1.5">
              <p className="text-xs text-gray-500 font-medium px-1">Grad-CAM Heatmap</p>
              <GradCAMImage gradcamUrl={gradcamUrl} originalUrl={originalUrl} />
            </div>
          </motion.div>
        ) : viewMode === "original" ? (
          <motion.div
            key="original"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={originalUrl}
                alt="Original plant image"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="heatmap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <GradCAMImage gradcamUrl={gradcamUrl} originalUrl={originalUrl} fullWidth />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info banner */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-100">
        <div
          className="relative cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Info className="w-4 h-4 text-[#F57C00] shrink-0 mt-0.5" />
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-64 p-3 bg-gray-900 text-white text-xs rounded-xl shadow-xl leading-relaxed pointer-events-none"
              >
                <div className="font-semibold mb-1 text-amber-300">
                  About Grad-CAM
                </div>
                This highlighted area shows where the model detected fungal spores.
                Warmer colors (red/orange) indicate regions of higher activation that
                contributed most to the classification decision.
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">Grad-CAM visualization</span> — highlighted
          regions indicate areas the model focused on to make this prediction. Hover the
          icon for details.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grad-CAM image sub-component with hover tooltip
// ---------------------------------------------------------------------------
function GradCAMImage({
  gradcamUrl,
  originalUrl,
  fullWidth = false,
}: {
  gradcamUrl: string | null;
  originalUrl: string;
  fullWidth?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const aspectClass = fullWidth ? "aspect-video" : "aspect-square";

  return (
    <div
      className={`relative ${aspectClass} rounded-xl overflow-hidden border border-gray-200 cursor-pointer group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {gradcamUrl ? (
        <Image
          src={gradcamUrl}
          alt="Grad-CAM heatmap"
          fill
          className="object-cover"
          unoptimized
        />
      ) : (
        /* Placeholder Grad-CAM simulation when real URL is unavailable */
        <PlaceholderHeatmap baseImageUrl={originalUrl} />
      )}

      {/* Hover tooltip overlay */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/50 flex items-end justify-start p-3"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2.5 max-w-[90%] shadow-lg">
              <p className="text-xs text-gray-800 font-medium leading-snug">
                This highlighted area shows where the model detected fungal spores.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap badge */}
      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F57C00]" />
        Grad-CAM
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Placeholder heatmap overlay rendered via CSS when no real URL is provided
// ---------------------------------------------------------------------------
function PlaceholderHeatmap({ baseImageUrl }: { baseImageUrl: string }) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={baseImageUrl}
        alt="Base for heatmap"
        fill
        className="object-cover opacity-70"
        unoptimized
      />
      {/* Simulated heat blobs */}
      <div className="absolute inset-0">
        {/* Central hot spot */}
        <div
          className="absolute rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(211,47,47,0.75) 0%, rgba(245,124,0,0.55) 40%, rgba(255,235,59,0.3) 70%, transparent 100%)",
            top: "20%",
            left: "35%",
            width: "50%",
            height: "50%",
          }}
        />
        {/* Secondary spot */}
        <div
          className="absolute rounded-full blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(245,124,0,0.6) 0%, rgba(255,235,59,0.25) 60%, transparent 100%)",
            top: "55%",
            left: "15%",
            width: "30%",
            height: "30%",
          }}
        />
      </div>
      {/* Demo label */}
      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">
        Demo overlay
      </div>
    </div>
  );
}

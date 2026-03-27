"use client";

import { motion } from "framer-motion";
import { Microscope } from "lucide-react";

export default function ScanningAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center gap-8 py-16 px-4"
    >
      {/* Outer pulsing ring + scan container */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Pulse rings */}
        {[0, 0.4, 0.8].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-[#2E7D32]/30"
            animate={{ scale: [1, 1.6, 1.6], opacity: [0.6, 0, 0] }}
            transition={{
              duration: 2,
              delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Main circle */}
        <div className="w-24 h-24 rounded-full bg-[#2E7D32]/10 border-2 border-[#2E7D32]/20 flex items-center justify-center overflow-hidden relative">
          {/* Scanning line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#2E7D32] to-transparent"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          {/* Icon */}
          <Microscope className="w-10 h-10 text-[#2E7D32]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text area */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl font-semibold text-gray-800">Scanning</span>
          {/* Animated dots */}
          <div className="flex gap-1">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]"
                animate={{ opacity: [0, 1, 0], y: [0, -4, 0] }}
                transition={{ duration: 1.2, delay, repeat: Infinity }}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-500 max-w-xs">
          AI model is analyzing your plant image for disease markers
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#2E7D32] to-[#66bb6a] rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-1.5 text-xs text-gray-400 text-center">
        {[
          "Extracting visual features",
          "Running CNN inference",
          "Generating Grad-CAM heatmap",
        ].map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.8, duration: 0.4 }}
            className="flex items-center justify-center gap-1.5"
          >
            <motion.div
              className="w-1 h-1 rounded-full bg-[#2E7D32]"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, delay: i * 0.8, repeat: Infinity }}
            />
            {step}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

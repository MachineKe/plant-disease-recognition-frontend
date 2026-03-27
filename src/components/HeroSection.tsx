"use client";

import { motion } from "framer-motion";
import { Leaf, Zap, Shield } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2E7D32] via-[#388e3c] to-[#1b5e20] text-white">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5 blur-2xl" />
        {/* Subtle leaf pattern */}
        <div className="absolute top-4 right-8 opacity-10">
          <Leaf className="w-32 h-32 text-white rotate-12" />
        </div>
        <div className="absolute bottom-4 left-8 opacity-10">
          <Leaf className="w-20 h-20 text-white -rotate-6" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-sm rounded-full px-3.5 py-1.5 text-xs font-semibold mb-5 text-green-100"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            AI-Powered Plant Disease Detection
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4"
          >
            Identify Plant Diseases
            <br />
            <span className="text-green-200">Instantly & Accurately</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-green-100 text-base sm:text-lg leading-relaxed mb-8 max-w-lg"
          >
            Upload a leaf photo and our deep learning model will diagnose diseases,
            generate Grad-CAM heatmaps, and provide actionable treatment plans.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex flex-wrap gap-2.5"
          >
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: "< 3s inference" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "3-class classifier" },
              { icon: <Leaf className="w-3.5 h-3.5" />, label: "Grad-CAM explainability" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-xs font-medium text-green-100"
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade into page bg */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
}

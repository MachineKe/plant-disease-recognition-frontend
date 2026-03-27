"use client";

import Link from "next/link";
import { Leaf, History, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#2E7D32] shadow-md group-hover:shadow-lg transition-shadow">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-bold text-[#2E7D32] tracking-tight">
                PlantGuard
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest hidden sm:block">
                Disease Recognition
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/history"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#2E7D32] transition-colors"
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <div className="h-4 w-px bg-gray-200" />
            <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
              AI-Powered v1.0
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-3 space-y-1">
              <Link
                href="/history"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#2E7D32] transition-colors"
              >
                <History className="w-4 h-4" />
                History
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

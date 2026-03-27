"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  RefreshCw,
  AlertCircle,
  ChevronDown,
  UploadCloud,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetPrediction } from "@/store/predictionSlice";
import ImageUpload from "./ImageUpload";
import PredictionCard from "./PredictionCard";
import GradCAMViewer from "./GradCAMViewer";
import TreatmentPanel from "./TreatmentPanel";
import ScanningAnimation from "./ScanningAnimation";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { status, result, error, uploadedFile } = useAppSelector(
    (s) => s.prediction
  );

  const handleReset = () => {
    dispatch(resetPrediction());
  };

  const isIdle = status === "idle";
  const isScanning = status === "scanning";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* ------------------------------------------------------------------ */}
      {/* Upload zone – always visible in idle / error states                  */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {(isIdle || isError) && (
          <motion.section
            key="upload-section"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="max-w-2xl mx-auto space-y-4"
          >
            {/* Upload card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-800">
                    Upload & Analyze
                  </h2>
                  <p className="text-xs text-gray-400">
                    Supports JPG, PNG, WEBP · max 10 MB
                  </p>
                </div>
              </div>

              <ImageUpload
                previewUrl={uploadedFile}
                onClear={handleReset}
              />
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {isError && error && (
                <motion.div
                  key="error-banner"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl"
                >
                  <AlertCircle className="w-5 h-5 text-[#D32F2F] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#D32F2F]">
                      Analysis failed
                    </p>
                    <p className="text-xs text-red-600 mt-0.5 leading-relaxed">
                      {error}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#D32F2F] hover:underline shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* How it works */}
            <HowItWorks />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Scanning state                                                       */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isScanning && (
          <motion.section
            key="scanning-section"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm"
          >
            <ScanningAnimation />
          </motion.section>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Results state                                                        */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isSuccess && result && (
          <motion.div
            key="results-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Results header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>
                <p className="text-sm text-gray-400">
                  AI diagnosis complete — review findings below
                </p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-[#2E7D32] hover:text-[#2E7D32] hover:bg-green-50/50 transition-all shadow-sm active:scale-[0.98]"
              >
                <RefreshCw className="w-4 h-4" />
                New Scan
              </button>
            </div>

            {/* Two-column layout on lg+ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column: GradCAM + Prediction */}
              <div className="space-y-6">
                {/* Image comparison card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <GradCAMViewer
                    originalUrl={result.originalImageUrl}
                    gradcamUrl={result.gradcamImageUrl}
                  />
                </div>

                {/* Prediction card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <PredictionCard result={result} />
                </div>
              </div>

              {/* Right column: Treatment */}
              <div>
                <TreatmentPanel disease={result.disease} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ---------------------------------------------------------------------------
// How it works widget
// ---------------------------------------------------------------------------
function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Upload",
      desc: "Drop a leaf photo or take one directly with your camera.",
      color: "text-[#2E7D32]",
      bgColor: "bg-[#2E7D32]/10",
    },
    {
      step: "02",
      title: "AI Scans",
      desc: "Our CNN model runs inference and generates a Grad-CAM heatmap.",
      color: "text-[#F57C00]",
      bgColor: "bg-[#F57C00]/10",
    },
    {
      step: "03",
      title: "Get Results",
      desc: "View diagnosis, confidence scores, and a full treatment guide.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <ChevronDown className="w-4 h-4 text-gray-400" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          How it works
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s) => (
          <div key={s.step} className="text-center space-y-1.5">
            <div
              className={`w-9 h-9 rounded-xl ${s.bgColor} mx-auto flex items-center justify-center`}
            >
              <span className={`text-xs font-bold ${s.color}`}>{s.step}</span>
            </div>
            <p className="text-xs font-semibold text-gray-700">{s.title}</p>
            <p className="text-[10px] text-gray-400 leading-relaxed hidden sm:block">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

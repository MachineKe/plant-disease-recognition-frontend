"use client";

import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Skull, TrendingUp } from "lucide-react";
import { PredictionResult, DiseaseClass, ClassBreakdown } from "@/types/prediction";
import GradCAMViewer from "./GradCAMViewer";

interface PredictionCardProps {
  result: PredictionResult;
}

// ---------------------------------------------------------------------------
// Per-disease config
// ---------------------------------------------------------------------------
const diseaseConfig: Record<
  DiseaseClass,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    barColor: string;
    icon: React.ReactNode;
    severity: string;
  }
> = {
  Healthy: {
    label: "Healthy Plant",
    color: "text-[#2E7D32]",
    bgColor: "bg-[#2E7D32]/10",
    borderColor: "border-[#2E7D32]/30",
    barColor: "bg-[#2E7D32]",
    icon: <ShieldCheck className="w-6 h-6 text-[#2E7D32]" />,
    severity: "No disease detected",
  },
  Powdery: {
    label: "Powdery Mildew",
    color: "text-[#F57C00]",
    bgColor: "bg-[#F57C00]/10",
    borderColor: "border-[#F57C00]/30",
    barColor: "bg-[#F57C00]",
    icon: <AlertTriangle className="w-6 h-6 text-[#F57C00]" />,
    severity: "Moderate infection",
  },
  Rust: {
    label: "Rust Disease",
    color: "text-[#D32F2F]",
    bgColor: "bg-[#D32F2F]/10",
    borderColor: "border-[#D32F2F]/30",
    barColor: "bg-[#D32F2F]",
    icon: <Skull className="w-6 h-6 text-[#D32F2F]" />,
    severity: "Severe infection",
  },
};

const classColors: Record<DiseaseClass, string> = {
  Healthy: "#2E7D32",
  Powdery: "#F57C00",
  Rust: "#D32F2F",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PredictionCard({ result }: PredictionCardProps) {
  const config = diseaseConfig[result.disease];
  // Robust error handling for unknown disease labels
  if (!config) {
    console.warn(`Unknown disease label encountered: ${result.disease}`);
    return (
      <div className="rounded-2xl border p-5 bg-red-50 border-red-200 text-red-700">
        <strong>Error:</strong> Unknown disease label: <code>{result.disease}</code>. Unable to display prediction card.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-5"
    >
      {/* Main result banner */}
      <div
        className={`rounded-2xl border p-5 ${config.bgColor} ${config.borderColor} flex items-start gap-4`}
      >
        <div className={`p-2.5 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-0.5">
                Detected Disease
              </p>
              <h2 className={`text-xl font-bold ${config.color} leading-tight`}>
                {config.label}
              </h2>
            </div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${config.bgColor} ${config.color} border ${config.borderColor}`}
            >
              {config.severity}
            </span>
          </div>

          {/* Confidence bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Model confidence
              </span>
              <span className={`font-bold text-sm ${config.color}`}>
                {result.confidence}%
              </span>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${config.barColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${result.confidence}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              />
            </div>
            <p className="text-[10px] text-gray-400">
              {result.confidence >= 80
                ? "High confidence — result is reliable"
                : result.confidence >= 60
                ? "Moderate confidence — consider re-scanning"
                : "Low confidence — manual inspection recommended"}
            </p>
          </div>
        </div>
      </div>


      {/* Class breakdown */}
      <ClassBreakdownChart
        breakdown={result.classBreakdown}
        detected={result.disease}
      />

      {/* Metadata footer */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100 pt-3">
        <span>
          Analyzed at{" "}
          {new Date(result.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span className="bg-gray-100 px-2.5 py-0.5 rounded-full">
          PlantGuard AI v1.0
        </span>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Class breakdown sub-component
// ---------------------------------------------------------------------------
function ClassBreakdownChart({
  breakdown,
  detected,
}: {
  breakdown: ClassBreakdown[];
  detected: DiseaseClass;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Class Breakdown</h3>
      <div className="space-y-2.5">
        {breakdown.map((cls, i) => (
          <motion.div
            key={cls.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.3 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: classColors[cls.label] }}
                />
                <span
                  className={`font-medium ${
                    cls.label === detected ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {cls.label}
                </span>
                {cls.label === detected && (
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                    predicted
                  </span>
                )}
              </div>
              <span
                className="font-bold text-xs"
                style={{ color: classColors[cls.label] }}
              >
                {cls.confidence}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: classColors[cls.label] }}
                initial={{ width: 0 }}
                animate={{ width: `${cls.confidence}%` }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 + i * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

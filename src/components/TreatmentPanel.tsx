"use client";

import { motion } from "framer-motion";
import {
  Sprout,
  ShieldCheck,
  FlaskConical,
  Droplets,
  Wind,
  Scissors,
  Sun,
  AlertOctagon,
} from "lucide-react";
import { DiseaseClass } from "@/types/prediction";

interface TreatmentPanelProps {
  disease: DiseaseClass;
}

// ---------------------------------------------------------------------------
// Treatment data per disease
// ---------------------------------------------------------------------------
const treatments: Record<
  DiseaseClass,
  {
    prevention: Array<{ icon: React.ReactNode; text: string }>;
    cure: Array<{ icon: React.ReactNode; text: string }>;
    urgency: "low" | "medium" | "high";
    summary: string;
  }
> = {
  Healthy: {
    urgency: "low",
    summary:
      "Your plant appears healthy! Follow these best practices to maintain its health.",
    prevention: [
      {
        icon: <Droplets className="w-4 h-4 text-blue-500" />,
        text: "Water at the base — avoid wetting foliage to minimize fungal risk.",
      },
      {
        icon: <Wind className="w-4 h-4 text-sky-400" />,
        text: "Ensure good air circulation by spacing plants properly.",
      },
      {
        icon: <Sun className="w-4 h-4 text-yellow-500" />,
        text: "Provide adequate sunlight (6–8 hours) for strong immune response.",
      },
      {
        icon: <Sprout className="w-4 h-4 text-[#2E7D32]" />,
        text: "Use balanced fertilizer to maintain optimal nutrient levels.",
      },
    ],
    cure: [
      {
        icon: <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />,
        text: "No treatment required. Continue routine maintenance.",
      },
      {
        icon: <Scissors className="w-4 h-4 text-gray-500" />,
        text: "Prune dead or yellowing leaves regularly to promote healthy growth.",
      },
    ],
  },
  Powdery: {
    urgency: "medium",
    summary:
      "Powdery mildew detected. Act promptly to prevent spread to neighboring plants.",
    prevention: [
      {
        icon: <Wind className="w-4 h-4 text-sky-400" />,
        text: "Improve air circulation — avoid overcrowding of plants.",
      },
      {
        icon: <Droplets className="w-4 h-4 text-blue-500" />,
        text: "Water in the morning so foliage dries before nightfall.",
      },
      {
        icon: <Scissors className="w-4 h-4 text-gray-500" />,
        text: "Remove and dispose of infected plant debris immediately.",
      },
      {
        icon: <Sprout className="w-4 h-4 text-[#2E7D32]" />,
        text: "Select resistant cultivars when replanting in affected areas.",
      },
    ],
    cure: [
      {
        icon: <FlaskConical className="w-4 h-4 text-[#F57C00]" />,
        text: "Apply potassium bicarbonate or neem oil spray every 7 days.",
      },
      {
        icon: <FlaskConical className="w-4 h-4 text-[#F57C00]" />,
        text: "Use sulfur-based fungicide as a contact treatment.",
      },
      {
        icon: <Scissors className="w-4 h-4 text-gray-500" />,
        text: "Prune heavily infected leaves; sanitize tools between cuts.",
      },
      {
        icon: <Droplets className="w-4 h-4 text-blue-500" />,
        text: "Diluted baking soda solution (1 tsp/L) can inhibit spore germination.",
      },
    ],
  },
  Rust: {
    urgency: "high",
    summary:
      "Rust disease identified. This is a serious fungal infection requiring immediate intervention.",
    prevention: [
      {
        icon: <Scissors className="w-4 h-4 text-gray-500" />,
        text: "Remove and burn infected plant material — do not compost.",
      },
      {
        icon: <Wind className="w-4 h-4 text-sky-400" />,
        text: "Isolate affected plants to prevent wind-spread of spores.",
      },
      {
        icon: <Droplets className="w-4 h-4 text-blue-500" />,
        text: "Avoid overhead irrigation; use drip irrigation instead.",
      },
      {
        icon: <Sprout className="w-4 h-4 text-[#2E7D32]" />,
        text: "Plant rust-resistant varieties in subsequent seasons.",
      },
    ],
    cure: [
      {
        icon: <FlaskConical className="w-4 h-4 text-[#D32F2F]" />,
        text: "Apply triazole-based fungicide (e.g., propiconazole) immediately.",
      },
      {
        icon: <FlaskConical className="w-4 h-4 text-[#D32F2F]" />,
        text: "Systemic fungicide treatment every 10–14 days until cleared.",
      },
      {
        icon: <AlertOctagon className="w-4 h-4 text-[#D32F2F]" />,
        text: "Consult a certified agronomist for severe or widespread infection.",
      },
      {
        icon: <Scissors className="w-4 h-4 text-gray-500" />,
        text: "Heavily prune affected sections and sterilize all tools used.",
      },
    ],
  },
};

const urgencyBadge: Record<
  "low" | "medium" | "high",
  { label: string; className: string }
> = {
  low: {
    label: "Low urgency",
    className: "bg-green-100 text-[#2E7D32] border-green-200",
  },
  medium: {
    label: "Medium urgency",
    className: "bg-orange-100 text-[#F57C00] border-orange-200",
  },
  high: {
    label: "High urgency",
    className: "bg-red-100 text-[#D32F2F] border-red-200",
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TreatmentPanel({ disease }: TreatmentPanelProps) {
  const data = treatments[disease];
  const badge = urgencyBadge[data.urgency];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2E7D32]/10 flex items-center justify-center">
            <Sprout className="w-4.5 h-4.5 text-[#2E7D32]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Treatment Guide</h3>
            <p className="text-[11px] text-gray-400">
              Evidence-based recommendations
            </p>
          </div>
        </div>
        <span
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Summary */}
        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
          {data.summary}
        </p>

        {/* Prevention */}
        <TreatmentSection
          title="Prevention"
          subtitle="Stop it from spreading"
          color="text-[#2E7D32]"
          bgColor="bg-green-50"
          borderColor="border-green-100"
          dotColor="bg-[#2E7D32]"
          items={data.prevention}
        />

        {/* Cure */}
        <TreatmentSection
          title="Treatment"
          subtitle="Active remediation steps"
          color={
            data.urgency === "high"
              ? "text-[#D32F2F]"
              : data.urgency === "medium"
              ? "text-[#F57C00]"
              : "text-[#2E7D32]"
          }
          bgColor={
            data.urgency === "high"
              ? "bg-red-50"
              : data.urgency === "medium"
              ? "bg-orange-50"
              : "bg-green-50"
          }
          borderColor={
            data.urgency === "high"
              ? "border-red-100"
              : data.urgency === "medium"
              ? "border-orange-100"
              : "border-green-100"
          }
          dotColor={
            data.urgency === "high"
              ? "bg-[#D32F2F]"
              : data.urgency === "medium"
              ? "bg-[#F57C00]"
              : "bg-[#2E7D32]"
          }
          items={data.cure}
        />

        {/* Disclaimer */}
        <p className="text-[10px] text-gray-400 text-center leading-relaxed">
          Recommendations are AI-generated. Always consult a certified agronomist for
          professional diagnosis.
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Section sub-component
// ---------------------------------------------------------------------------
function TreatmentSection({
  title,
  subtitle,
  color,
  bgColor,
  borderColor,
  dotColor,
  items,
}: {
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dotColor: string;
  items: Array<{ icon: React.ReactNode; text: string }>;
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-3 ${bgColor} ${borderColor}`}>
      <div>
        <h4 className={`text-sm font-bold ${color}`}>{title}</h4>
        <p className="text-[11px] text-gray-500">{subtitle}</p>
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.07, duration: 0.25 }}
            className="flex items-start gap-2.5"
          >
            <div className="mt-0.5 shrink-0">{item.icon}</div>
            <p className="text-xs text-gray-700 leading-relaxed">{item.text}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

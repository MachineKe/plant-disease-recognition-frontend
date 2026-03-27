import axios from "axios";
import { PredictionResult, DiseaseClass, ClassBreakdown } from "@/types/prediction";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// ---------------------------------------------------------------------------
// Actual API call – hits POST /api/predict
// ---------------------------------------------------------------------------
export async function predictDisease(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("image", file);

  // In development / demo mode we return a simulated result after a delay
  if (process.env.NODE_ENV === "development" || !API_BASE_URL) {
    return simulatePrediction(file);
  }

  const response = await apiClient.post<{
    disease: DiseaseClass;
    confidence: number;
    class_breakdown: Array<{ label: DiseaseClass; confidence: number }>;
    gradcam_image_url: string;
  }>("/api/predict", formData);

  const { data } = response;

  return {
    disease: data.disease,
    confidence: data.confidence,
    classBreakdown: data.class_breakdown.map((c) => ({
      label: c.label,
      confidence: c.confidence,
    })),
    gradcamImageUrl: data.gradcam_image_url,
    originalImageUrl: URL.createObjectURL(file),
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Simulation helper – realistic mock for demo / offline usage
// ---------------------------------------------------------------------------
async function simulatePrediction(file: File): Promise<PredictionResult> {
  // Artificial delay to mimic real inference
  await new Promise((resolve) => setTimeout(resolve, 2800));

  const diseases: DiseaseClass[] = ["Rust", "Powdery", "Healthy"];
  const detected: DiseaseClass = diseases[Math.floor(Math.random() * diseases.length)];

  const breakdowns: Record<DiseaseClass, ClassBreakdown[]> = {
    Rust: [
      { label: "Healthy", confidence: 7 },
      { label: "Powdery", confidence: 11 },
      { label: "Rust", confidence: 82 },
    ],
    Powdery: [
      { label: "Healthy", confidence: 5 },
      { label: "Powdery", confidence: 78 },
      { label: "Rust", confidence: 17 },
    ],
    Healthy: [
      { label: "Healthy", confidence: 91 },
      { label: "Powdery", confidence: 6 },
      { label: "Rust", confidence: 3 },
    ],
  };

  const confidence = breakdowns[detected].find((c) => c.label === detected)!.confidence;

  return {
    disease: detected,
    confidence,
    classBreakdown: breakdowns[detected],
    // Placeholder gradient for the Grad-CAM overlay in demo mode
    gradcamImageUrl: null,
    originalImageUrl: URL.createObjectURL(file),
    timestamp: new Date().toISOString(),
  };
}

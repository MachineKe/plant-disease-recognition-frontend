export type DiseaseClass = "Healthy" | "Powdery" | "Rust";

export interface ClassBreakdown {
  label: DiseaseClass;
  confidence: number; // 0–100
}

export interface PredictionResult {
  disease: DiseaseClass;
  confidence: number; // 0–100
  classBreakdown: ClassBreakdown[];
  gradcamImageUrl: string | null;
  originalImageUrl: string;
  timestamp: string;
}

export interface PredictionState {
  status: "idle" | "scanning" | "success" | "error";
  result: PredictionResult | null;
  error: string | null;
  uploadedFile: string | null; // base64 or object URL
  history: PredictionResult[];
}

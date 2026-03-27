"use client";

import { useCallback, useRef } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, ImageIcon, X, Leaf } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { setUploadedFile, runPrediction } from "@/store/predictionSlice";
import Image from "next/image";

interface ImageUploadProps {
  previewUrl: string | null;
  onClear: () => void;
}

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

export default function ImageUpload({ previewUrl, onClear }: ImageUploadProps) {
  const dispatch = useAppDispatch();
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const objectUrl = URL.createObjectURL(file);
      dispatch(setUploadedFile(objectUrl));
      dispatch(runPrediction(file));
    },
    [dispatch]
  );

  const onDrop = useCallback(
    (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) return;
      if (accepted.length > 0) processFile(accepted[0]);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
    multiple: false,
  });

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const borderColor = isDragReject
    ? "border-[#D32F2F]"
    : isDragActive
    ? "border-[#2E7D32]"
    : "border-gray-200 hover:border-[#2E7D32]";

  const bgColor = isDragReject
    ? "bg-red-50"
    : isDragActive
    ? "bg-green-50"
    : "bg-white hover:bg-gray-50/60";

  return (
    <div className="w-full space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${borderColor} ${bgColor}`}
      >
        <input {...getInputProps()} />

        <AnimatePresence mode="wait">
          {previewUrl ? (
            /* Preview state */
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative"
            >
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Uploaded plant image"
                  fill
                  className="object-contain"
                  unoptimized
                />
                {/* Dark overlay with "change image" hint */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                  <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg">
                    Click to change image
                  </span>
                </div>
              </div>

              {/* Clear button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#D32F2F] hover:shadow-lg transition-all z-10"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            /* Empty state */
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center"
            >
              {/* Icon area */}
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
                    isDragActive
                      ? "bg-[#2E7D32]/20"
                      : isDragReject
                      ? "bg-red-100"
                      : "bg-gray-100"
                  }`}
                >
                  {isDragActive ? (
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <Upload
                        className="w-10 h-10 text-[#2E7D32]"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  ) : isDragReject ? (
                    <X className="w-10 h-10 text-[#D32F2F]" strokeWidth={1.5} />
                  ) : (
                    <ImageIcon
                      className="w-10 h-10 text-gray-400"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
                {/* Leaf badge */}
                {!isDragActive && !isDragReject && (
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#2E7D32] flex items-center justify-center shadow-sm">
                    <Leaf className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="space-y-1">
                {isDragActive ? (
                  <p className="text-[#2E7D32] font-semibold text-lg">
                    Release to analyze
                  </p>
                ) : isDragReject ? (
                  <p className="text-[#D32F2F] font-semibold text-lg">
                    File type not supported
                  </p>
                ) : (
                  <>
                    <p className="text-gray-700 font-semibold text-lg">
                      Drop your plant photo here
                    </p>
                    <p className="text-gray-400 text-sm">
                      or{" "}
                      <span className="text-[#2E7D32] underline underline-offset-2 font-medium">
                        browse files
                      </span>
                    </p>
                  </>
                )}
              </div>

              {/* Supported formats */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {["JPG", "PNG", "WEBP"].map((fmt) => (
                  <span
                    key={fmt}
                    className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium"
                  >
                    {fmt}
                  </span>
                ))}
                <span className="text-xs text-gray-400">· Max {MAX_SIZE_MB}MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Camera capture – mobile-focused */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400 font-medium">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Hidden native camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraCapture}
      />

      <button
        type="button"
        onClick={() => cameraInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-[#2E7D32] hover:text-[#2E7D32] hover:bg-green-50/50 transition-all shadow-sm active:scale-[0.98]"
      >
        <Camera className="w-4 h-4" />
        Take Photo with Camera
        <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full ml-1">
          Mobile
        </span>
      </button>
    </div>
  );
}

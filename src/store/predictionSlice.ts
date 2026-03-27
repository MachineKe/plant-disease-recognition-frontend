"use client";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PredictionResult, PredictionState } from "@/types/prediction";
import { predictDisease } from "@/services/predictionApi";

const initialState: PredictionState = {
  status: "idle",
  result: null,
  error: null,
  uploadedFile: null,
  history: [],
};

export const runPrediction = createAsyncThunk<
  PredictionResult,
  File,
  { rejectValue: string }
>("prediction/run", async (file: File, { rejectWithValue }) => {
  try {
    const result = await predictDisease(file);
    return result;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Prediction failed. Please try again.";
    return rejectWithValue(message);
  }
});

const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    setUploadedFile(state, action: PayloadAction<string | null>) {
      state.uploadedFile = action.payload;
    },
    resetPrediction(state) {
      state.status = "idle";
      state.result = null;
      state.error = null;
      state.uploadedFile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runPrediction.pending, (state) => {
        state.status = "scanning";
        state.error = null;
        state.result = null;
      })
      .addCase(runPrediction.fulfilled, (state, action) => {
        state.status = "success";
        state.result = action.payload;
        // Add to history, keep only last 20
        state.history = [action.payload, ...state.history.slice(0, 19)];
      })
      .addCase(runPrediction.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? "Unknown error occurred.";
      });
  },
});

export const { setUploadedFile, resetPrediction } = predictionSlice.actions;
export default predictionSlice.reducer;

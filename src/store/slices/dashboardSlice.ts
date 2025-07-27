import { createSlice } from "@reduxjs/toolkit";

// State interface - minimal UI state for dashboard
export interface DashboardState {
  refreshCount: number; // For forcing manual refresh if needed
}

// Initial state
const initialState: DashboardState = {
  refreshCount: 0,
};

// Slice - minimal UI state management
const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    incrementRefreshCount: (state) => {
      state.refreshCount += 1;
    },
    resetRefreshCount: (state) => {
      state.refreshCount = 0;
    },
  },
});

export const { incrementRefreshCount, resetRefreshCount } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;

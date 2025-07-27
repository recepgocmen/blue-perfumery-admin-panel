import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selector
const selectDashboardState = (state: RootState) => state.dashboard;

// Memoized selectors for UI state only
export const selectDashboardRefreshCount = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.refreshCount
);

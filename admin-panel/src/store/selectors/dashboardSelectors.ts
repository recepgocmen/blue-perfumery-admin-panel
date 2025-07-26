import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selector
const selectDashboardState = (state: RootState) => state.dashboard;

// Memoized selectors
export const selectDashboardStats = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.stats
);

export const selectDashboardLoading = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.loading
);

export const selectDashboardError = createSelector(
  [selectDashboardState],
  (dashboardState) => dashboardState.error
);

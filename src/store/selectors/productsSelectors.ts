import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selector
const selectProductsState = (state: RootState) => state.products;

// Memoized selectors for UI state only
export const selectProductsPagination = createSelector(
  [selectProductsState],
  (productsState) => productsState.pagination
);

export const selectProductsFilters = createSelector(
  [selectProductsState],
  (productsState) => productsState.filters
);

export const selectProductsSortParams = createSelector(
  [selectProductsState],
  (productsState) => productsState.sortParams
);

// Note: Data-related selectors (products list, individual products, etc.)
// have been moved to React Query hooks in src/hooks/useProducts.ts
// Use useProducts() and useProduct() hooks instead of Redux selectors for data

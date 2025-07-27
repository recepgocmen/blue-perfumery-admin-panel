import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductFilters, PaginationParams, SortParams } from "../../types";

// State interface - only UI state, no data fetching
export interface ProductsState {
  filters: ProductFilters;
  pagination: PaginationParams;
  sortParams: SortParams;
}

// Initial state
const initialState: ProductsState = {
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
  },
  sortParams: {},
};

// Slice - only UI state management
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
      // Reset to first page when filters change
      state.pagination.page = 1;
    },
    setSortParams: (state, action: PayloadAction<SortParams>) => {
      state.sortParams = action.payload;
      // Reset to first page when sorting changes
      state.pagination.page = 1;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<PaginationParams>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    resetSort: (state) => {
      state.sortParams = {};
      state.pagination.page = 1;
    },
    resetPagination: (state) => {
      state.pagination = {
        page: 1,
        limit: 10,
      };
    },
  },
});

export const {
  setFilters,
  setSortParams,
  setPagination,
  resetFilters,
  resetSort,
  resetPagination,
} = productsSlice.actions;

export default productsSlice.reducer;

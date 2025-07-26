import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { Product } from "../../types";

// Base selector
const selectProductsState = (state: RootState) => state.products;

// Memoized selectors
export const selectProducts = createSelector(
  [selectProductsState],
  (productsState) => productsState.products
);

export const selectSelectedProduct = createSelector(
  [selectProductsState],
  (productsState) => productsState.selectedProduct
);

export const selectProductsLoading = createSelector(
  [selectProductsState],
  (productsState) => productsState.loading
);

export const selectProductsError = createSelector(
  [selectProductsState],
  (productsState) => productsState.error
);

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

// Computed selectors
export const selectProductById = createSelector(
  [selectProducts, (state: RootState, productId: string) => productId],
  (products, productId) =>
    products.find((product: Product) => product.id === productId)
);

export const selectActiveProducts = createSelector(
  [selectProducts],
  (products) =>
    products.filter((product: Product) => product.status === "active")
);

export const selectProductsByCategory = createSelector(
  [selectProducts, (state: RootState, category: string) => category],
  (products, category) =>
    products.filter((product: Product) => product.category === category)
);

export const selectLowStockProducts = createSelector(
  [selectProducts, (state: RootState, threshold: number = 10) => threshold],
  (products, threshold) =>
    products.filter((product: Product) => product.stock <= threshold)
);

export const selectProductCategories = createSelector(
  [selectProducts],
  (products) => {
    const categories = products.map((product: Product) => product.category);
    return Array.from(new Set(categories));
  }
);

// Enhanced filtering with search and category - memoized for performance
export const selectFilteredProducts = createSelector(
  [selectProducts, selectProductsFilters],
  (products, filters) => {
    return products.filter((product: Product) => {
      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Price range filters
      if (filters.priceMin && product.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && product.price > filters.priceMax) {
        return false;
      }

      // Search filter - searches in name, description, and SKU
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchableText =
          `${product.name} ${product.description} ${product.sku}`.toLowerCase();

        // Split search into keywords and check if all keywords match
        const keywords = searchLower
          .split(" ")
          .filter((keyword: string) => keyword.trim() !== "");
        if (keywords.length > 0) {
          return keywords.every((keyword: string) =>
            searchableText.includes(keyword)
          );
        }
      }

      return true;
    });
  }
);

// Get available categories from current products
export const selectAvailableCategories = createSelector(
  [selectProducts],
  (products) => {
    const categories = products
      .map((product: Product) => product.category)
      .filter(
        (category: string, index: number, array: string[]) =>
          array.indexOf(category) === index
      )
      .sort();
    return categories;
  }
);

// Get search suggestions based on product names
export const selectSearchSuggestions = createSelector(
  [selectProducts, (state: RootState, searchQuery: string) => searchQuery],
  (products, searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) return [];

    const query = searchQuery.toLowerCase();
    return products
      .filter(
        (product: Product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      )
      .map((product: Product) => product.name)
      .slice(0, 5); // Limit to 5 suggestions
  }
);

// Statistics selectors
export const selectProductStats = createSelector(
  [selectFilteredProducts],
  (filteredProducts) => {
    return {
      total: filteredProducts.length,
      active: filteredProducts.filter((p: Product) => p.status === "active")
        .length,
      inactive: filteredProducts.filter((p: Product) => p.status === "inactive")
        .length,
      discontinued: filteredProducts.filter(
        (p: Product) => p.status === "discontinued"
      ).length,
      lowStock: filteredProducts.filter((p: Product) => p.stock <= 10).length,
      averagePrice:
        filteredProducts.length > 0
          ? filteredProducts.reduce(
              (sum: number, p: Product) => sum + p.price,
              0
            ) / filteredProducts.length
          : 0,
    };
  }
);

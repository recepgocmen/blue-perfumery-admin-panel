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
  [selectProducts, (_state: RootState, productId: string) => productId],
  (products, productId) => products.find((product) => product.id === productId)
);

// Perfume-specific selectors
export const selectProductsByCategory = createSelector(
  [selectProducts, (_state: RootState, category: string) => category],
  (products, category) =>
    products.filter((product: Product) => product.category === category)
);

export const selectProductsByGender = createSelector(
  [selectProducts, (_state: RootState, gender: string) => gender],
  (products, gender) =>
    products.filter((product: Product) => product.gender === gender)
);

export const selectLowStockProducts = createSelector(
  [selectProducts, (_state: RootState, threshold: number = 10) => threshold],
  (products, threshold) =>
    products.filter((product: Product) => product.stock <= threshold)
);

// Available options selectors
export const selectAvailableCategories = createSelector(
  [selectProducts],
  (products) => {
    const categories = products.map((product: Product) => product.category);
    return Array.from(new Set(categories));
  }
);

export const selectAvailableBrands = createSelector(
  [selectProducts],
  (products) => {
    const brands = products.map((product: Product) => product.brand);
    return Array.from(new Set(brands));
  }
);

export const selectAvailableGenders = createSelector(
  [selectProducts],
  (products) => {
    const genders = products.map((product: Product) => product.gender);
    return Array.from(new Set(genders));
  }
);

export const selectAvailableCharacteristics = createSelector(
  [selectProducts],
  (products) => {
    const characteristics = products.flatMap(
      (product: Product) => product.characteristics
    );
    return Array.from(new Set(characteristics));
  }
);

export const selectAvailableNotes = createSelector(
  [selectProducts],
  (products) => {
    const notes = products.flatMap((product: Product) => product.notes);
    return Array.from(new Set(notes));
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

      // Gender filter
      if (filters.gender && product.gender !== filters.gender) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand !== filters.brand) {
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

      // Characteristics filter
      if (filters.characteristics && filters.characteristics.length > 0) {
        const hasCharacteristic = filters.characteristics.some((char) =>
          product.characteristics.includes(char)
        );
        if (!hasCharacteristic) return false;
      }

      // Notes filter
      if (filters.notes && filters.notes.length > 0) {
        const hasNote = filters.notes.some((note) =>
          product.notes.includes(note)
        );
        if (!hasNote) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.characteristics.some((char) =>
            char.toLowerCase().includes(searchLower)
          ) ||
          product.notes.some((note) =>
            note.toLowerCase().includes(searchLower)
          );

        if (!matchesSearch) {
          return false;
        }
      }

      return true;
    });
  }
);

// Search products by query - memoized for performance
export const selectSearchedProducts = createSelector(
  [selectProducts, (_state: RootState, searchQuery: string) => searchQuery],
  (products, searchQuery) => {
    if (!searchQuery) return products;

    const query = searchQuery.toLowerCase();
    return products.filter(
      (product: Product) =>
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.characteristics.some((char) =>
          char.toLowerCase().includes(query)
        ) ||
        product.notes.some((note) => note.toLowerCase().includes(query))
    );
  }
);

// Product statistics
export const selectProductStats = createSelector(
  [selectProducts],
  (products) => {
    const totalProducts = products.length;
    const activeProducts = products.filter((p) => p.status === "active").length;
    const lowStockProducts = products.filter((p) => p.stock <= 10).length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const averagePrice =
      totalProducts > 0
        ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts
        : 0;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    products.forEach((p) => {
      categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
    });

    // Gender breakdown
    const genderBreakdown: Record<string, number> = {};
    products.forEach((p) => {
      genderBreakdown[p.gender] = (genderBreakdown[p.gender] || 0) + 1;
    });

    // Brand breakdown
    const brandBreakdown: Record<string, number> = {};
    products.forEach((p) => {
      brandBreakdown[p.brand] = (brandBreakdown[p.brand] || 0) + 1;
    });

    return {
      total: totalProducts,
      active: activeProducts,
      lowStock: lowStockProducts,
      totalValue,
      averagePrice,
      categoryBreakdown,
      genderBreakdown,
      brandBreakdown,
    };
  }
);

// Category-specific selectors for dashboard
export const selectProductCategories = createSelector(
  [selectProducts],
  (products) => {
    const categories = products.map((product: Product) => product.category);
    return Array.from(new Set(categories));
  }
);

export const selectNicheProducts = createSelector(
  [selectProducts],
  (products) =>
    products.filter(
      (product: Product) =>
        product.category === "niches" ||
        product.brand.includes("Exclusive") ||
        product.brand.includes("Artisanal")
    )
);

export const selectLuxuryProducts = createSelector(
  [selectProducts],
  (products) =>
    products.filter(
      (product: Product) =>
        product.category === "luxury" ||
        product.category === "premium" ||
        product.price > 1000
    )
);

export const selectUrbanProducts = createSelector(
  [selectProducts],
  (products) =>
    products.filter(
      (product: Product) => product.category === "urban" || product.price < 800
    )
);

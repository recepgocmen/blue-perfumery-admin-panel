import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";
import type { Product } from "../../types";

// Base selector for favorites state
const selectFavoritesState = (state: RootState) => state.favorites;

// Basic selectors - following Context7 memoization patterns
export const selectFavoriteProducts = createSelector(
  [selectFavoritesState],
  (favoritesState) => favoritesState.favoriteProducts
);

export const selectFavoritesLoading = createSelector(
  [selectFavoritesState],
  (favoritesState) => favoritesState.loading
);

export const selectFavoritesError = createSelector(
  [selectFavoritesState],
  (favoritesState) => favoritesState.error
);

// Computed selectors - following Context7 patterns for derived state
export const selectFavoritesCount = createSelector(
  [selectFavoriteProducts],
  (favoriteProducts) => favoriteProducts.length
);

// Check if a specific product is favorited - following Context7 selector patterns
export const selectIsProductFavorited = createSelector(
  [selectFavoriteProducts, (_state: RootState, productId: string) => productId],
  (favoriteProducts, productId) =>
    favoriteProducts.some((product: Product) => product.id === productId)
);

// Get favorite products by category
export const selectFavoriteProductsByCategory = createSelector(
  [selectFavoriteProducts, (_state: RootState, category: string) => category],
  (favoriteProducts, category) =>
    favoriteProducts.filter((product: Product) => product.category === category)
);

// Get favorite product IDs (useful for quick lookups)
export const selectFavoriteProductIds = createSelector(
  [selectFavoriteProducts],
  (favoriteProducts) => favoriteProducts.map((product: Product) => product.id)
);

// Get categories from favorite products
export const selectFavoriteCategories = createSelector(
  [selectFavoriteProducts],
  (favoriteProducts) => {
    const categories = favoriteProducts
      .map((product: Product) => product.category)
      .filter(
        (category: string, index: number, array: string[]) =>
          array.indexOf(category) === index
      )
      .sort();
    return categories;
  }
);

// Get favorites statistics
export const selectFavoritesStats = createSelector(
  [selectFavoriteProducts],
  (favoriteProducts) => {
    return {
      totalFavorites: favoriteProducts.length,
      totalValue: favoriteProducts.reduce(
        (sum: number, product: Product) => sum + product.price,
        0
      ),
      averagePrice:
        favoriteProducts.length > 0
          ? favoriteProducts.reduce(
              (sum: number, product: Product) => sum + product.price,
              0
            ) / favoriteProducts.length
          : 0,
      categoryCounts: favoriteProducts.reduce(
        (acc: Record<string, number>, product: Product) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        },
        {}
      ),
    };
  }
);

// Check if favorites is empty
export const selectIsFavoritesEmpty = createSelector(
  [selectFavoriteProducts],
  (favoriteProducts) => favoriteProducts.length === 0
);

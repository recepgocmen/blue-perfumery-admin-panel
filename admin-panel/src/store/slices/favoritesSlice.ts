import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types";

// Favorites state interface
export interface FavoritesState {
  favoriteProducts: Product[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: FavoritesState = {
  favoriteProducts: [],
  loading: false,
  error: null,
};

// Favorites slice following Context7 React patterns
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    // Add product to favorites - following Context7 reducer patterns
    addToFavorites: (state, action: PayloadAction<Product>) => {
      const product = action.payload;

      // Check if product is already in favorites
      const existingIndex = state.favoriteProducts.findIndex(
        (item: Product) => item.id === product.id
      );

      if (existingIndex === -1) {
        // Add to favorites if not already present
        state.favoriteProducts.push(product);
      }
    },

    // Remove product from favorites - following Context7 reducer patterns
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // Filter out the product with matching ID
      state.favoriteProducts = state.favoriteProducts.filter(
        (product: Product) => product.id !== productId
      );
    },

    // Toggle favorite status - convenient action for UI
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingIndex = state.favoriteProducts.findIndex(
        (item: Product) => item.id === product.id
      );

      if (existingIndex === -1) {
        // Add to favorites if not present
        state.favoriteProducts.push(product);
      } else {
        // Remove from favorites if present
        state.favoriteProducts.splice(existingIndex, 1);
      }
    },

    // Clear all favorites
    clearFavorites: (state) => {
      state.favoriteProducts = [];
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export action creators - following Context7 patterns
export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  setLoading,
  setError,
  clearError,
} = favoritesSlice.actions;

// Export reducer
export default favoritesSlice.reducer;

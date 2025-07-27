import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./slices/usersSlice";
import productsReducer from "./slices/productsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import favoritesReducer from "./slices/favoritesSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    products: productsReducer,
    dashboard: dashboardReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selector
const selectUsersState = (state: RootState) => state.users;

// Memoized selectors for UI state only
export const selectUsersPagination = createSelector(
  [selectUsersState],
  (usersState) => usersState.pagination
);

export const selectUsersFilters = createSelector(
  [selectUsersState],
  (usersState) => usersState.filters
);

export const selectUsersSortParams = createSelector(
  [selectUsersState],
  (usersState) => usersState.sortParams
);

// Note: Data-related selectors (users list, individual users, etc.)
// have been moved to React Query hooks in src/hooks/useUsers.ts
// Use useUsers() and useUser() hooks instead of Redux selectors for data

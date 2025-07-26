import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../index";

// Base selector
const selectUsersState = (state: RootState) => state.users;

// Memoized selectors
export const selectUsers = createSelector(
  [selectUsersState],
  (usersState) => usersState.users
);

export const selectSelectedUser = createSelector(
  [selectUsersState],
  (usersState) => usersState.selectedUser
);

export const selectUsersLoading = createSelector(
  [selectUsersState],
  (usersState) => usersState.loading
);

export const selectUsersError = createSelector(
  [selectUsersState],
  (usersState) => usersState.error
);

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

// Computed selectors
export const selectUserById = createSelector(
  [selectUsers, (state: RootState, userId: string) => userId],
  (users, userId) => users.find((user) => user.id === userId)
);

export const selectActiveUsers = createSelector([selectUsers], (users) =>
  users.filter((user) => user.status === "active")
);

export const selectUsersByRole = createSelector(
  [selectUsers, (state: RootState, role: string) => role],
  (users, role) => users.filter((user) => user.role === role)
);

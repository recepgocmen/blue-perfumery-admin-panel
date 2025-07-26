import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  User,
  UserFilters,
  PaginationParams,
  SortParams,
  PaginatedResponse,
} from "../../types";
import { userApi } from "../../services/mock-api";

// State interface
export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: UserFilters;
  sortParams: SortParams;
}

// Initial state
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  sortParams: {},
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    params: {
      filters?: UserFilters;
      pagination?: PaginationParams;
      sort?: SortParams;
    } = {}
  ) => {
    const response = await userApi.getUsers(
      params.filters,
      params.pagination,
      params.sort
    );
    return response;
  }
);

export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id: string) => {
    const response = await userApi.getUser(id);
    return response.data;
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: Parameters<typeof userApi.createUser>[0]) => {
    const response = await userApi.createUser(userData);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: Parameters<typeof userApi.updateUser>[0]) => {
    const response = await userApi.updateUser(userData);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string) => {
    await userApi.deleteUser(id);
    return id;
  }
);

// Slice
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload;
    },
    setSortParams: (state, action: PayloadAction<SortParams>) => {
      state.sortParams = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<UsersState["pagination"]>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUsers.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<User>>) => {
          state.loading = false;
          state.users = action.payload.data;
          state.pagination = {
            page: action.payload.page,
            limit: action.payload.limit,
            total: action.payload.total,
            totalPages: action.payload.totalPages,
          };
        }
      )
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      // Fetch user by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.selectedUser = action.payload;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })

      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.users.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create user";
      })

      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.pagination.total -= 1;
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
      });
  },
});

export const {
  setFilters,
  setSortParams,
  setPagination,
  clearSelectedUser,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;

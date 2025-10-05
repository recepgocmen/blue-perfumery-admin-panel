import apiClient, { handleApiError } from "../../config/api";
import type {
  User,
  CreateUserData,
  UpdateUserData,
  ApiResponse,
  PaginatedResponse,
  UserFilters,
  PaginationParams,
  SortParams,
} from "../../types";

/**
 * User API Service
 * All user-related API calls
 */
export const userApi = {
  /**
   * Get all users with filters, pagination, and sorting
   */
  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationParams = {},
    sort: SortParams = {}
  ): Promise<PaginatedResponse<User>> {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (pagination.page) params.append("page", pagination.page.toString());
      if (pagination.limit) params.append("limit", pagination.limit.toString());

      // Add filters
      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);

      // Add sorting
      if (sort.sortBy) params.append("sortBy", sort.sortBy);
      if (sort.sortOrder) params.append("sortOrder", sort.sortOrder);

      const response = await apiClient.get<PaginatedResponse<User>>(
        `/users?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching users:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Get single user by ID
   */
  async getUser(id: string): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.post<ApiResponse<User>>("/users", data);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Update existing user
   */
  async updateUser(data: UpdateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await apiClient.put<ApiResponse<User>>(
        `/users/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await apiClient.delete<ApiResponse<{ id: string }>>(
        `/users/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", handleApiError(error));
      throw error;
    }
  },
};


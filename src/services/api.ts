/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Real API Service
 * Connects to blueperfumery-backend API
 */

import apiClient from "../lib/api-client";
import type {
  User,
  Product,
  CreateUserData,
  UpdateUserData,
  CreateProductData,
  UpdateProductData,
  ApiResponse,
  PaginatedResponse,
  UserFilters,
  ProductFilters,
  PaginationParams,
  SortParams,
} from "../types";

// Helper function to build query params
const buildQueryParams = (
  filters: Record<string, any> = {},
  pagination: PaginationParams = {},
  sort: SortParams = {}
): string => {
  const params = new URLSearchParams();

  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v.toString()));
      } else {
        params.append(key, value.toString());
      }
    }
  });

  // Add pagination
  if (pagination.page) params.append("page", pagination.page.toString());
  if (pagination.limit) params.append("limit", pagination.limit.toString());

  // Add sorting
  if (sort.sortBy) params.append("sortBy", sort.sortBy);
  if (sort.sortOrder) params.append("sortOrder", sort.sortOrder);

  return params.toString();
};

// User API
export const userApi = {
  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationParams = {},
    sort: SortParams = {}
  ): Promise<PaginatedResponse<User>> {
    const queryString = buildQueryParams(filters, pagination, sort);
    const { data } = await apiClient.get(`/users?${queryString}`);

    // Transform backend response to match our PaginatedResponse type
    return {
      data: data.data,
      total: data.pagination.total,
      page: data.pagination.page,
      limit: data.pagination.limit,
      totalPages: data.pagination.totalPages,
    };
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    const { data } = await apiClient.get(`/users/${id}`);
    return {
      data: data.data,
      message: data.message || "User retrieved successfully",
      success: data.success,
    };
  },

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    const { data } = await apiClient.post("/users", userData);
    return {
      data: data.data,
      message: data.message || "User created successfully",
      success: data.success,
    };
  },

  async updateUser(userData: UpdateUserData): Promise<ApiResponse<User>> {
    const { data } = await apiClient.put(`/users/${userData.id}`, userData);
    return {
      data: data.data,
      message: data.message || "User updated successfully",
      success: data.success,
    };
  },

  async deleteUser(id: string): Promise<ApiResponse<{ id: string }>> {
    const { data } = await apiClient.delete(`/users/${id}`);
    return {
      data: { id },
      message: data.message || "User deleted successfully",
      success: data.success,
    };
  },
};

// Product API
export const productApi = {
  async getProducts(
    filters: ProductFilters = {},
    pagination: PaginationParams = {},
    sort: SortParams = {}
  ): Promise<PaginatedResponse<Product>> {
    const queryString = buildQueryParams(filters, pagination, sort);
    const { data } = await apiClient.get(`/products?${queryString}`);

    return {
      data: data.data,
      total: data.pagination.total,
      page: data.pagination.page,
      limit: data.pagination.limit,
      totalPages: data.pagination.totalPages,
    };
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.get(`/products/${id}`);
    return {
      data: data.data,
      message: data.message || "Product retrieved successfully",
      success: data.success,
    };
  },

  async createProduct(
    productData: CreateProductData
  ): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.post("/products", productData);
    return {
      data: data.data,
      message: data.message || "Product created successfully",
      success: data.success,
    };
  },

  async updateProduct(
    productData: UpdateProductData
  ): Promise<ApiResponse<Product>> {
    const { data } = await apiClient.put(
      `/products/${productData.id}`,
      productData
    );
    return {
      data: data.data,
      message: data.message || "Product updated successfully",
      success: data.success,
    };
  },

  async deleteProduct(id: string): Promise<ApiResponse<{ id: string }>> {
    const { data } = await apiClient.delete(`/products/${id}`);
    return {
      data: { id },
      message: data.message || "Product deleted successfully",
      success: data.success,
    };
  },

  async getBrands(): Promise<string[]> {
    const { data } = await apiClient.get("/products/brands");
    return data.data;
  },

  async getCategories(): Promise<string[]> {
    const { data } = await apiClient.get("/products/categories");
    return data.data;
  },
};

// Dashboard API
export const dashboardApi = {
  async getStats(): Promise<
    ApiResponse<{
      totalUsers: number;
      totalProducts: number;
      activeUsers: number;
      activeProducts: number;
      revenue: number;
      growth: number;
    }>
  > {
    // For now, calculate from products and users
    // TODO: Create dedicated stats endpoint in backend
    const [productsRes, usersRes] = await Promise.all([
      apiClient.get("/products?limit=1000"),
      apiClient.get("/users?limit=1000"),
    ]);

    const products = productsRes.data.data as Product[];
    const users = usersRes.data.data as User[];

    const stats = {
      totalUsers: users.length,
      totalProducts: products.length,
      activeUsers: users.filter((u: User) => u.status === "active").length,
      activeProducts: products.filter((p: Product) => p.status === "active")
        .length,
      revenue: products.reduce(
        (sum: number, p: Product) => sum + p.price * (p.stock || 0),
        0
      ),
      growth: 12.5, // Mock for now
    };

    return {
      data: stats,
      message: "Dashboard stats retrieved successfully",
      success: true,
    };
  },
};

// Export all APIs
export const api = {
  users: userApi,
  products: productApi,
  dashboard: dashboardApi,
};

export default api;

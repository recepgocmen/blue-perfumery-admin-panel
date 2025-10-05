import apiClient, { handleApiError } from "../../config/api";
import type {
  Product,
  CreateProductData,
  UpdateProductData,
  ApiResponse,
  PaginatedResponse,
  ProductFilters,
  PaginationParams,
  SortParams,
} from "../../types";

/**
 * Product API Service
 * All product-related API calls
 */
export const productApi = {
  /**
   * Get all products with filters, pagination, and sorting
   */
  async getProducts(
    filters: ProductFilters = {},
    pagination: PaginationParams = {},
    sort: SortParams = {}
  ): Promise<PaginatedResponse<Product>> {
    try {
      const params = new URLSearchParams();

      // Add pagination
      if (pagination.page) params.append("page", pagination.page.toString());
      if (pagination.limit) params.append("limit", pagination.limit.toString());

      // Add filters
      if (filters.category) params.append("category", filters.category);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      if (filters.priceMin)
        params.append("minPrice", filters.priceMin.toString());
      if (filters.priceMax)
        params.append("maxPrice", filters.priceMax.toString());

      // Add sorting
      if (sort.sortBy) params.append("sortBy", sort.sortBy);
      if (sort.sortOrder) params.append("sortOrder", sort.sortOrder);

      const response = await apiClient.get<PaginatedResponse<Product>>(
        `/products?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Get single product by ID
   */
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      const response = await apiClient.get<ApiResponse<Product>>(
        `/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Create new product
   */
  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    try {
      const response = await apiClient.post<ApiResponse<Product>>(
        "/products",
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating product:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Update existing product
   */
  async updateProduct(data: UpdateProductData): Promise<ApiResponse<Product>> {
    try {
      const response = await apiClient.put<ApiResponse<Product>>(
        `/products/${data.id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error updating product:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(id: string): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await apiClient.delete<ApiResponse<{ id: string }>>(
        `/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Get all unique brands
   */
  async getBrands(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        "/products/brands"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching brands:", handleApiError(error));
      throw error;
    }
  },

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const response = await apiClient.get<ApiResponse<string[]>>(
        "/products/categories"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", handleApiError(error));
      throw error;
    }
  },
};


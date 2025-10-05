/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient, { handleApiError } from "../../config/api";
import type { ApiResponse } from "../../types";

/**
 * Dashboard API Service
 * All dashboard/stats-related API calls
 */

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  activeUsers: number;
  activeProducts: number;
  revenue: number;
  growth: number;
}

export const dashboardApi = {
  /**
   * Get dashboard statistics
   * Note: This endpoint might need to be created in backend
   * For now, we'll calculate from products and users
   */
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // Try to get stats from a dedicated endpoint
      // If it doesn't exist, we'll calculate from individual endpoints
      try {
        const response = await apiClient.get<ApiResponse<DashboardStats>>(
          "/dashboard/stats"
        );
        return response.data;
      } catch {
        // Fallback: Calculate stats from products and users
        const [productsRes, usersRes] = await Promise.all([
          apiClient.get("/products?limit=1000&status=active"),
          apiClient.get("/users?limit=1000"),
        ]);

        const products = productsRes.data.data || [];
        const users = usersRes.data.data || [];

        const stats: DashboardStats = {
          totalUsers: usersRes.data.pagination?.total || users.length,
          totalProducts: productsRes.data.pagination?.total || products.length,
          activeUsers: users.filter((u: any) => u.status === "active").length,
          activeProducts: products.length,
          revenue: products.reduce(
            (sum: number, p: any) => sum + (p.price * p.stock || 0),
            0
          ),
          growth: 12.5, // Mock growth percentage
        };

        return {
          success: true,
          message: "Dashboard stats calculated",
          data: stats,
        };
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", handleApiError(error));
      throw error;
    }
  },
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { useDispatch } from "react-redux";
import { productApi } from "../services/mock-api";
import { removeFromFavorites } from "../store/slices/favoritesSlice";
import type {
  ProductFilters,
  PaginationParams,
  SortParams,
  CreateProductData,
  UpdateProductData,
} from "../types";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (
    filters: ProductFilters,
    pagination: PaginationParams,
    sort: SortParams
  ) => [...productKeys.lists(), { filters, pagination, sort }] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

export const useProducts = (
  filters: ProductFilters = {},
  pagination: PaginationParams = {},
  sort: SortParams = {}
) => {
  return useQuery({
    queryKey: productKeys.list(filters, pagination, sort),
    queryFn: () => productApi.getProducts(filters, pagination, sort),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useProduct = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getProduct(id).then((response) => response.data),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => productApi.createProduct(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      notification.success({
        message: "Product Created",
        description: response.message || "Product created successfully",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message || "Failed to create product",
      });
    },
  });
};

// Hook for updating a product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProductData) => productApi.updateProduct(data),
    onSuccess: (response, variables) => {
      // Update the product in cache
      queryClient.setQueryData(productKeys.detail(variables.id), response.data);

      // Invalidate products list to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      notification.success({
        message: "Product Updated",
        description: response.message || "Product updated successfully",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update product",
      });
    },
  });
};

// Hook for deleting a product - following Context7 mutation patterns
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: (response, productId) => {
      // Remove product from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(productId) });

      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });

      // Remove from favorites if it was favorited - following Context7 state update patterns
      dispatch(removeFromFavorites(productId));

      notification.success({
        message: "Product Deleted",
        description: response.message || "Product deleted successfully",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete product",
      });
    },
  });
};

// Hook for prefetching a product (useful for hover/link prefetching)
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(id),
      queryFn: () =>
        productApi.getProduct(id).then((response) => response.data),
      staleTime: 5 * 60 * 1000,
    });
  };
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { userApi } from "../services/mock-api";
import type {
  UserFilters,
  PaginationParams,
  SortParams,
  CreateUserData,
  UpdateUserData,
} from "../types";

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (
    filters: UserFilters,
    pagination: PaginationParams,
    sort: SortParams
  ) => [...userKeys.lists(), { filters, pagination, sort }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook for fetching users
export const useUsers = (
  filters: UserFilters = {},
  pagination: PaginationParams = {},
  sort: SortParams = {}
) => {
  return useQuery({
    queryKey: userKeys.list(filters, pagination, sort),
    queryFn: () => userApi.getUsers(filters, pagination, sort),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook for fetching a single user
export const useUser = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id).then((response) => response.data),
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Hook for creating a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userApi.createUser(data),
    onSuccess: (response) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      notification.success({
        message: "User Created",
        description: response.message || "User created successfully",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message || "Failed to create user",
      });
    },
  });
};

// Hook for updating a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) => userApi.updateUser(data),
    onSuccess: (response, variables) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), response.data);

      // Invalidate users list to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      notification.success({
        message: "User Updated",
        description: response.message || "User updated successfully",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update user",
      });
    },
  });
};

// Hook for deleting a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.deleteUser(id),
    onSuccess: (response, userId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(userId) });

      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });

      notification.success({
        message: "User Deleted",
        description: response.message || "User deleted successfully",
      });
    },
    onError: (error) => {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete user",
      });
    },
  });
};

// Hook for prefetching a user (useful for hover/link prefetching)
export const usePrefetchUser = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => userApi.getUser(id).then((response) => response.data),
      staleTime: 5 * 60 * 1000,
    });
  };
};

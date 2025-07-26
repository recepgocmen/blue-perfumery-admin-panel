// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive" | "banned";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
  avatar?: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "active" | "inactive" | "discontinued";
  stock: number;
  sku: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  status: Product["status"];
  stock: number;
  sku: string;
  image?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter and search types
export interface UserFilters {
  role?: User["role"];
  status?: User["status"];
  search?: string;
}

export interface ProductFilters {
  category?: string;
  status?: Product["status"];
  search?: string;
  priceMin?: number;
  priceMax?: number;
}

// Generic types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

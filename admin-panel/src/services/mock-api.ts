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

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    lastLogin: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "user",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    createdAt: "2024-01-02T11:00:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
    lastLogin: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "moderator",
    status: "inactive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    createdAt: "2024-01-03T12:00:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
    lastLogin: "2024-01-10T16:45:00Z",
  },
  {
    id: "4",
    name: "Alice Wilson",
    email: "alice@example.com",
    role: "user",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    createdAt: "2024-01-04T13:00:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
    lastLogin: "2024-01-16T11:20:00Z",
  },
];

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    description: "Latest iPhone with Pro camera system and titanium design",
    price: 999,
    category: "Electronics",
    status: "active",
    stock: 50,
    sku: "IPH15P-128-TIT",
    image: "https://images.unsplash.com/photo-1592899677977-9c10c23f31d0?w=400",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    name: "MacBook Air M3",
    description: "Powerful laptop with M3 chip and all-day battery life",
    price: 1299,
    category: "Electronics",
    status: "active",
    stock: 25,
    sku: "MBA-M3-512-SIL",
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
    createdAt: "2024-01-02T11:00:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    name: "AirPods Pro",
    description: "Wireless earbuds with active noise cancellation",
    price: 249,
    category: "Electronics",
    status: "active",
    stock: 100,
    sku: "APP-2ND-GEN",
    image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
    createdAt: "2024-01-03T12:00:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
  },
  {
    id: "4",
    name: "Apple Watch Series 9",
    description: "Advanced fitness and health tracking smartwatch",
    price: 399,
    category: "Electronics",
    status: "discontinued",
    stock: 15,
    sku: "AWS9-45-GPS",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
    createdAt: "2024-01-04T13:00:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
  },
];

// Utility functions
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

const filterUsers = (users: User[], filters: UserFilters) => {
  return users.filter((user) => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.status && user.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

const filterProducts = (products: Product[], filters: ProductFilters) => {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.status && product.status !== filters.status) return false;
    if (filters.priceMin && product.price < filters.priceMin) return false;
    if (filters.priceMax && product.price > filters.priceMax) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

const sortData = <T>(data: T[], sortParams: SortParams): T[] => {
  if (!sortParams.sortBy) return data;

  return [...data].sort((a, b) => {
    const aVal = (a as Record<string, unknown>)[sortParams.sortBy!];
    const bVal = (b as Record<string, unknown>)[sortParams.sortBy!];

    // Handle comparison for unknown types
    let comparison = 0;
    if (
      typeof aVal === typeof bVal &&
      (typeof aVal === "string" || typeof aVal === "number")
    ) {
      if ((aVal as string | number) < (bVal as string | number))
        comparison = -1;
      if ((aVal as string | number) > (bVal as string | number)) comparison = 1;
    } else {
      // Fallback to string comparison
      const aStr = String(aVal);
      const bStr = String(bVal);
      if (aStr < bStr) comparison = -1;
      if (aStr > bStr) comparison = 1;
    }

    return sortParams.sortOrder === "desc" ? -comparison : comparison;
  });
};

const paginateData = <T>(
  data: T[],
  pagination: PaginationParams
): { data: T[]; total: number; totalPages: number } => {
  const page = pagination.page || 1;
  const limit = pagination.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: data.slice(startIndex, endIndex),
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
  };
};

// User API
export const userApi = {
  async getUsers(
    filters: UserFilters = {},
    pagination: PaginationParams = {},
    sort: SortParams = {}
  ): Promise<PaginatedResponse<User>> {
    await delay(500); // Simulate network delay

    let filteredUsers = filterUsers(mockUsers, filters);
    filteredUsers = sortData(filteredUsers, sort);
    const paginatedResult = paginateData(filteredUsers, pagination);

    return {
      data: paginatedResult.data,
      total: paginatedResult.total,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      totalPages: paginatedResult.totalPages,
    };
  },

  async getUser(id: string): Promise<ApiResponse<User>> {
    await delay(300);

    const user = mockUsers.find((u) => u.id === id);
    if (!user) {
      throw new Error("User not found");
    }

    return {
      data: user,
      message: "User retrieved successfully",
      success: true,
    };
  },

  async createUser(data: CreateUserData): Promise<ApiResponse<User>> {
    await delay(800);

    const newUser: User = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return {
      data: newUser,
      message: "User created successfully",
      success: true,
    };
  },

  async updateUser(data: UpdateUserData): Promise<ApiResponse<User>> {
    await delay(600);

    const userIndex = mockUsers.findIndex((u) => u.id === data.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockUsers[userIndex] = updatedUser;

    return {
      data: updatedUser,
      message: "User updated successfully",
      success: true,
    };
  },

  async deleteUser(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(400);

    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    mockUsers.splice(userIndex, 1);

    return {
      data: { id },
      message: "User deleted successfully",
      success: true,
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
    await delay(600);

    let filteredProducts = filterProducts(mockProducts, filters);
    filteredProducts = sortData(filteredProducts, sort);
    const paginatedResult = paginateData(filteredProducts, pagination);

    return {
      data: paginatedResult.data,
      total: paginatedResult.total,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
      totalPages: paginatedResult.totalPages,
    };
  },

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    await delay(300);

    const product = mockProducts.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }

    return {
      data: product,
      message: "Product retrieved successfully",
      success: true,
    };
  },

  async createProduct(data: CreateProductData): Promise<ApiResponse<Product>> {
    await delay(1000);

    const newProduct: Product = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProducts.push(newProduct);

    return {
      data: newProduct,
      message: "Product created successfully",
      success: true,
    };
  },

  async updateProduct(data: UpdateProductData): Promise<ApiResponse<Product>> {
    await delay(700);

    const productIndex = mockProducts.findIndex((p) => p.id === data.id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const updatedProduct: Product = {
      ...mockProducts[productIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockProducts[productIndex] = updatedProduct;

    return {
      data: updatedProduct,
      message: "Product updated successfully",
      success: true,
    };
  },

  async deleteProduct(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(500);

    const productIndex = mockProducts.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    mockProducts.splice(productIndex, 1);

    return {
      data: { id },
      message: "Product deleted successfully",
      success: true,
    };
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
    await delay(400);

    const stats = {
      totalUsers: mockUsers.length,
      totalProducts: mockProducts.length,
      activeUsers: mockUsers.filter((u) => u.status === "active").length,
      activeProducts: mockProducts.filter((p) => p.status === "active").length,
      revenue: mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0),
      growth: 12.5, // Mock growth percentage
    };

    return {
      data: stats,
      message: "Dashboard stats retrieved successfully",
      success: true,
    };
  },
};

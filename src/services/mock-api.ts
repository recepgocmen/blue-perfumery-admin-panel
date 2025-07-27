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

const mockPerfumes: Product[] = [
  {
    id: "mfk-br540",
    name: "Baccarat Rouge 540",
    brand: "Blue Perfumery Exclusive",
    price: 1250,
    originalPrice: 500,
    ml: 70,
    gender: "unisex",
    category: "exclusive",
    status: "active",
    stock: 25,
    sku: "BPE-BR540-70",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["safran", "yasemin", "amber", "sedir"],
    characteristics: ["tatlı", "odunsu", "amber", "sıcak"],
    ageRange: { min: 20, max: 35 },
    shopierLink: "https://www.shopier.com/blueperfumery/baccarat-rouge-540",
    description:
      "Blue Perfumery koleksiyonundan lüks ve sofistike bir koku. Tatlı ve odunsu notalar ile öne çıkar.",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "mfk-oud-satin",
    name: "Oud Satin Mood",
    brand: "Blue Perfumery Premium",
    price: 1350,
    originalPrice: 510,
    ml: 70,
    gender: "unisex",
    category: "premium",
    status: "active",
    stock: 18,
    sku: "BPP-OSM-70",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["ud", "gül", "vanilya", "benjamin"],
    characteristics: ["oryantal", "zengin", "tatlı", "odunsu"],
    ageRange: { min: 20, max: 50 },
    shopierLink: "https://www.shopier.com/blueperfumery/oud-satin-mood",
    description: "Blue Perfumery'nin zengin ve yoğun oryantal kokusu.",
    createdAt: "2024-01-02T11:00:00Z",
    updatedAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "tf-lost-cherry",
    name: "Lost Cherry",
    brand: "Blue Perfumery Premium",
    price: 1380,
    originalPrice: 700,
    ml: 100,
    gender: "female",
    category: "woman",
    status: "active",
    stock: 12,
    sku: "BPP-LC-100",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["kiraz", "badem", "tonka fasulyesi", "peru balsamı"],
    characteristics: ["tatlı", "meyveli", "gurme"],
    ageRange: { min: 20, max: 45 },
    shopierLink: "https://www.shopier.com/blueperfumery/lost-cherry",
    description: "Tatlı ve baştan çıkarıcı kiraz kokusu.",
    createdAt: "2024-01-03T12:00:00Z",
    updatedAt: "2024-01-10T16:45:00Z",
  },
  {
    id: "tf-oud-wood",
    name: "Oud Wood",
    brand: "Blue Perfumery Luxury",
    price: 1400,
    originalPrice: 480,
    ml: 50,
    gender: "male",
    category: "man",
    status: "active",
    stock: 8,
    sku: "BPL-OW-50",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["ud", "gül ağacı", "kakule", "sandal ağacı"],
    characteristics: ["odunsu", "baharatlı", "lüks", "rafine"],
    ageRange: { min: 25, max: 55 },
    shopierLink: "https://www.shopier.com/blueperfumery/oud-wood",
    description: "Sofistike ve maskülen bir ağaç kokusu.",
    createdAt: "2024-01-04T13:00:00Z",
    updatedAt: "2024-01-16T11:20:00Z",
  },
  {
    id: "chanel-chance",
    name: "Chance",
    brand: "Blue Perfumery Classic",
    price: 900,
    originalPrice: 200,
    ml: 50,
    gender: "female",
    category: "woman",
    status: "active",
    stock: 35,
    sku: "BPC-CH-50",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["pembe biber", "yasemin", "paçuli"],
    characteristics: ["çiçeksi", "ferah", "baharatlı"],
    ageRange: { min: 19, max: 45 },
    shopierLink: "https://www.shopier.com/blueperfumery/chance",
    description: "Zarif ve feminen bir koku.",
    createdAt: "2024-01-05T14:00:00Z",
    updatedAt: "2024-01-17T10:15:00Z",
  },
  {
    id: "invictus",
    name: "Invictus",
    brand: "Blue Perfumery Urban",
    price: 600,
    originalPrice: 100,
    ml: 50,
    gender: "male",
    category: "man",
    status: "active",
    stock: 42,
    sku: "BPU-INV-50",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["greyfurt", "deniz", "guaiac ağacı"],
    characteristics: ["ferah", "deniz", "odunsu"],
    ageRange: { min: 20, max: 35 },
    shopierLink: "https://www.shopier.com/blueperfumery/invictus",
    description: "Taze ve maskülen bir koku",
    createdAt: "2024-01-06T15:00:00Z",
    updatedAt: "2024-01-18T12:30:00Z",
  },
  {
    id: "nasomatto-black-afgano",
    name: "Black Afgano",
    brand: "Blue Perfumery Artisanal",
    price: 1180,
    originalPrice: 155,
    ml: 30,
    gender: "unisex",
    category: "niches",
    status: "active",
    stock: 6,
    sku: "BPA-BA-30",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["kenevir", "kahve", "ud", "tütün"],
    characteristics: ["reçineli", "karanlık", "yoğun", "bağımlılık yapıcı"],
    ageRange: { min: 28, max: 55 },
    shopierLink: "https://www.shopier.com/blueperfumery/black-afgano",
    description: "Derin ve karanlık bir bağımlılık parfümü.",
    createdAt: "2024-01-07T16:00:00Z",
    updatedAt: "2024-01-19T14:45:00Z",
  },
  {
    id: "ysl-libre-woman",
    name: "Libre Woman",
    brand: "Blue Perfumery Classic",
    price: 800,
    originalPrice: 140,
    ml: 50,
    gender: "female",
    category: "woman",
    status: "active",
    stock: 28,
    sku: "BPC-LW-50",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["lavanta", "portakal çiçeği", "vanilya", "misk"],
    characteristics: ["çiçeksi", "warm", "ferah"],
    ageRange: { min: 20, max: 40 },
    shopierLink: "https://www.shopier.com/blueperfumery/libre-woman",
    description: "Modern ve özgür bir kadın kokusu.",
    createdAt: "2024-01-08T17:00:00Z",
    updatedAt: "2024-01-20T09:20:00Z",
  },
  {
    id: "mancera-cedrat-boise",
    name: "Cedrat Boise",
    brand: "Blue Perfumery Premium",
    price: 900,
    originalPrice: 195,
    ml: 120,
    gender: "unisex",
    category: "unisex",
    status: "active",
    stock: 22,
    sku: "BPP-CB-120",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["narenciye", "sedir", "deri", "vanilya"],
    characteristics: ["ferah", "odunsu", "narenciyeli", "modern"],
    ageRange: { min: 22, max: 45 },
    shopierLink: "https://www.shopier.com/blueperfumery/cedrat-boise",
    description: "Energetic ve çarpıcı bir odunsu citrus kokusu",
    createdAt: "2024-01-09T18:00:00Z",
    updatedAt: "2024-01-21T11:10:00Z",
  },
  {
    id: "memo-lalibela",
    name: "Lalibela",
    brand: "Blue Perfumery Artisanal",
    price: 1100,
    originalPrice: 300,
    ml: 75,
    gender: "unisex",
    category: "niches",
    status: "active",
    stock: 14,
    sku: "BPA-LAL-75",
    image:
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop&crop=center",
    notes: ["akgünlük", "vanilya", "misk", "badem"],
    characteristics: ["günlük", "ruhani", "tatlı", "reçineli"],
    ageRange: { min: 28, max: 55 },
    shopierLink: "https://www.shopier.com/blueperfumery/lalibela",
    description: "Ruhani ve derin bir koku deneyimi",
    createdAt: "2024-01-10T19:00:00Z",
    updatedAt: "2024-01-22T13:55:00Z",
  },
];

// Helper functions
export function getPerfumesByGender(gender: string): Product[] {
  if (gender === "niches") {
    return mockPerfumes.filter(
      (p) =>
        p.category === "niches" ||
        p.brand.includes("Exclusive") ||
        p.brand.includes("Artisanal")
    );
  }
  if (gender === "men" || gender === "male") {
    return mockPerfumes.filter(
      (p) => p.gender === "male" || p.gender === "unisex"
    );
  }
  if (gender === "women" || gender === "female") {
    return mockPerfumes.filter(
      (p) => p.gender === "female" || p.gender === "unisex"
    );
  }
  return mockPerfumes;
}

export function searchPerfumesByName(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return mockPerfumes.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.brand.toLowerCase().includes(lowercaseQuery) ||
      p.characteristics.some((char) =>
        char.toLowerCase().includes(lowercaseQuery)
      ) ||
      p.notes.some((note) => note.toLowerCase().includes(lowercaseQuery))
  );
}

export function getPerfumeById(id: string): Product | undefined {
  return mockPerfumes.find((p) => p.id === id);
}

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
    if (filters.gender && product.gender !== filters.gender) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.status && product.status !== filters.status) return false;
    if (filters.priceMin && product.price < filters.priceMin) return false;
    if (filters.priceMax && product.price > filters.priceMax) return false;
    if (filters.characteristics && filters.characteristics.length > 0) {
      const hasCharacteristic = filters.characteristics.some((char) =>
        product.characteristics.includes(char)
      );
      if (!hasCharacteristic) return false;
    }
    if (filters.notes && filters.notes.length > 0) {
      const hasNote = filters.notes.some((note) =>
        product.notes.includes(note)
      );
      if (!hasNote) return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.brand.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.characteristics.some((char) =>
          char.toLowerCase().includes(searchLower)
        ) ||
        product.notes.some((note) => note.toLowerCase().includes(searchLower))
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

    let filteredProducts = filterProducts(mockPerfumes, filters);
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

    const product = mockPerfumes.find((p) => p.id === id);
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

    mockPerfumes.push(newProduct);

    return {
      data: newProduct,
      message: "Product created successfully",
      success: true,
    };
  },

  async updateProduct(data: UpdateProductData): Promise<ApiResponse<Product>> {
    await delay(700);

    const productIndex = mockPerfumes.findIndex((p) => p.id === data.id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const updatedProduct: Product = {
      ...mockPerfumes[productIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockPerfumes[productIndex] = updatedProduct;

    return {
      data: updatedProduct,
      message: "Product updated successfully",
      success: true,
    };
  },

  async deleteProduct(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(500);

    const productIndex = mockPerfumes.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    mockPerfumes.splice(productIndex, 1);

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
      totalProducts: mockPerfumes.length,
      activeUsers: mockUsers.filter((u) => u.status === "active").length,
      activeProducts: mockPerfumes.filter((p) => p.status === "active").length,
      revenue: mockPerfumes.reduce((sum, p) => sum + p.price * p.stock, 0),
      growth: 12.5, // Mock growth percentage
    };

    return {
      data: stats,
      message: "Dashboard stats retrieved successfully",
      success: true,
    };
  },
};

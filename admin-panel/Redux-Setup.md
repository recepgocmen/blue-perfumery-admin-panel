# Redux Toolkit Setup - Admin Panel

## Overview

This admin panel now includes a complete Redux Toolkit setup for managing application state. The setup includes state management for both users and products with full CRUD operations.

## 📁 Structure

```
src/store/
├── index.ts                    # Store configuration
├── hooks.ts                    # Typed Redux hooks
├── slices/
│   ├── usersSlice.ts          # Users state management
│   └── productsSlice.ts       # Products state management
└── selectors/
    ├── usersSelectors.ts      # Memoized user selectors
    └── productsSelectors.ts   # Memoized product selectors
```

## 🚀 Features Implemented

### Users Management

- ✅ Fetch users with pagination, filtering, and sorting
- ✅ Create new users
- ✅ Update existing users
- ✅ Delete users
- ✅ View user details
- ✅ Search and filter users by role/status

### Products Management

- ✅ Fetch products with pagination, filtering, and sorting
- ✅ Create new products
- ✅ Update existing products
- ✅ Delete products
- ✅ View product details
- ✅ Filter products by category, price, status

## 🛠 Usage Examples

### 1. Using Redux in Components

```tsx
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers, deleteUser } from "../store/slices/usersSlice";
import {
  selectUsers,
  selectUsersLoading,
} from "../store/selectors/usersSelectors";

const UsersComponent = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);

  // Fetch users on component mount
  useEffect(() => {
    dispatch(
      fetchUsers({
        pagination: { page: 1, limit: 10 },
      })
    );
  }, [dispatch]);

  // Delete a user
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      message.success("User deleted successfully");
    } catch {
      message.error("Failed to delete user");
    }
  };

  return (
    <Table
      dataSource={users}
      loading={loading}
      // ... other props
    />
  );
};
```

### 2. Available Actions

#### Users Actions

```tsx
// Fetch users with optional filters, pagination, sorting
dispatch(
  fetchUsers({
    filters: { role: "admin", status: "active" },
    pagination: { page: 1, limit: 10 },
    sort: { sortBy: "name", sortOrder: "asc" },
  })
);

// Get a specific user
dispatch(fetchUserById("user-id"));

// Create a new user
dispatch(
  createUser({
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
  })
);

// Update a user
dispatch(
  updateUser({
    id: "user-id",
    name: "Updated Name",
  })
);

// Delete a user
dispatch(deleteUser("user-id"));

// Update filters
dispatch(setFilters({ role: "admin" }));

// Update pagination
dispatch(setPagination({ page: 2, limit: 20 }));
```

#### Products Actions

```tsx
// Similar pattern for products
dispatch(
  fetchProducts({
    /* options */
  })
);
dispatch(fetchProductById("product-id"));
dispatch(
  createProduct({
    /* product data */
  })
);
dispatch(
  updateProduct({
    /* updated data */
  })
);
dispatch(deleteProduct("product-id"));
```

### 3. Using Selectors

```tsx
// Basic selectors
const users = useAppSelector(selectUsers);
const loading = useAppSelector(selectUsersLoading);
const error = useAppSelector(selectUsersError);

// Computed selectors
const activeUsers = useAppSelector(selectActiveUsers);
const adminUsers = useAppSelector((state) => selectUsersByRole(state, "admin"));
const specificUser = useAppSelector((state) =>
  selectUserById(state, "user-id")
);

// Products selectors
const products = useAppSelector(selectProducts);
const categories = useAppSelector(selectProductCategories);
const lowStockProducts = useAppSelector((state) =>
  selectLowStockProducts(state, 5)
);
```

## 🔧 State Shape

### Users State

```typescript
interface UsersState {
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
```

### Products State

```typescript
interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: ProductFilters;
  sortParams: SortParams;
}
```

## 🎯 Next Steps

To implement the remaining functional requirements:

1. **Product Detail Page & Editing**: Use `fetchProductById` and `updateProduct` actions
2. **User Detail Pages**: Use `fetchUserById` and `updateUser` actions
3. **Advanced Filtering**: Extend filters and use `setFilters` action
4. **Search**: Add search functionality using existing filter actions

## 🧪 Testing Redux

1. Open Redux DevTools in your browser
2. Navigate to the Users page
3. Watch the state changes as you:
   - Load users
   - Delete a user
   - Change pagination
   - Apply filters

The Redux setup is fully functional and ready for further development!

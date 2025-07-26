# Admin Panel

A modern admin panel built with React, TypeScript, and Vite for managing products and users.

## 🚀 Features

- **Product Management**: Create, read, update, and delete products
- **User Management**: Manage user accounts with roles and permissions
- **Dashboard**: Overview with key metrics and statistics
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Built with Ant Design components and custom theming
- **Type Safety**: Full TypeScript support throughout the application
- **Fast Development**: Powered by Vite for instant HMR and fast builds
- **Mock API**: Complete mock API service for development and testing

## 🛠 Tech Stack

- **Frontend Framework**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Language**: TypeScript
- **UI Library**: Ant Design 5.26.6
- **Icons**: Ant Design Icons
- **Routing**: React Router 7.7.1
- **State Management**: TanStack React Query 5.83.0
- **Development Tools**: React Query Devtools, ESLint

## 📦 Project Structure

```
src/
├── components/         # Reusable UI components
│   └── layout/        # Layout components (AdminLayout)
├── hooks/             # Custom React hooks
├── lib/               # Core library files
│   ├── query-client.ts # TanStack Query client configuration
│   ├── router.tsx     # React Router configuration
│   └── theme.ts       # Ant Design theme configuration
├── pages/             # Page components
│   ├── DashboardPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── UsersPage.tsx
│   ├── UserDetailPage.tsx
│   └── NotFoundPage.tsx
├── services/          # API services and mock data
│   └── mock-api.ts    # Mock API implementation
├── types/             # TypeScript type definitions
│   └── index.ts       # Shared types and interfaces
├── context/           # React context providers
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js (v20.18.2 or higher)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone or download the project**

   ```bash
   # If you have the project files
   cd admin-panel
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Theme Customization

The application uses a custom Ant Design theme defined in `src/lib/theme.ts`. You can customize:

- **Colors**: Primary, success, warning, error colors
- **Typography**: Font sizes, headings
- **Spacing**: Padding, margins
- **Layout**: Component-specific styling
- **Components**: Override default component styles

### Example Theme Modification

```typescript
// src/lib/theme.ts
export const theme: ThemeConfig = {
  token: {
    colorPrimary: "#1677ff", // Change primary color
    borderRadius: 6, // Adjust border radius
    fontSize: 14, // Base font size
  },
  components: {
    Button: {
      borderRadius: 6, // Component-specific styling
    },
  },
};
```

## 📊 API Integration

The project includes a comprehensive mock API service that simulates real backend operations:

### Features

- **CRUD Operations**: Create, Read, Update, Delete for both users and products
- **Filtering**: Search and filter by various criteria
- **Pagination**: Server-side pagination support
- **Sorting**: Sort by any field in ascending/descending order
- **Network Simulation**: Realistic delays to simulate network requests
- **Error Handling**: Proper error responses for edge cases

### Usage Example

```typescript
import { userApi, productApi } from "./services/mock-api";

// Get paginated users with filters
const users = await userApi.getUsers(
  { role: "admin", search: "john" }, // filters
  { page: 1, limit: 10 }, // pagination
  { sortBy: "name", sortOrder: "asc" } // sorting
);

// Get a specific product
const product = await productApi.getProduct("product-id");
```

## 🚦 Routing

The application uses React Router with the following structure:

- `/` - Dashboard (overview and statistics)
- `/products` - Products list page
- `/products/:id` - Product detail page
- `/users` - Users list page
- `/users/:id` - User detail page
- `*` - 404 Not Found page

## 🔧 Configuration

### Vite Configuration

The project uses Vite's default React + TypeScript template with additional optimizations for the admin panel use case.

### TanStack Query Configuration

- **Stale Time**: 5 minutes
- **Cache Time**: 10 minutes
- **Retry**: 3 attempts for queries, 1 for mutations
- **Refetch on Window Focus**: Disabled in development

## 🎯 Usage Examples

### Adding a New Page

1. Create the component in `src/pages/`
2. Add route in `src/lib/router.tsx`
3. Update navigation in `src/components/layout/AdminLayout.tsx`

### Creating Custom Hooks

Place reusable logic in `src/hooks/` directory:

```typescript
// src/hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { productApi } from "../services/mock-api";

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productApi.getProducts(filters),
  });
};
```

## 🐛 Known Issues

- Node.js version warning: The project requires Node.js v20.19.0+ but works with v20.18.2
- Responsive sidebar: On mobile devices, the sidebar positioning might need adjustment

## 🔮 Future Enhancements

- [ ] Real API integration
- [ ] Authentication and authorization
- [ ] Advanced filtering and search
- [ ] Data export functionality
- [ ] Real-time updates with WebSockets
- [ ] Advanced charts and analytics
- [ ] Multi-language support (i18n)
- [ ] Dark/light theme toggle
- [ ] User permissions and role management
- [ ] Audit logs and activity tracking

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the console for error messages
2. Verify all dependencies are installed correctly
3. Ensure you're using a compatible Node.js version
4. Clear browser cache and restart the development server

---

**Happy coding! 🚀**

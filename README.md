# Blue Perfumery Admin Panel

A sophisticated admin panel built with React that empowers administrators to efficiently manage products and users with powerful data manipulation capabilities and modern UI/UX design.

🌐 **Live Demo**: (https://blueperfumery-admin-panel.vercel.app/)

## Features

- 🎯 **Complete Product Management** - Full CRUD operations with filtering and search
- 👥 **User Management System** - Comprehensive user administration with role-based controls
- 📊 **Interactive Dashboard** - Real-time analytics and key performance indicators
- 🎨 **Modern UI/UX** - Built with Ant Design and custom theming
- ⚡ **Lightning Fast** - Powered by Vite with optimized builds
- 🛡️ **Type Safety** - Full TypeScript support throughout the application

## Tech Stack

- **Framework**: React 19+ (Latest)
- **Build Tool**: Vite 7+
- **Language**: TypeScript
- **UI Library**: Ant Design 5.26+
- **State Management**: TanStack React Query 5.83+
- **Routing**: React Router 7+
- **Icons**: Ant Design Icons
- **Development**: ESLint, React Query Devtools

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/admin-panel-pro.git
cd admin-panel-pro
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Project Structure

- `/src/components` - Reusable UI components and layout system
- `/src/pages` - Application pages and route components
- `/src/lib` - Core configuration (query-client, router, theme)
- `/src/services` - API services and mock data layer
- `/src/hooks` - Custom React hooks and TanStack Query hooks
- `/src/types` - TypeScript type definitions and interfaces
- `/src/context` - React context providers
- `/src/store` - Redux Toolkit state management (optional)

## Key Features

### 🛍️ Product Management

- Create, edit, and delete products with rich form validation
- Advanced filtering by category, price range, and status
- Bulk operations and batch updates
- Product image management and gallery view
- Inventory tracking and stock management

### 👤 User Management

- Complete user lifecycle management
- Role-based access control (Admin, User, Moderator)
- User status management (Active, Inactive, Banned)
- Advanced search and filtering capabilities
- User activity tracking and audit logs

### 📈 Dashboard Analytics

- Real-time metrics and KPIs
- Interactive charts and data visualizations
- Quick actions and recent activity feeds
- System health monitoring
- Performance insights

### 🎨 UI/UX Excellence

- Modern, clean interface with Ant Design
- Customizable theme system with design tokens
- Responsive design for all screen sizes
- Intuitive navigation and user flows
- Loading states and error handling

## API Integration

The project includes a comprehensive mock API service that simulates real backend operations:

```typescript
// Example usage
import { productApi } from "./services/mock-api";

// Fetch products with filters
const products = await productApi.getProducts({
  category: "electronics",
  priceRange: [100, 500],
  status: "active",
});
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using React, TypeScript, and modern web technologies**

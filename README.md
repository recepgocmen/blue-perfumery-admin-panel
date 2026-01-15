# Blue Perfumery Admin Panel

Admin dashboard for Blue Perfumery - Product, user and chat session management with React 19, Vite, Ant Design and TypeScript.

🌐 **Live Demo**: [blueperfumery-admin-panel.vercel.app](https://blueperfumery-admin-panel.vercel.app/)

## Tech Stack

| Technology     | Version | Purpose          |
| -------------- | ------- | ---------------- |
| React          | 19+     | UI Framework     |
| Vite           | 7+      | Build Tool       |
| TypeScript     | 5.8+    | Type Safety      |
| Ant Design     | 5.26+   | UI Components    |
| Redux Toolkit  | 2.8+    | State Management |
| TanStack Query | 5.83+   | Server State     |
| React Router   | 7+      | Routing          |

## Features

- **Product Management** - Full CRUD operations with filtering, search and pagination
- **User Management** - Role-based user administration (Admin, User, Moderator)
- **Chat Sessions** - View and manage AI chatbot conversations
- **Dashboard** - Real-time analytics and KPIs
- **Responsive Design** - Mobile-first approach with Ant Design

## Getting Started

```bash
# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages (Dashboard, Products, Users, Chat)
├── services/       # API services and data layer
├── store/          # Redux slices and selectors
├── hooks/          # Custom React hooks
├── lib/            # Core config (router, theme, query-client)
└── types/          # TypeScript definitions
```

## API Integration

Connects to Blue Perfumery Backend API:

```typescript
// .env
VITE_API_BASE_URL=https://blueperfumery-backend.vercel.app/api
```

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## License

MIT

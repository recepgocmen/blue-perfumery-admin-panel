import { createBrowserRouter } from "react-router";
import { AdminLayout } from "../components/layout/AdminLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ProductAddPage } from "../pages/ProductAddPage.tsx";
import { ProductEditPage } from "../pages/ProductEditPage.tsx";
import { UsersPage } from "../pages/UsersPage";
import { UserDetailPage } from "../pages/UserDetailPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: "add",
            element: <ProductAddPage />,
          },
          {
            path: ":id",
            element: <ProductDetailPage />,
          },
          {
            path: ":id/edit",
            element: <ProductEditPage />,
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            index: true,
            element: <UsersPage />,
          },
          {
            path: ":id",
            element: <UserDetailPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

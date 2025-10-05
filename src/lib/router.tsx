import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "../components/layout/AdminLayout";
import { DashboardPage } from "../pages/DashboardPage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ProductAddPage } from "../pages/ProductAddPage.tsx";
import { ProductEditPage } from "../pages/ProductEditPage.tsx";
import { UsersPage } from "../pages/UsersPage";
import { UserDetailPage } from "../pages/UserDetailPage";
import { UserAddPage } from "../pages/UserAddPage";
import { UserEditPage } from "../pages/UserEditPage";
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
            path: "add",
            element: <UserAddPage />,
          },
          {
            path: ":id",
            element: <UserDetailPage />,
          },
          {
            path: ":id/edit",
            element: <UserEditPage />,
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

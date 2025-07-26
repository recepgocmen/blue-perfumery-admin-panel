import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  message,
  Table,
  Tag,
  Button,
  Alert,
  Progress,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
  EyeOutlined,
  WarningOutlined,
  TrophyOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardStats } from "../store/slices/dashboardSlice";
import { fetchProducts } from "../store/slices/productsSlice";
import { fetchUsers } from "../store/slices/usersSlice";
import {
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
} from "../store/selectors/dashboardSelectors";
import {
  selectProducts,
  selectProductsLoading,
  selectLowStockProducts,
  selectProductCategories,
} from "../store/selectors/productsSelectors";
import {
  selectUsers,
  selectActiveUsers,
} from "../store/selectors/usersSelectors";
import type { Product, User } from "../types";

const { Title, Text } = Typography;

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Dashboard stats
  const stats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  // Products data
  const products = useAppSelector(selectProducts);
  const productsLoading = useAppSelector(selectProductsLoading);
  const lowStockProducts = useAppSelector((state) =>
    selectLowStockProducts(state, 10)
  );
  const categories = useAppSelector(selectProductCategories);

  // Users data
  const users = useAppSelector(selectUsers);
  const activeUsers = useAppSelector(selectActiveUsers);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchProducts({ pagination: { page: 1, limit: 50 } }));
    dispatch(fetchUsers({ pagination: { page: 1, limit: 50 } }));
  }, [dispatch]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  // Get recent products (most recently updated)
  const recentProducts = React.useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  }, [products]);

  // Get recent users (most recently updated)
  const recentUsers = React.useMemo(() => {
    return [...users]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  }, [users]);

  // Category breakdown
  const categoryBreakdown = React.useMemo(() => {
    const breakdown: Record<string, number> = {};
    products.forEach((product) => {
      breakdown[product.category] = (breakdown[product.category] || 0) + 1;
    });
    return Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [products]);

  // User role breakdown
  const roleBreakdown = React.useMemo(() => {
    const breakdown: Record<string, number> = {};
    users.forEach((user) => {
      breakdown[user.role] = (breakdown[user.role] || 0) + 1;
    });
    return Object.entries(breakdown);
  }, [users]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading dashboard...</div>
      </div>
    );
  }

  // Product table columns
  const productColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Product) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.sku}
          </Text>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <Tag color={stock <= 10 ? "red" : stock <= 20 ? "orange" : "green"}>
          {stock}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/products/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  // User table columns
  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: User) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.email}
          </Text>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colors = { admin: "red", moderator: "orange", user: "blue" };
        return <Tag color={colors[role as keyof typeof colors]}>{role}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colors = { active: "green", inactive: "orange", banned: "red" };
        return (
          <Tag color={colors[status as keyof typeof colors]}>{status}</Tag>
        );
      },
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin: string) =>
        lastLogin ? new Date(lastLogin).toLocaleDateString() : "Never",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/users/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      {/* Main Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats?.totalProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={stats?.revenue || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Growth"
              value={stats?.growth || 0}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={activeUsers.length}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Products"
              value={stats?.activeProducts || 0}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={lowStockProducts.length}
              prefix={<WarningOutlined />}
              valueStyle={{
                color: lowStockProducts.length > 0 ? "#cf1322" : "#3f8600",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Product Categories"
              value={categories.length}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Alert
              message="Low Stock Warning"
              description={
                <div>
                  <Text>
                    {lowStockProducts.length} product
                    {lowStockProducts.length !== 1 ? "s" : ""} running low on
                    stock:
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    {lowStockProducts.slice(0, 3).map((product) => (
                      <Tag
                        key={product.id}
                        color="red"
                        style={{ marginBottom: 4, cursor: "pointer" }}
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.name} ({product.stock} left)
                      </Tag>
                    ))}
                    {lowStockProducts.length > 3 && (
                      <Tag
                        color="default"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/products")}
                      >
                        +{lowStockProducts.length - 3} more
                      </Tag>
                    )}
                  </div>
                </div>
              }
              type="warning"
              showIcon
              action={
                <Button size="small" onClick={() => navigate("/products")}>
                  View Products
                </Button>
              }
            />
          </Col>
        </Row>
      )}

      {/* Content Sections */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Recent Products */}
        <Col xs={24} lg={12}>
          <Card
            title="Recent Products"
            extra={
              <Button type="link" onClick={() => navigate("/products")}>
                View All
              </Button>
            }
          >
            <Table
              columns={productColumns}
              dataSource={recentProducts}
              rowKey="id"
              pagination={false}
              loading={productsLoading}
              size="small"
            />
          </Card>
        </Col>

        {/* Recent Users */}
        <Col xs={24} lg={12}>
          <Card
            title="Recent Users"
            extra={
              <Button type="link" onClick={() => navigate("/users")}>
                View All
              </Button>
            }
          >
            <Table
              columns={userColumns}
              dataSource={recentUsers}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Analytics Sections */}
      <Row gutter={[16, 16]}>
        {/* Product Categories Breakdown */}
        <Col xs={24} lg={12}>
          <Card title="Top Product Categories">
            <div>
              {categoryBreakdown.map(([category, count]) => (
                <div key={category} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text>{category}</Text>
                    <Text strong>{count} products</Text>
                  </div>
                  <Progress
                    percent={(count / products.length) * 100}
                    showInfo={false}
                    strokeColor="#1677ff"
                  />
                </div>
              ))}
              {categoryBreakdown.length === 0 && (
                <Text type="secondary">No product categories available</Text>
              )}
            </div>
          </Card>
        </Col>

        {/* User Roles Breakdown */}
        <Col xs={24} lg={12}>
          <Card title="User Roles Distribution">
            <div>
              {roleBreakdown.map(([role, count]) => (
                <div key={role} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
                    <Text strong>{count} users</Text>
                  </div>
                  <Progress
                    percent={(count / users.length) * 100}
                    showInfo={false}
                    strokeColor={
                      role === "admin"
                        ? "#cf1322"
                        : role === "moderator"
                        ? "#fa8c16"
                        : "#3f8600"
                    }
                  />
                </div>
              ))}
              {roleBreakdown.length === 0 && (
                <Text type="secondary">No user roles available</Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

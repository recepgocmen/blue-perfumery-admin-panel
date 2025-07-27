import React from "react";
import { Card, Statistic, Typography, Spin, Alert, Button, Space } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
  TeamOutlined,
  TrophyOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDashboardStats } from "../hooks/useDashboard";
import {
  StatsGrid,
  ResponsiveCardGrid,
} from "../components/common/ResponsiveGrid";

const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value: number;
  prefix: React.ReactNode;
  suffix?: string;
  precision?: number;
  valueStyle?: React.CSSProperties;
  actionText?: string;
  onAction?: () => void;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision = 0,
  valueStyle,
  actionText,
  onAction,
  description,
}) => (
  <Card
    style={{ height: "100%" }}
    bodyStyle={{ padding: "20px" }}
    role="article"
    aria-label={`${title} statistic`}
    tabIndex={0}
  >
    <Statistic
      title={
        <Space direction="vertical" size={4}>
          <Text style={{ fontSize: 14, fontWeight: 500 }}>{title}</Text>
          {description && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {description}
            </Text>
          )}
        </Space>
      }
      value={value}
      prefix={prefix}
      suffix={suffix}
      precision={precision}
      valueStyle={valueStyle}
    />
    {actionText && onAction && (
      <Button
        type="primary"
        size="small"
        onClick={onAction}
        style={{ marginTop: 12, width: "100%" }}
        aria-label={`${actionText} - ${title}`}
      >
        {actionText}
      </Button>
    )}
  </Card>
);

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  // Error state with accessibility
  if (error) {
    return (
      <div role="main" aria-label="Dashboard error">
        <Title level={2}>Dashboard</Title>
        <Alert
          message="Unable to load dashboard"
          description={
            error.message ||
            "Failed to load dashboard statistics. Please try again."
          }
          type="error"
          showIcon
          action={
            <Button
              size="small"
              danger
              onClick={() => refetch()}
              icon={<ReloadOutlined />}
              aria-label="Retry loading dashboard"
            >
              Retry
            </Button>
          }
          role="alert"
          aria-live="polite"
        />
      </div>
    );
  }

  // Loading state with accessibility
  if (isLoading) {
    return (
      <div role="main" aria-label="Dashboard loading">
        <Title level={2}>Dashboard</Title>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
          role="status"
          aria-label="Loading dashboard data"
        >
          <Spin size="large" />
        </div>
      </div>
    );
  }

  // Main statistics data
  const mainStats = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      prefix: <UserOutlined style={{ color: "#1677ff" }} />,
      valueStyle: { color: "#1677ff" },
      actionText: "Manage Users",
      onAction: () => navigate("/users"),
      description: "Registered users in the system",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      prefix: <ShoppingOutlined style={{ color: "#52c41a" }} />,
      valueStyle: { color: "#52c41a" },
      actionText: "Manage Products",
      onAction: () => navigate("/products"),
      description: "Products in the catalog",
    },
    {
      title: "Revenue",
      value: stats?.revenue || 0,
      prefix: <DollarOutlined style={{ color: "#722ed1" }} />,
      valueStyle: { color: "#722ed1" },
      suffix: "₺",
      precision: 0,
      description: "Total revenue generated",
    },
    {
      title: "Growth",
      value: stats?.growth || 0,
      prefix: <RiseOutlined />,
      suffix: "%",
      valueStyle: {
        color: (stats?.growth || 0) >= 0 ? "#52c41a" : "#ff4d4f",
      },
      precision: 1,
      description: "Monthly growth percentage",
    },
  ];

  // Secondary statistics
  const secondaryStats = [
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      prefix: <TeamOutlined style={{ color: "#13c2c2" }} />,
      valueStyle: { color: "#13c2c2" },
      description: "Currently active users",
    },
    {
      title: "Active Products",
      value: stats?.activeProducts || 0,
      prefix: <TrophyOutlined style={{ color: "#eb2f96" }} />,
      valueStyle: { color: "#eb2f96" },
      description: "Products currently available",
    },
  ];

  return (
    <main role="main" aria-label="Dashboard">
      {/* Page header with accessibility */}
      <header style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            Dashboard
          </Title>
        </div>
        <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
          Overview of your admin panel statistics and key metrics
        </Text>
      </header>

      {/* Main statistics section */}
      <section
        aria-labelledby="main-stats-heading"
        style={{ marginBottom: 32 }}
      >
        <Title
          level={3}
          id="main-stats-heading"
          style={{ marginBottom: 16, fontSize: 18 }}
        >
          Key Metrics
        </Title>
        <StatsGrid>
          {mainStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </StatsGrid>
      </section>

      {/* Secondary statistics section */}
      <section
        aria-labelledby="activity-stats-heading"
        style={{ marginBottom: 32 }}
      >
        <Title
          level={3}
          id="activity-stats-heading"
          style={{ marginBottom: 16, fontSize: 18 }}
        >
          Activity Overview
        </Title>
        <ResponsiveCardGrid
          colSizes={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }}
          equalHeight
        >
          {secondaryStats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </ResponsiveCardGrid>
      </section>

      {/* System status section */}
      <section aria-labelledby="system-status-heading">
        <Title
          level={3}
          id="system-status-heading"
          style={{ marginBottom: 16, fontSize: 18 }}
        >
          System Status
        </Title>
        <Card
          title="System Health"
          style={{ width: "100%" }}
          role="article"
          aria-label="System health status"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Statistic
              title="System Health"
              value={100}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ flex: 1 }}>
              <Text style={{ color: "#52c41a", fontWeight: 500 }}>
                ✓ All systems operational
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                Last updated: {new Date().toLocaleString()}
              </Text>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
};

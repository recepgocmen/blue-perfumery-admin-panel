import React from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Alert,
  Button,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
  TeamOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useDashboardStats } from "../hooks/useDashboard";

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading, error, refetch } = useDashboardStats();

  if (error) {
    return (
      <Alert
        message="Error"
        description={error.message || "Failed to load dashboard stats"}
        type="error"
        action={
          <Button size="small" danger onClick={() => refetch()}>
            Retry
          </Button>
        }
      />
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Spin spinning={isLoading}>
        {/* Main Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats?.totalUsers || 0}
                prefix={<UserOutlined style={{ color: "#1677ff" }} />}
                valueStyle={{ color: "#1677ff" }}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => navigate("/users")}
                style={{ marginTop: 12 }}
                block
              >
                Manage Users
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={stats?.totalProducts || 0}
                prefix={<ShoppingOutlined style={{ color: "#52c41a" }} />}
                valueStyle={{ color: "#52c41a" }}
              />
              <Button
                type="primary"
                size="small"
                onClick={() => navigate("/products")}
                style={{ marginTop: 12 }}
                block
              >
                Manage Products
              </Button>
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Revenue"
                value={stats?.revenue || 0}
                prefix={<DollarOutlined style={{ color: "#722ed1" }} />}
                valueStyle={{ color: "#722ed1" }}
                precision={0}
                suffix="₺"
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Growth"
                value={stats?.growth || 0}
                prefix={<RiseOutlined />}
                suffix="%"
                valueStyle={{
                  color: (stats?.growth || 0) >= 0 ? "#52c41a" : "#ff4d4f",
                }}
                precision={1}
              />
            </Card>
          </Col>
        </Row>

        {/* Active Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card>
              <Statistic
                title="Active Users"
                value={stats?.activeUsers || 0}
                prefix={<TeamOutlined style={{ color: "#13c2c2" }} />}
                valueStyle={{ color: "#13c2c2" }}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card>
              <Statistic
                title="Active Products"
                value={stats?.activeProducts || 0}
                prefix={<TrophyOutlined style={{ color: "#eb2f96" }} />}
                valueStyle={{ color: "#eb2f96" }}
              />
            </Card>
          </Col>
        </Row>

        {/* System Status */}
        <Row>
          <Col span={24}>
            <Card title="System Status">
              <Statistic
                title="System Health"
                value={100}
                suffix="%"
                valueStyle={{ color: "#52c41a" }}
              />
              <div style={{ marginTop: 8, color: "#52c41a" }}>
                All systems operational
              </div>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

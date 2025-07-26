import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, Spin, message } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboardStats } from "../store/slices/dashboardSlice";
import {
  selectDashboardStats,
  selectDashboardLoading,
  selectDashboardError,
} from "../store/selectors/dashboardSelectors";

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectDashboardStats);
  const loading = useAppSelector(selectDashboardLoading);
  const error = useAppSelector(selectDashboardError);

  // Fetch dashboard stats when component mounts
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>

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

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={stats?.activeUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Products"
              value={stats?.activeProducts || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="Welcome to Admin Panel">
            <p>
              This is your admin dashboard where you can manage products and
              users. Use the navigation menu to access different sections.
            </p>
            <ul>
              <li>
                <strong>Products:</strong> View, create, edit, and delete
                products
              </li>
              <li>
                <strong>Users:</strong> Manage user accounts and permissions
              </li>
              <li>
                <strong>Dashboard:</strong> Overview of key metrics and
                statistics
              </li>
            </ul>
            <p style={{ marginTop: 16, color: "#666" }}>
              All data is loaded dynamically from Redux store and updates in
              real-time.
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

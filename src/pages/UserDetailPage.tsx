import React from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Tag,
  Avatar,
  Descriptions,
  Spin,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useUser } from "../hooks";
import type { User } from "../types";

const { Title, Text } = Typography;

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // React Query hooks for data fetching - following Context7 data patterns
  const { data: user, isLoading: loading, error } = useUser(id || "", !!id);

  // Navigation handlers - following Context7 useNavigate patterns
  const handleBackToUsers = () => {
    navigate("/users");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back in history
  };

  const handleEditUser = () => {
    if (user) {
      navigate(`/users/${user.id}/edit`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading user details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToUsers}>
            Back to Users
          </Button>
        </Space>

        <Alert
          message="Error Loading User"
          description={
            error instanceof Error ? error.message : "Failed to load user"
          }
          type="error"
          action={
            <Button
              size="small"
              danger
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  // User not found
  if (!user && !loading) {
    return (
      <div>
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToUsers}>
            Back to Users
          </Button>
        </Space>

        <Alert
          message="User Not Found"
          description={`User with ID "${id}" could not be found.`}
          type="warning"
          action={
            <Button type="primary" onClick={handleBackToUsers}>
              View All Users
            </Button>
          }
        />
      </div>
    );
  }

  if (!user) return null;

  // Utility functions - following Context7 helper patterns
  const getRoleColor = (role: User["role"]) => {
    const colorMap = {
      admin: "red",
      moderator: "orange",
      user: "blue",
    };
    return colorMap[role];
  };

  const getStatusColor = (status: User["status"]) => {
    const colorMap = {
      active: "green",
      inactive: "orange",
      banned: "red",
    };
    return colorMap[status];
  };

  return (
    <div>
      {/* Navigation Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
            Back
          </Button>
          <Button type="link" onClick={handleBackToUsers}>
            All Users
          </Button>
        </Space>
      </div>

      {/* User Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar size={64} src={user.avatar} icon={<UserOutlined />} />
              <div>
                <Title level={2} style={{ margin: 0 }}>
                  {user.name}
                </Title>
                <Text type="secondary">{user.email}</Text>
                <br />
                <Space>
                  <Tag color={getRoleColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Tag>
                  <Tag color={getStatusColor(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Tag>
                </Space>
              </div>
            </div>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditUser}
              >
                Edit User
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* User Content */}
      <Row gutter={[24, 24]}>
        {/* Left Column - User Avatar and Quick Info */}
        <Col xs={24} lg={8}>
          {/* User Avatar */}
          <Card title="Profile Picture" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                size={200}
                src={user.avatar}
                icon={<UserOutlined />}
                style={{ border: "4px solid #f0f0f0" }}
              />
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="Account Status">
            <Descriptions column={1}>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Last Login">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString() +
                    " " +
                    new Date(user.lastLogin).toLocaleTimeString()
                  : "Never"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Right Column - User Details */}
        <Col xs={24} lg={16}>
          {/* Basic Information */}
          <Card title="User Information" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Full Name" span={2}>
                <Text strong>{user.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Email Address" span={2}>
                <Text copyable>{user.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="User Role">
                <Tag color={getRoleColor(user.role)}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Account Status">
                <Tag color={getStatusColor(user.status)}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Account Created">
                {new Date(user.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(user.updatedAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Login" span={2}>
                {user.lastLogin ? (
                  <>
                    {new Date(user.lastLogin).toLocaleDateString()} at{" "}
                    {new Date(user.lastLogin).toLocaleTimeString()}
                  </>
                ) : (
                  <Text type="secondary">Never logged in</Text>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Account Warnings */}
          {user.status === "banned" && (
            <Card title="Account Alerts">
              <Alert
                message="Account Banned"
                description="This user account has been banned and cannot access the system."
                type="error"
                showIcon
              />
            </Card>
          )}

          {user.status === "inactive" && (
            <Card title="Account Alerts">
              <Alert
                message="Account Inactive"
                description="This user account is currently inactive. The user may need to reactivate their account."
                type="warning"
                showIcon
              />
            </Card>
          )}

          {!user.lastLogin && (
            <Card title="Account Alerts" style={{ marginTop: 16 }}>
              <Alert
                message="No Login History"
                description="This user has never logged into the system."
                type="info"
                showIcon
              />
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

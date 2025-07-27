import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Space,
  Row,
  Col,
  Spin,
  Alert,
  Avatar,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useUser, useUpdateUser } from "../hooks";
import type { UpdateUserData } from "../types";

const { Title } = Typography;
const { Option } = Select;

export const UserEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // React Query hooks for data fetching - following Context7 data patterns
  const { data: user, isLoading: loading, error } = useUser(id || "", !!id);
  const updateUserMutation = useUpdateUser();
  const [form] = Form.useForm();

  // Form initialization effect - following Context7 form patterns
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      });
    }
  }, [user, form]);

  // Navigation handlers - following Context7 useNavigate patterns
  const handleBack = () => {
    navigate(-1);
  };

  // Form handlers - following Context7 event handling patterns
  const handleSubmit = async (values: Omit<UpdateUserData, "id">) => {
    if (!user) return;

    try {
      const updateData: UpdateUserData = {
        ...values,
        id: user.id,
      };
      const result = await updateUserMutation.mutateAsync(updateData);
      navigate(`/users/${result.data.id}`);
    } catch {
      // Error notification is handled by the mutation hook
    }
  };

  const handleReset = () => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      });
    }
  };

  // Loading state
  if (loading && !user) {
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
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back
            </Button>
            <Button type="link" onClick={() => navigate("/users")}>
              All Users
            </Button>
          </Space>
        </div>

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
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back
            </Button>
            <Button type="link" onClick={() => navigate("/users")}>
              All Users
            </Button>
          </Space>
        </div>

        <Alert
          message="User Not Found"
          description={`User with ID "${id}" could not be found.`}
          type="warning"
          action={
            <Button type="primary" onClick={() => navigate("/users")}>
              View All Users
            </Button>
          }
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      {/* Navigation Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Back
          </Button>
          <Button type="link" onClick={() => navigate("/users")}>
            All Users
          </Button>
          <Button type="link" onClick={() => navigate(`/users/${user.id}`)}>
            View User
          </Button>
        </Space>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={48} src={user.avatar} icon={<UserOutlined />} />
          </Col>
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <EditOutlined style={{ marginRight: 8 }} />
              Edit User: {user.name}
            </Title>
          </Col>
        </Row>
      </div>

      {/* User Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={[24, 0]}>
            {/* Left Column - Basic Information */}
            <Col xs={24} lg={12}>
              <Typography.Title level={4}>Basic Information</Typography.Title>

              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the user's name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                  {
                    max: 100,
                    message: "Name must be less than 100 characters",
                  },
                ]}
              >
                <Input placeholder="Enter full name" />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter the email address" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                  {
                    max: 255,
                    message: "Email must be less than 255 characters",
                  },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>

              <Form.Item
                label="Avatar URL (Optional)"
                name="avatar"
                rules={[{ type: "url", message: "Please enter a valid URL" }]}
                extra="Profile picture for the user account"
              >
                <Input placeholder="https://example.com/avatar.jpg" />
              </Form.Item>

              {/* Avatar Preview - following Context7 form preview patterns */}
              <Form.Item shouldUpdate>
                {({ getFieldValue }) => {
                  const avatarUrl = getFieldValue("avatar");
                  const userName = getFieldValue("name");

                  if (avatarUrl || userName) {
                    return (
                      <div>
                        <Typography.Text strong>
                          Avatar Preview:
                        </Typography.Text>
                        <div style={{ marginTop: 8 }}>
                          <Avatar
                            size={64}
                            src={avatarUrl}
                            icon={<UserOutlined />}
                          />
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              </Form.Item>
            </Col>

            {/* Right Column - Account Settings */}
            <Col xs={24} lg={12}>
              <Typography.Title level={4}>Account Settings</Typography.Title>

              <Form.Item
                label="User Role"
                name="role"
                rules={[
                  { required: true, message: "Please select a user role" },
                ]}
                extra="Determines the user's permissions in the system"
              >
                <Select placeholder="Select a role">
                  <Option value="user">User - Basic access</Option>
                  <Option value="moderator">
                    Moderator - Limited admin access
                  </Option>
                  <Option value="admin">Admin - Full system access</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Account Status"
                name="status"
                rules={[{ required: true, message: "Please select a status" }]}
                extra="Current status of the user account"
              >
                <Select>
                  <Option value="active">
                    Active - User can access the system
                  </Option>
                  <Option value="inactive">
                    Inactive - User needs activation
                  </Option>
                  <Option value="banned">
                    Banned - User is blocked from access
                  </Option>
                </Select>
              </Form.Item>

              {/* Account Summary - following Context7 summary patterns */}
              <Form.Item shouldUpdate>
                {({ getFieldValue }) => {
                  const role = getFieldValue("role");
                  const status = getFieldValue("status");

                  return (
                    <Card size="small" style={{ backgroundColor: "#f8f9fa" }}>
                      <Typography.Title level={5}>
                        Account Summary
                      </Typography.Title>
                      {role && (
                        <p>
                          <strong>Role:</strong>{" "}
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </p>
                      )}
                      {status && (
                        <p>
                          <strong>Status:</strong>{" "}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </p>
                      )}
                      {user && (
                        <>
                          <p>
                            <strong>Created:</strong>{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Last Updated:</strong>{" "}
                            {new Date(user.updatedAt).toLocaleDateString()}
                          </p>
                        </>
                      )}
                    </Card>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Space size="large">
              <Button
                onClick={handleReset}
                disabled={updateUserMutation.isPending}
              >
                Reset Changes
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={updateUserMutation.isPending}
                size="large"
              >
                Update User
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

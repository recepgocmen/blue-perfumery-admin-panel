import React from "react";
import { useNavigate } from "react-router";
import { useCreateUser } from "../hooks";
import type { CreateUserData } from "../types";
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
  Avatar,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

export const UserAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createUserMutation = useCreateUser();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: CreateUserData) => {
    try {
      const result = await createUserMutation.mutateAsync(values);
      message.success(`User "${values.name}" created successfully!`);
      navigate(`/users/${result.data.id}`);
    } catch (error) {
      console.error("Failed to create user:", error);
      message.error("Failed to create user. Please try again.");
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    navigate("/users");
  };

  // Generate avatar URL based on name
  const generateAvatarUrl = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "");
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanName}`;
  };

  const handleFormValuesChange = (
    changedValues: Partial<CreateUserData>,
    allValues: CreateUserData
  ) => {
    if (changedValues.name && allValues.name && !allValues.avatar) {
      const avatarUrl = generateAvatarUrl(allValues.name);
      form.setFieldValue("avatar", avatarUrl);
    }
  };

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
        </Space>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <PlusOutlined style={{ marginRight: 8 }} />
          Add New User
        </Title>
      </div>

      {/* User Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormValuesChange}
          autoComplete="off"
          initialValues={{
            role: "user",
            status: "active",
          }}
        >
          <Row gutter={[24, 0]}>
            {/* Left Column - Basic Info */}
            <Col xs={24} lg={12}>
              <Title level={4}>Basic Information</Title>

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
                extra="Auto-generated based on name if not provided"
              >
                <Input placeholder="https://example.com/avatar.jpg" />
              </Form.Item>

              {/* Avatar Preview */}
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
                            src={
                              avatarUrl ||
                              (userName
                                ? generateAvatarUrl(userName)
                                : undefined)
                            }
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

            {/* Right Column - Role & Status */}
            <Col xs={24} lg={12}>
              <Title level={4}>Account Settings</Title>

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
                extra="Initial status for the user account"
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

              {/* Role & Status Info */}
              <Form.Item shouldUpdate>
                {({ getFieldValue }) => {
                  const role = getFieldValue("role");
                  const status = getFieldValue("status");

                  return (
                    <Card size="small" style={{ backgroundColor: "#f8f9fa" }}>
                      <Title level={5}>Account Summary</Title>
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
                      <p>
                        <strong>Created:</strong>{" "}
                        {new Date().toLocaleDateString()}
                      </p>
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
                disabled={createUserMutation.isPending}
              >
                Reset Form
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={createUserMutation.isPending}
                size="large"
              >
                Create User
              </Button>
              <Button
                onClick={handleCancel}
                disabled={createUserMutation.isPending}
              >
                Cancel
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

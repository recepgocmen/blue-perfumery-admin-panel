import React, { useEffect } from "react";
import { Card, Typography, Button, Space, Table, Tag, message } from "antd";
import type { TablePaginationConfig } from "antd";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchUsers,
  deleteUser,
  setPagination,
} from "../store/slices/usersSlice";
import {
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPagination,
} from "../store/selectors/usersSelectors";
import type { User } from "../types";

const { Title } = Typography;

const getRoleColor = (role: string) => {
  switch (role) {
    case "admin":
      return "red";
    case "moderator":
      return "orange";
    case "user":
      return "blue";
    default:
      return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "green";
    case "inactive":
      return "orange";
    case "banned":
      return "red";
    default:
      return "default";
  }
};

export const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectUsersLoading);
  const error = useAppSelector(selectUsersError);
  const pagination = useAppSelector(selectUsersPagination);

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(
      fetchUsers({
        pagination: { page: 1, limit: 10 },
      })
    );
  }, [dispatch]);

  // Show error message if there's an error
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleDeleteUser = async (userId: string) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      message.success("User deleted successfully");
    } catch {
      message.error("Failed to delete user");
    }
  };

  const handleTableChange = (paginationInfo: TablePaginationConfig) => {
    if (paginationInfo?.current && paginationInfo?.pageSize) {
      dispatch(
        setPagination({
          page: paginationInfo.current,
          limit: paginationInfo.pageSize,
        })
      );

      dispatch(
        fetchUsers({
          pagination: {
            page: paginationInfo.current,
            limit: paginationInfo.pageSize,
          },
        })
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string) => (
        <Space>
          <UserOutlined />
          {name}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
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
      render: (record: User) => (
        <Space>
          <Button type="link" size="small">
            Edit
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDeleteUser(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Users
        </Title>
        <Button type="primary" icon={<PlusOutlined />}>
          Add User
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={users.map((user) => ({ ...user, key: user.id }))}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

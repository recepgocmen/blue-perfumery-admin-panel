import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Table,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Statistic,
  Alert,
  Spin,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ClearOutlined,
  EyeOutlined,
  UserOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../store";
import {
  setFilters,
  setPagination,
  resetFilters,
} from "../store/slices/usersSlice";
import { useUsers, useDeleteUser } from "../hooks/useUsers";
import type { User, UserFilters } from "../types";
import type {
  TablePaginationConfig,
  SorterResult,
} from "antd/es/table/interface";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

// Search and Filter Components - following Context7 component patterns
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Search users..." }) => {
  return (
    <Search
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: 300 }}
      prefix={<SearchOutlined />}
      allowClear
    />
  );
};

const RoleFilter: React.FC<{
  value?: User["role"];
  onChange: (value?: User["role"]) => void;
}> = ({ value, onChange }) => {
  return (
    <Select
      placeholder="All Roles"
      value={value}
      onChange={onChange}
      style={{ width: 150 }}
      allowClear
    >
      <Option value="admin">Admin</Option>
      <Option value="moderator">Moderator</Option>
      <Option value="user">User</Option>
    </Select>
  );
};

const StatusFilter: React.FC<{
  value?: User["status"];
  onChange: (value?: User["status"]) => void;
}> = ({ value, onChange }) => {
  return (
    <Select
      placeholder="All Statuses"
      value={value}
      onChange={onChange}
      style={{ width: 150 }}
      allowClear
    >
      <Option value="active">Active</Option>
      <Option value="inactive">Inactive</Option>
      <Option value="banned">Banned</Option>
    </Select>
  );
};

// Main UsersPage Component
export const UsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux selectors for UI state - following Context7 selector patterns
  const filters = useSelector((state: RootState) => state.users.filters);
  const pagination = useSelector((state: RootState) => state.users.pagination);
  const sortParams = useSelector((state: RootState) => state.users.sortParams);

  // TanStack Query hooks for data fetching
  const {
    data: usersResponse,
    isLoading,
    error,
    refetch,
  } = useUsers(filters, pagination, sortParams);

  const deleteUserMutation = useDeleteUser();

  // Local state for search input (debounced)
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Debounced search effect - following Context7 debouncing patterns
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange({ search: searchValue });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Get users and derived data
  const users = usersResponse?.data || [];
  const totalUsers = usersResponse?.total || 0;

  // Calculate stats from current data
  const activeUsers = users.filter((u: User) => u.status === "active").length;
  const adminUsers = users.filter((u: User) => u.role === "admin").length;
  const recentUsers = users.filter((u: User) => {
    const lastLogin = new Date(u.lastLogin || "");
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastLogin > weekAgo;
  }).length;

  // Navigation handlers - following Context7 useNavigate patterns
  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const handleViewUser = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/users/${userId}`);
  };

  const handleEditUser = (userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/users/${userId}/edit`);
  };

  const handleAddUser = () => {
    navigate("/users/add");
  };

  // Filter handlers - following Context7 event handling patterns
  const handleFilterChange = (newFilters: Partial<UserFilters>) => {
    dispatch(setFilters({ ...filters, ...newFilters }));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
    setSearchValue("");
  };

  const handleDeleteUserClick = async (
    userId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent event bubbling to row click
    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // Table columns - following Context7 table patterns
  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: User) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar size={40} src={record.avatar} icon={<UserOutlined />} />
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: User["role"]) => {
        const getRoleColor = (userRole: User["role"]) => {
          const colorMap = {
            admin: "red",
            moderator: "orange",
            user: "blue",
          };
          return colorMap[userRole];
        };
        return (
          <Tag color={getRoleColor(role)}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </Tag>
        );
      },
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: User["status"]) => {
        const getStatusColor = (userStatus: User["status"]) => {
          const colorMap = {
            active: "green",
            inactive: "orange",
            banned: "red",
          };
          return colorMap[userStatus];
        };
        return (
          <Tag color={getStatusColor(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
      sorter: true,
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin: string) =>
        lastLogin
          ? new Date(lastLogin).toLocaleDateString() +
            " " +
            new Date(lastLogin).toLocaleTimeString()
          : "Never",
      sorter: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={(e) => handleViewUser(record.id, e)}
            title="View"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={(e) => handleEditUser(record.id, e)}
            title="Edit"
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDeleteUserClick(record.id, e)}
            loading={deleteUserMutation.isPending}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  // Handle table change (pagination, sorting) - following Context7 table patterns
  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    // Update pagination
    if (paginationConfig) {
      dispatch(
        setPagination({
          page: paginationConfig.current || 1,
          limit: paginationConfig.pageSize || 10,
        })
      );
    }

    // Update sorting
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    if (singleSorter?.field) {
      console.log("Sorting:", singleSorter.field, singleSorter.order);
    }
  };

  if (error) {
    return (
      <Card>
        <Alert
          message="Error"
          description={error.message || "Failed to load users"}
          type="error"
          action={
            <Button size="small" danger onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Users
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={activeUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Admin Users"
              value={adminUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Recent Logins"
              value={recentUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search users..."
            />
          </Col>
          <Col>
            <RoleFilter
              value={filters.role}
              onChange={(role) => handleFilterChange({ role })}
            />
          </Col>
          <Col>
            <StatusFilter
              value={filters.status}
              onChange={(status) => handleFilterChange({ status })}
            />
          </Col>
          <Col>
            <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Spin spinning={isLoading}>
          <Table
            columns={columns}
            dataSource={users.map((user: User) => ({ ...user, key: user.id }))}
            rowKey="id"
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: totalUsers,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
            }}
            onChange={handleTableChange}
            onRow={(record) => ({
              onClick: () => handleUserClick(record.id),
              style: { cursor: "pointer" },
            })}
          />
        </Spin>
      </Card>
    </div>
  );
};

import React, { useEffect, useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ClearOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch } from "../store";
import {
  fetchProducts,
  setFilters,
  clearError,
} from "../store/slices/productsSlice";
import {
  selectFilteredProducts,
  selectProductsLoading,
  selectProductsError,
  selectProductsFilters,
  selectAvailableCategories,
  selectProductStats,
} from "../store/selectors/productsSelectors";
import type { Product, ProductFilters } from "../types";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

// Search and Filter Components
const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Search products..." }) => {
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

const CategoryFilter: React.FC<{
  value?: string;
  onChange: (value?: string) => void;
  categories: string[];
}> = ({ value, onChange, categories }) => {
  return (
    <Select
      placeholder="All Categories"
      value={value}
      onChange={onChange}
      style={{ width: 200 }}
      allowClear
    >
      {categories.map((category) => (
        <Option key={category} value={category}>
          {category}
        </Option>
      ))}
    </Select>
  );
};

const StatusFilter: React.FC<{
  value?: Product["status"];
  onChange: (value?: Product["status"]) => void;
}> = ({ value, onChange }) => {
  const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Discontinued", value: "discontinued" },
  ];

  return (
    <Select
      placeholder="All Statuses"
      value={value}
      onChange={onChange}
      style={{ width: 150 }}
      allowClear
    >
      {statusOptions.map((status) => (
        <Option key={status.value} value={status.value}>
          {status.label}
        </Option>
      ))}
    </Select>
  );
};

// Main ProductsPage Component
export const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Redux selectors
  const filteredProducts = useSelector(selectFilteredProducts);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const filters = useSelector(selectProductsFilters);
  const availableCategories = useSelector(selectAvailableCategories);
  const stats = useSelector(selectProductStats);

  // Local state for search input (debounced)
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts({ filters, pagination: { page: 1, limit: 50 } }));
  }, [dispatch, filters]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange({ search: searchValue });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  // Navigation handlers
  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleViewProduct = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click when button is clicked
    navigate(`/products/${productId}`);
  };

  // Filter change handlers
  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    dispatch(setFilters({ ...filters, ...newFilters }));
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleClearFilters = () => {
    setSearchValue("");
    dispatch(setFilters({}));
  };

  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  // Table columns configuration
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Product) => (
        <div>
          <div style={{ fontWeight: 500, color: "#1890ff", cursor: "pointer" }}>
            {name}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>{record.sku}</div>
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
      sorter: (a: Product, b: Product) => a.price - b.price,
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
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap = {
          active: "green",
          inactive: "orange",
          discontinued: "red",
        };
        return (
          <Tag color={colorMap[status as keyof typeof colorMap]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={(e) => handleViewProduct(record.id, e)}
          >
            View
          </Button>
          <Button type="link" size="small">
            Edit
          </Button>
          <Button type="link" size="small" danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Check if any filters are active
  const hasActiveFilters = !!(
    filters.search ||
    filters.category ||
    filters.status
  );

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Products
          </Title>
          <div style={{ marginTop: 8, color: "#666" }}>
            {stats.total} products found
            {hasActiveFilters && " (filtered)"}
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          Add Product
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={stats.total}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active"
              value={stats.active}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Low Stock"
              value={stats.lowStock}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Avg Price"
              value={stats.averagePrice}
              precision={2}
              prefix="$"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Error Alert */}
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          onClose={handleErrorDismiss}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col>
            <SearchInput
              value={searchValue}
              onChange={handleSearchChange}
              placeholder="Search by name, description, or SKU..."
            />
          </Col>
          <Col>
            <CategoryFilter
              value={filters.category}
              onChange={(value) => handleFilterChange({ category: value })}
              categories={availableCategories}
            />
          </Col>
          <Col>
            <StatusFilter
              value={filters.status}
              onChange={(value) => handleFilterChange({ status: value })}
            />
          </Col>
          {hasActiveFilters && (
            <Col>
              <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Col>
          )}
          <Col flex="auto" style={{ textAlign: "right" }}>
            <Space>
              <FilterOutlined />
              <span style={{ color: "#666" }}>
                {hasActiveFilters ? "Filters Applied" : "No Filters"}
              </span>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Products Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          onRow={(record) => ({
            onClick: () => handleProductClick(record.id),
            style: { cursor: "pointer" },
            className: "hoverable-row",
          })}
          pagination={{
            total: filteredProducts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Add global hover styles for table rows */}
      <style>
        {`
          .ant-table-tbody > tr.hoverable-row:hover > td {
            background-color: #f0f2ff !important;
          }
        `}
      </style>
    </div>
  );
};

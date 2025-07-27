import React, { useState } from "react";
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
  Tabs,
  message,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  ClearOutlined,
  EyeOutlined,
  ShoppingOutlined,
  EditOutlined,
  DeleteOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../store";
import {
  setFilters,
  setPagination,
  resetFilters,
} from "../store/slices/productsSlice";
import { toggleFavorite } from "../store/slices/favoritesSlice";
import {
  selectFavoriteProducts,
  selectFavoritesCount,
} from "../store/selectors/favoritesSelectors";
import { useProducts, useDeleteProduct } from "../hooks/useProducts";
import type { Product, ProductFilters } from "../types";
import type {
  TablePaginationConfig,
  SorterResult,
} from "antd/es/table/interface";

const { Title, Text } = Typography;
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

  // Redux selectors for UI state
  const filters = useSelector((state: RootState) => state.products.filters);
  const pagination = useSelector(
    (state: RootState) => state.products.pagination
  );
  const sortParams = useSelector(
    (state: RootState) => state.products.sortParams
  );

  // TanStack Query hooks for data fetching
  const {
    data: productsResponse,
    isLoading,
    error,
    refetch,
  } = useProducts(filters, pagination, sortParams);

  const deleteProductMutation = useDeleteProduct();

  // Favorites selectors - following Context7 selector patterns
  const favoriteProducts = useSelector(selectFavoriteProducts);
  const favoritesCount = useSelector(selectFavoritesCount);

  // Local state for search input (debounced)
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // // Debounced search effect
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     handleFilterChange({ search: searchValue });
  //   }, 300);

  //   return () => clearTimeout(timeoutId);
  // }, [searchValue]);

  // Navigation handlers
  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleViewProduct = (productId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/products/${productId}`);
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/products/${productId}/edit`);
  };

  const handleAddProduct = () => {
    navigate("/products/add");
  };

  // Filter handlers
  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    dispatch(setFilters({ ...filters, ...newFilters }));
  };

  const handleClearFilters = () => {
    dispatch(resetFilters());
    setSearchValue("");
  };

  const handleDeleteProductClick = async (
    productId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // Prevent event bubbling to row click
    try {
      await deleteProductMutation.mutateAsync(productId);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Favorite handlers - following Context7 event handling patterns
  const handleToggleFavorite = (product: Product, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event bubbling to row click
    try {
      const isCurrentlyFavorited = favoriteProducts.some(
        (fav) => fav.id === product.id
      );
      dispatch(toggleFavorite(product));

      if (isCurrentlyFavorited) {
        message.success(`${product.name} removed from favorites`);
      } else {
        message.success(`${product.name} added to favorites`);
      }
    } catch {
      message.error("Failed to update favorites");
    }
  };

  // Get products and derived data
  const products = productsResponse?.data || [];
  const totalProducts = productsResponse?.total || 0;

  // Calculate stats from current data
  const activeProducts = products.filter((p) => p.status === "active").length;
  const lowStockProducts = products.filter((p) => p.stock < 10);

  // Get unique categories for filter
  const availableCategories = Array.from(
    new Set(products.map((p) => p.category))
  );

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Product) => (
        <div>
          <strong>{text}</strong>
          <br />
          <Text type="secondary">{record.brand}</Text>
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
      render: (price: number) => `₺${price.toLocaleString()}`,
      sorter: true,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => (
        <Tag color={stock < 10 ? "red" : stock < 20 ? "orange" : "green"}>
          {stock}
        </Tag>
      ),
      sorter: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: Product["status"]) => {
        const color =
          status === "active"
            ? "green"
            : status === "inactive"
            ? "orange"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Product) => {
        const isFavorited = favoriteProducts.some(
          (fav) => fav.id === record.id
        );

        return (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={(e) => handleViewProduct(record.id, e)}
              title="View"
            />
            <Button
              type="text"
              icon={isFavorited ? <HeartFilled /> : <HeartOutlined />}
              onClick={(e) => handleToggleFavorite(record, e)}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
              style={{
                color: isFavorited ? "#ff4d4f" : undefined,
              }}
            />
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditProduct(record.id)}
              title="Edit"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => handleDeleteProductClick(record.id, e)}
              loading={deleteProductMutation.isPending}
              title="Delete"
            />
          </Space>
        );
      },
    },
  ];

  // Handle table change (pagination, sorting)
  const handleTableChange = (
    paginationConfig: TablePaginationConfig,
    sorter: SorterResult<Product> | SorterResult<Product>[]
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
          description={error.message || "Failed to load products"}
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
            Products
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </Col>
      </Row>

      {/* Stats */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Products"
              value={activeProducts}
              prefix={<ShoppingOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Favorite Products"
              value={favoritesCount}
              prefix={<HeartFilled />}
              valueStyle={{
                color: favoritesCount > 0 ? "#ff4d4f" : undefined,
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Low Stock"
              value={lowStockProducts.length}
              valueStyle={{
                color: lowStockProducts.length > 0 ? "#cf1322" : undefined,
              }}
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
              placeholder="Search products..."
            />
          </Col>
          <Col>
            <CategoryFilter
              value={filters.category}
              onChange={(category) => handleFilterChange({ category })}
              categories={availableCategories}
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

      {/* Products Table with Tabs */}
      <Card>
        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: "all",
              label: `All Products (${totalProducts})`,
              children: (
                <Spin spinning={isLoading}>
                  <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    pagination={{
                      current: pagination.page,
                      pageSize: pagination.limit,
                      total: totalProducts,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} products`,
                    }}
                    onChange={handleTableChange}
                    onRow={(record) => ({
                      onClick: () => handleProductClick(record.id),
                      style: { cursor: "pointer" },
                    })}
                  />
                </Spin>
              ),
            },
            {
              key: "favorites",
              label: `Favorite Products (${favoritesCount})`,
              children: (
                <Table
                  columns={columns}
                  dataSource={favoriteProducts}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} favorites`,
                  }}
                  onRow={(record) => ({
                    onClick: () => handleProductClick(record.id),
                    style: { cursor: "pointer" },
                  })}
                  locale={{
                    emptyText:
                      favoriteProducts.length === 0
                        ? "No favorite products yet. Click the heart icon to add products to favorites!"
                        : "No favorites match current filters",
                  }}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

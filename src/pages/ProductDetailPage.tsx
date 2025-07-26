import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Typography,
  Button,
  Space,
  Row,
  Col,
  Tag,
  Image,
  Descriptions,
  Spin,
  Alert,
  Statistic,
  Divider,
  message,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  HeartOutlined,
  HeartFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import type { AppDispatch, RootState } from "../store";
import {
  fetchProductById,
  deleteProduct,
  clearSelectedProduct,
  clearError,
} from "../store/slices/productsSlice";
import {
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError,
} from "../store/selectors/productsSelectors";
import {
  toggleFavorite,
  clearError as clearFavoritesError,
} from "../store/slices/favoritesSlice";
import {
  selectIsProductFavorited,
  selectFavoritesError,
} from "../store/selectors/favoritesSelectors";

const { Title, Paragraph, Text } = Typography;

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const product = useSelector(selectSelectedProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  // Favorites selectors - following Context7 selector patterns
  const isProductFavorited = useSelector((state: RootState) =>
    product ? selectIsProductFavorited(state, product.id) : false
  );
  const favoritesError = useSelector(selectFavoritesError);

  // Fetch product data when component mounts or ID changes
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, id]);

  // Navigation handlers - following Context7 useNavigate patterns
  const handleBackToProducts = () => {
    navigate("/products");
  };

  const handleGoBack = () => {
    navigate(-1); // Go back in history
  };

  const handleEditProduct = () => {
    if (product) {
      navigate(`/products/${product.id}/edit`);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;

    Modal.confirm({
      title: "Delete Product",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(deleteProduct(product.id)).unwrap();
          message.success(
            `Product "${product.name}" has been deleted successfully`
          );
          navigate("/products");
        } catch {
          message.error("Failed to delete product. Please try again.");
        }
      },
    });
  };

  const handleErrorDismiss = () => {
    dispatch(clearError());
  };

  // Favorite handlers - following Context7 event handling patterns
  const handleToggleFavorite = () => {
    if (!product) return;

    try {
      dispatch(toggleFavorite(product));

      // Show success message - following Context7 user feedback patterns
      if (isProductFavorited) {
        message.success(`${product.name} removed from favorites`);
      } else {
        message.success(`${product.name} added to favorites`);
      }
    } catch {
      message.error("Failed to update favorites");
    }
  };

  const handleFavoritesErrorDismiss = () => {
    dispatch(clearFavoritesError());
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Loading product details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToProducts}>
            Back to Products
          </Button>
        </Space>

        <Alert
          message="Error Loading Product"
          description={error}
          type="error"
          closable
          onClose={handleErrorDismiss}
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

  // Product not found
  if (!product && !loading) {
    return (
      <div>
        <Space style={{ marginBottom: 24 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBackToProducts}>
            Back to Products
          </Button>
        </Space>

        <Alert
          message="Product Not Found"
          description={`Product with ID "${id}" could not be found.`}
          type="warning"
          action={
            <Button type="primary" onClick={handleBackToProducts}>
              View All Products
            </Button>
          }
        />
      </div>
    );
  }

  // Render product details
  if (!product) return null;

  const getStatusColor = (status: string) => {
    const colorMap = {
      active: "green",
      inactive: "orange",
      discontinued: "red",
    };
    return colorMap[status as keyof typeof colorMap] || "default";
  };

  const getStockColor = (stock: number) => {
    if (stock <= 10) return "red";
    if (stock <= 20) return "orange";
    return "green";
  };

  return (
    <div>
      {/* Navigation Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
            Back
          </Button>
          <Button type="link" onClick={handleBackToProducts}>
            All Products
          </Button>
        </Space>
      </div>

      {/* Favorites Error Alert */}
      {favoritesError && (
        <Alert
          message="Favorites Error"
          description={favoritesError}
          type="error"
          closable
          onClose={handleFavoritesErrorDismiss}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Product Header */}
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              {product.name}
            </Title>
            <Text type="secondary">SKU: {product.sku}</Text>
            <br />
            <Text strong style={{ fontSize: 18, color: "#1890ff" }}>
              ${product.price.toFixed(2)}
            </Text>
          </Col>
          <Col>
            <Space>
              {/* Favorite Button - following Context7 toggle patterns */}
              <Button
                type={isProductFavorited ? "primary" : "default"}
                icon={isProductFavorited ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleToggleFavorite}
                style={{
                  color: isProductFavorited ? "#fff" : "#ff4d4f",
                  borderColor: isProductFavorited ? "#ff4d4f" : "#ff4d4f",
                  backgroundColor: isProductFavorited
                    ? "#ff4d4f"
                    : "transparent",
                }}
              >
                {isProductFavorited ? "Favorited" : "Add to Favorites"}
              </Button>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEditProduct}
              >
                Edit Product
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteProduct}
              >
                Delete
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Product Content */}
      <Row gutter={[24, 24]}>
        {/* Left Column - Product Image and Quick Stats */}
        <Col xs={24} lg={8}>
          {/* Product Image */}
          <Card title="Product Image" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: "center" }}>
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  style={{ maxWidth: "100%", maxHeight: 300 }}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
                />
              ) : (
                <div
                  style={{
                    height: 200,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px dashed #d9d9d9",
                  }}
                >
                  <Text type="secondary">No Image Available</Text>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="Quick Stats">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Price"
                  value={product.price}
                  precision={2}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Stock"
                  value={product.stock}
                  prefix={<ShoppingCartOutlined />}
                  valueStyle={{ color: getStockColor(product.stock) }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Right Column - Product Details */}
        <Col xs={24} lg={16}>
          {/* Basic Information */}
          <Card title="Product Information" style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Name" span={2}>
                <Text strong>{product.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                <Tag color="blue">{product.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(product.status)}>
                  {product.status.charAt(0).toUpperCase() +
                    product.status.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="SKU">
                <Text code>{product.sku}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Price">
                <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                  ${product.price.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Stock Level">
                <Tag color={getStockColor(product.stock)}>
                  {product.stock} units
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(product.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(product.updatedAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Favorited" span={2}>
                <Tag color={isProductFavorited ? "red" : "default"}>
                  {isProductFavorited ? "Yes" : "No"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Description */}
          <Card title="Description">
            <Paragraph>
              {product.description ||
                "No description available for this product."}
            </Paragraph>

            {product.stock <= 10 && (
              <>
                <Divider />
                <Alert
                  message="Low Stock Warning"
                  description={`This product is running low on stock (${product.stock} units remaining). Consider restocking soon.`}
                  type="warning"
                  showIcon
                />
              </>
            )}

            {product.status === "discontinued" && (
              <>
                <Divider />
                <Alert
                  message="Product Discontinued"
                  description="This product has been discontinued and is no longer available for sale."
                  type="error"
                  showIcon
                />
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Row,
  Col,
  Spin,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useProduct, useUpdateProduct } from "../hooks";
import type { UpdateProductData } from "../types";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const ProductEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // React Query hooks for data fetching
  const {
    data: product,
    isLoading: loading,
    error,
  } = useProduct(id || "", !!id);
  const updateProductMutation = useUpdateProduct();
  const [form] = Form.useForm();

  // Update form when product data is loaded
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        status: product.status,
        stock: product.stock,
        sku: product.sku,
        image: product.image,
      });
    }
  }, [product, form]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: Omit<UpdateProductData, "id">) => {
    if (!product) return;

    try {
      const updateData: UpdateProductData = {
        ...values,
        id: product.id,
      };
      const result = await updateProductMutation.mutateAsync(updateData);
      navigate(`/products/${result.data.id}`);
    } catch {
      // Error notification is handled by the mutation hook
    }
  };

  const handleReset = () => {
    if (product) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        status: product.status,
        stock: product.stock,
        sku: product.sku,
        image: product.image,
      });
    }
  };

  // Loading state
  if (loading && !product) {
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
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back
            </Button>
            <Button type="link" onClick={() => navigate("/products")}>
              All Products
            </Button>
          </Space>
        </div>

        <Alert
          message="Error Loading Product"
          description={
            error instanceof Error ? error.message : "Failed to load product"
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

  // Product not found
  if (!product && !loading) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Back
            </Button>
            <Button type="link" onClick={() => navigate("/products")}>
              All Products
            </Button>
          </Space>
        </div>

        <Alert
          message="Product Not Found"
          description={`Product with ID "${id}" could not be found.`}
          type="warning"
          action={
            <Button type="primary" onClick={() => navigate("/products")}>
              View All Products
            </Button>
          }
        />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      {/* Navigation Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Back
          </Button>
          <Button type="link" onClick={() => navigate("/products")}>
            All Products
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            View Product
          </Button>
        </Space>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <EditOutlined style={{ marginRight: 8 }} />
          Edit Product: {product.name}
        </Title>
      </div>

      {/* Product Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Row gutter={[24, 0]}>
            {/* Left Column */}
            <Col xs={24} lg={12}>
              <Form.Item
                label="Product Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the product name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                  {
                    max: 100,
                    message: "Name must be less than 100 characters",
                  },
                ]}
              >
                <Input placeholder="Enter product name" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter a description" },
                  {
                    min: 10,
                    message: "Description must be at least 10 characters",
                  },
                  {
                    max: 500,
                    message: "Description must be less than 500 characters",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Enter product description"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select a category">
                  <Option value="Electronics">Electronics</Option>
                  <Option value="Clothing">Clothing</Option>
                  <Option value="Books">Books</Option>
                  <Option value="Home & Garden">Home & Garden</Option>
                  <Option value="Sports">Sports</Option>
                  <Option value="Toys">Toys</Option>
                  <Option value="Health & Beauty">Health & Beauty</Option>
                  <Option value="Automotive">Automotive</Option>
                  <Option value="Food & Beverages">Food & Beverages</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={12}>
              <Form.Item
                label="Price ($)"
                name="price"
                rules={[
                  { required: true, message: "Please enter the price" },
                  {
                    type: "number",
                    min: 0.01,
                    message: "Price must be greater than 0",
                  },
                  {
                    type: "number",
                    max: 999999,
                    message: "Price must be less than $999,999",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="0.00"
                  min={0.01}
                  max={999999}
                  step={0.01}
                  precision={2}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>

              <Form.Item
                label="Current Stock"
                name="stock"
                rules={[
                  { required: true, message: "Please enter the current stock" },
                  {
                    type: "number",
                    min: 0,
                    message: "Stock cannot be negative",
                  },
                  {
                    type: "number",
                    max: 999999,
                    message: "Stock must be less than 999,999",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="0"
                  min={0}
                  max={999999}
                />
              </Form.Item>

              <Form.Item
                label="SKU (Stock Keeping Unit)"
                name="sku"
                rules={[
                  { required: true, message: "Please enter the SKU" },
                  { min: 3, message: "SKU must be at least 3 characters" },
                  { max: 50, message: "SKU must be less than 50 characters" },
                ]}
              >
                <Input placeholder="Product SKU" />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                  <Option value="discontinued">Discontinued</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Image URL (Optional)"
                name="image"
                rules={[{ type: "url", message: "Please enter a valid URL" }]}
              >
                <Input placeholder="https://example.com/image.jpg" />
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Space size="large">
              <Button onClick={handleReset} disabled={loading}>
                Reset Changes
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                Update Product
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

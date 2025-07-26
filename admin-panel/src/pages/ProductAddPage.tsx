import React from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  Card,
  Typography,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  message,
  Row,
  Col,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { createProduct } from "../store/slices/productsSlice";
import { selectProductsLoading } from "../store/selectors/productsSelectors";
import type { CreateProductData } from "../types";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const ProductAddPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectProductsLoading);
  const [form] = Form.useForm();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: CreateProductData) => {
    try {
      const result = await dispatch(createProduct(values)).unwrap();
      message.success(
        `Product "${result.name}" has been created successfully!`
      );
      navigate(`/products/${result.id}`);
    } catch {
      message.error("Failed to create product. Please try again.");
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  // Generate SKU based on name
  const generateSKU = (name: string) => {
    const cleanName = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 8);
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${cleanName}-${randomSuffix}`;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name.length >= 3) {
      const sku = generateSKU(name);
      form.setFieldValue("sku", sku);
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
          <Button type="link" onClick={() => navigate("/products")}>
            All Products
          </Button>
        </Space>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <PlusOutlined style={{ marginRight: 8 }} />
          Add New Product
        </Title>
      </div>

      {/* Product Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          initialValues={{
            status: "active",
            stock: 0,
            price: 0,
          }}
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
                <Input
                  placeholder="Enter product name"
                  onChange={handleNameChange}
                />
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
                label="Initial Stock"
                name="stock"
                rules={[
                  { required: true, message: "Please enter the initial stock" },
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
                <Input
                  placeholder="Will be auto-generated from name"
                  disabled={loading}
                />
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
                Reset Form
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
                size="large"
              >
                Create Product
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

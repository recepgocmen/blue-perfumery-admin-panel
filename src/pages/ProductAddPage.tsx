import React from "react";
import { useNavigate } from "react-router";
import { useCreateProduct } from "../hooks/useProducts";
import type { CreateProductData } from "../types";
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
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export const ProductAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const createProductMutation = useCreateProduct();

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (values: CreateProductData) => {
    try {
      const result = await createProductMutation.mutateAsync(values);
      message.success(`Parfüm "${values.name}" başarıyla oluşturuldu!`);
      navigate(`/products/${result.data.id}`);
    } catch (error) {
      console.error("Failed to create product:", error);
      message.error(
        "Parfüm oluşturulurken hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const handleCancel = () => {
    navigate("/products");
  };

  // Generate SKU based on brand and name
  const generateSKU = (brand: string, name: string) => {
    const brandCode = brand
      .split(" ")
      .map((word) => word.substring(0, 3).toUpperCase())
      .join("");
    const nameCode = name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 6);
    const randomSuffix = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");
    return `${brandCode}-${nameCode}-${randomSuffix}`;
  };

  const handleFormValuesChange = (
    changedValues: Partial<CreateProductData>,
    allValues: CreateProductData
  ) => {
    if (
      (changedValues.brand || changedValues.name) &&
      allValues.brand &&
      allValues.name
    ) {
      const sku = generateSKU(allValues.brand, allValues.name);
      form.setFieldValue("sku", sku);
    }
  };

  return (
    <div>
      {/* Navigation Header */}
      <div style={{ marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            Geri
          </Button>
          <Button type="link" onClick={() => navigate("/products")}>
            Tüm Parfümler
          </Button>
        </Space>
      </div>

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <PlusOutlined style={{ marginRight: 8 }} />
          Yeni Parfüm Ekle
        </Title>
      </div>

      {/* Product Form */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          onValuesChange={handleFormValuesChange}
          autoComplete="off"
          initialValues={{
            status: "active",
            gender: "unisex",
            category: "premium",
            stock: 0,
            price: 0,
            ml: 50,
            ageRange: { min: 20, max: 45 },
            notes: [],
            characteristics: [],
          }}
        >
          <Row gutter={[24, 0]}>
            {/* Left Column - Basic Info */}
            <Col xs={24} lg={12}>
              <Title level={4}>Temel Bilgiler</Title>

              <Form.Item
                label="Parfüm Adı"
                name="name"
                rules={[
                  { required: true, message: "Lütfen parfüm adını girin" },
                  { min: 2, message: "Parfüm adı en az 2 karakter olmalı" },
                  {
                    max: 100,
                    message: "Parfüm adı en fazla 100 karakter olmalı",
                  },
                ]}
              >
                <Input placeholder="Parfüm adını girin" />
              </Form.Item>

              <Form.Item
                label="Marka"
                name="brand"
                rules={[{ required: true, message: "Lütfen marka seçin" }]}
              >
                <Select placeholder="Marka seçin">
                  <Option value="Blue Perfumery Exclusive">
                    Blue Perfumery Exclusive
                  </Option>
                  <Option value="Blue Perfumery Premium">
                    Blue Perfumery Premium
                  </Option>
                  <Option value="Blue Perfumery Luxury">
                    Blue Perfumery Luxury
                  </Option>
                  <Option value="Blue Perfumery Classic">
                    Blue Perfumery Classic
                  </Option>
                  <Option value="Blue Perfumery Urban">
                    Blue Perfumery Urban
                  </Option>
                  <Option value="Blue Perfumery Artisanal">
                    Blue Perfumery Artisanal
                  </Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Açıklama"
                name="description"
                rules={[
                  { required: true, message: "Lütfen açıklama girin" },
                  { min: 10, message: "Açıklama en az 10 karakter olmalı" },
                  {
                    max: 500,
                    message: "Açıklama en fazla 500 karakter olmalı",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Parfüm açıklamasını girin"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Cinsiyet"
                    name="gender"
                    rules={[
                      { required: true, message: "Lütfen cinsiyet seçin" },
                    ]}
                  >
                    <Select>
                      <Option value="male">Erkek</Option>
                      <Option value="female">Kadın</Option>
                      <Option value="unisex">Unisex</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Kategori"
                    name="category"
                    rules={[
                      { required: true, message: "Lütfen kategori seçin" },
                    ]}
                  >
                    <Select>
                      <Option value="woman">Kadın</Option>
                      <Option value="man">Erkek</Option>
                      <Option value="unisex">Unisex</Option>
                      <Option value="niches">Niche</Option>
                      <Option value="urban">Urban</Option>
                      <Option value="classic">Classic</Option>
                      <Option value="luxury">Luxury</Option>
                      <Option value="premium">Premium</Option>
                      <Option value="exclusive">Exclusive</Option>
                      <Option value="artisanal">Artisanal</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            {/* Right Column - Pricing & Stock */}
            <Col xs={24} lg={12}>
              <Title level={4}>Fiyat ve Stok</Title>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Fiyat (₺)"
                    name="price"
                    rules={[
                      { required: true, message: "Lütfen fiyat girin" },
                      {
                        type: "number",
                        min: 1,
                        message: "Fiyat 0'dan büyük olmalı",
                      },
                      {
                        type: "number",
                        max: 50000,
                        message: "Fiyat 50,000 TL'den az olmalı",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="0"
                      min={1}
                      max={50000}
                      formatter={(value) =>
                        `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Orijinal Fiyat (₺)" name="originalPrice">
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="0"
                      min={0}
                      max={50000}
                      formatter={(value) =>
                        `₺ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Hacim (ml)"
                    name="ml"
                    rules={[
                      { required: true, message: "Lütfen hacim girin" },
                      {
                        type: "number",
                        min: 1,
                        message: "Hacim 0'dan büyük olmalı",
                      },
                      {
                        type: "number",
                        max: 1000,
                        message: "Hacim 1000ml'den az olmalı",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="50"
                      min={1}
                      max={1000}
                      addonAfter="ml"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Başlangıç Stok"
                    name="stock"
                    rules={[
                      { required: true, message: "Lütfen stok girin" },
                      {
                        type: "number",
                        min: 0,
                        message: "Stok negatif olamaz",
                      },
                      {
                        type: "number",
                        max: 9999,
                        message: "Stok 9999'dan az olmalı",
                      },
                    ]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      placeholder="0"
                      min={0}
                      max={9999}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="SKU (Stok Kodu)"
                name="sku"
                rules={[
                  { required: true, message: "Lütfen SKU girin" },
                  { min: 3, message: "SKU en az 3 karakter olmalı" },
                  { max: 50, message: "SKU en fazla 50 karakter olmalı" },
                ]}
              >
                <Input
                  placeholder="Marka ve ürün adından otomatik oluşturulacak"
                  disabled={createProductMutation.isPending}
                />
              </Form.Item>

              <Form.Item
                label="Durum"
                name="status"
                rules={[{ required: true, message: "Lütfen durum seçin" }]}
              >
                <Select>
                  <Option value="active">Aktif</Option>
                  <Option value="inactive">Pasif</Option>
                  <Option value="discontinued">Üretimi Durduruldu</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Görsel URL (Opsiyonel)"
                name="image"
                rules={[
                  { type: "url", message: "Lütfen geçerli bir URL girin" },
                ]}
              >
                <Input placeholder="https://blueperfumery.com/..." />
              </Form.Item>

              <Form.Item
                label="Shopier Link (Opsiyonel)"
                name="shopierLink"
                rules={[
                  { type: "url", message: "Lütfen geçerli bir URL girin" },
                ]}
              >
                <Input placeholder="https://www.shopier.com/blueperfumery/..." />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Fragrance Details */}
          <Row gutter={[24, 0]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Koku Notaları</Title>

              <Form.Item
                label="Notalar"
                name="notes"
                rules={[
                  { required: true, message: "Lütfen en az bir nota ekleyin" },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="Notaları girin (Enter ile ekleyin)"
                  tokenSeparators={[","]}
                >
                  <Option value="amber">Amber</Option>
                  <Option value="vanilya">Vanilya</Option>
                  <Option value="sedir">Sedir</Option>
                  <Option value="gül">Gül</Option>
                  <Option value="yasemin">Yasemin</Option>
                  <Option value="ud">Ud</Option>
                  <Option value="sandal ağacı">Sandal Ağacı</Option>
                  <Option value="lavanta">Lavanta</Option>
                  <Option value="bergamot">Bergamot</Option>
                  <Option value="portakal çiçeği">Portakal Çiçeği</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Özellikler"
                name="characteristics"
                rules={[
                  {
                    required: true,
                    message: "Lütfen en az bir özellik ekleyin",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  placeholder="Özellikleri girin (Enter ile ekleyin)"
                  tokenSeparators={[","]}
                >
                  <Option value="tatlı">Tatlı</Option>
                  <Option value="odunsu">Odunsu</Option>
                  <Option value="çiçeksi">Çiçeksi</Option>
                  <Option value="ferah">Ferah</Option>
                  <Option value="baharatlı">Baharatlı</Option>
                  <Option value="oryantal">Oryantal</Option>
                  <Option value="meyveli">Meyveli</Option>
                  <Option value="deri">Deri</Option>
                  <Option value="deniz">Deniz</Option>
                  <Option value="zarif">Zarif</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} lg={12}>
              <Title level={4}>Yaş Aralığı</Title>

              <Form.Item label="Yaş Aralığı">
                <Input.Group>
                  <Row gutter={8}>
                    <Col span={11}>
                      <Form.Item
                        name={["ageRange", "min"]}
                        rules={[
                          { required: true, message: "Min yaş gerekli" },
                          {
                            type: "number",
                            min: 16,
                            max: 80,
                            message: "16-80 arası olmalı",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Min"
                          min={16}
                          max={80}
                          style={{ width: "100%" }}
                          addonAfter="yaş"
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      style={{ textAlign: "center", lineHeight: "32px" }}
                    >
                      -
                    </Col>
                    <Col span={11}>
                      <Form.Item
                        name={["ageRange", "max"]}
                        rules={[
                          { required: true, message: "Max yaş gerekli" },
                          {
                            type: "number",
                            min: 16,
                            max: 80,
                            message: "16-80 arası olmalı",
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Max"
                          min={16}
                          max={80}
                          style={{ width: "100%" }}
                          addonAfter="yaş"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Input.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <div style={{ marginTop: 32, textAlign: "center" }}>
            <Space size="large">
              <Button
                onClick={handleReset}
                disabled={createProductMutation.isPending}
              >
                Formu Sıfırla
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={createProductMutation.isPending}
                size="large"
              >
                Parfüm Oluştur
              </Button>
              <Button
                onClick={handleCancel}
                disabled={createProductMutation.isPending}
              >
                İptal
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

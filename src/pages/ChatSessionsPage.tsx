import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Table,
  Tag,
  Statistic,
  Row,
  Col,
  Spin,
  Modal,
  Button,
  Space,
  Avatar,
  List,
  Tooltip,
  message,
} from "antd";
import {
  MessageOutlined,
  UserOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import apiClient from "../config/api";

const { Title, Text } = Typography;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  recommendedProducts?: {
    id: string;
    name: string;
    brand: string;
  }[];
}

interface ChatSession {
  _id: string;
  sessionId: string;
  visitorId: string;
  userAgent: string;
  ip: string;
  device: string;
  browser: string;
  os: string;
  messages: ChatMessage[];
  messageCount: number;
  firstMessageAt: string;
  lastMessageAt: string;
  isActive: boolean;
  createdAt: string;
}

interface Stats {
  totalSessions: number;
  todaySessions: number;
  totalMessages: number;
  uniqueVisitors: number;
  activeSessions: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ChatSessionsPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Verileri yükle
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const [sessionsRes, statsRes] = await Promise.all([
        apiClient.get(`/chat-sessions?page=${page}&limit=20`),
        apiClient.get("/chat-sessions/stats/overview"),
      ]);

      setSessions(sessionsRes.data.data || []);
      setPagination(sessionsRes.data.pagination || pagination);
      setStats(statsRes.data.data || null);
    } catch (error) {
      console.error("Failed to fetch chat sessions:", error);
      message.error("Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Session detaylarını getir
  const fetchSessionDetail = async (sessionId: string) => {
    setDetailLoading(true);
    try {
      const res = await apiClient.get(`/chat-sessions/${sessionId}`);
      setSelectedSession(res.data.data);
      setDetailModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch session detail:", error);
      message.error("Detaylar yüklenirken hata oluştu");
    } finally {
      setDetailLoading(false);
    }
  };

  // Session sil
  const deleteSession = async (sessionId: string) => {
    try {
      await apiClient.delete(`/chat-sessions/${sessionId}`);
      message.success("Oturum silindi");
      fetchData(pagination.page);
    } catch (error) {
      console.error("Failed to delete session:", error);
      message.error("Silme işlemi başarısız");
    }
  };

  // Device icon
  const getDeviceIcon = (device: string) => {
    switch (device?.toLowerCase()) {
      case "mobile":
        return <MobileOutlined />;
      case "tablet":
        return <TabletOutlined />;
      default:
        return <DesktopOutlined />;
    }
  };

  // Tarih formatı
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Tablo kolonları
  const columns: ColumnsType<ChatSession> = [
    {
      title: "Ziyaretçi",
      key: "visitor",
      render: (_, record) => (
        <Space>
          <Avatar
            size="small"
            icon={<UserOutlined />}
            style={{ backgroundColor: "#1890ff" }}
          />
          <Tooltip title={record.visitorId}>
            <Text code style={{ fontSize: 11 }}>
              {record.visitorId.slice(0, 12)}...
            </Text>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Cihaz",
      key: "device",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {getDeviceIcon(record.device)}
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.browser}
          </Text>
        </Space>
      ),
    },
    {
      title: "Mesaj",
      dataIndex: "messageCount",
      key: "messageCount",
      width: 80,
      align: "center",
      render: (count: number) => (
        <Tag color="blue" icon={<MessageOutlined />}>
          {count}
        </Tag>
      ),
    },
    {
      title: "İlk Mesaj",
      dataIndex: "firstMessageAt",
      key: "firstMessageAt",
      width: 150,
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
      ),
    },
    {
      title: "Son Mesaj",
      dataIndex: "lastMessageAt",
      key: "lastMessageAt",
      width: 150,
      render: (date: string) => (
        <Text style={{ fontSize: 12 }}>{formatDate(date)}</Text>
      ),
    },
    {
      title: "Durum",
      dataIndex: "isActive",
      key: "isActive",
      width: 80,
      align: "center",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">Aktif</Tag>
        ) : (
          <Tag color="default">Kapandı</Tag>
        ),
    },
    {
      title: "İşlem",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => fetchSessionDetail(record.sessionId)}
            loading={detailLoading}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Oturumu Sil",
                content: "Bu sohbet oturumunu silmek istediğinize emin misiniz?",
                okText: "Sil",
                cancelText: "İptal",
                onOk: () => deleteSession(record.sessionId),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            💬 Chat Oturumları
          </Title>
          <Text type="secondary">Ziyaretçi sohbet geçmişi</Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => fetchData(pagination.page)}
          loading={loading}
        >
          Yenile
        </Button>
      </div>

      {/* İstatistikler */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic
                title="Toplam Oturum"
                value={stats.totalSessions}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Bugün"
                value={stats.todaySessions}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Toplam Mesaj"
                value={stats.totalMessages}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Benzersiz Ziyaretçi"
                value={stats.uniqueVisitors}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Aktif Oturum"
                value={stats.activeSessions}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Tablo */}
      <Card>
        <Spin spinning={loading}>
          <Table
            columns={columns}
            dataSource={sessions}
            rowKey="sessionId"
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.total,
              showSizeChanger: false,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} / ${total} oturum`,
              onChange: (page) => fetchData(page),
            }}
            size="middle"
          />
        </Spin>
      </Card>

      {/* Detay Modal */}
      <Modal
        title={
          <Space>
            <MessageOutlined />
            <span>Sohbet Detayı</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedSession(null);
        }}
        footer={null}
        width={600}
      >
        {selectedSession && (
          <div>
            {/* Ziyaretçi Bilgileri */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Text type="secondary">Ziyaretçi ID:</Text>
                  <br />
                  <Text code style={{ fontSize: 11 }}>
                    {selectedSession.visitorId}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Cihaz:</Text>
                  <br />
                  <Space>
                    {getDeviceIcon(selectedSession.device)}
                    <Text>
                      {selectedSession.browser} / {selectedSession.os}
                    </Text>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: 8 }}>
                <Col span={12}>
                  <Text type="secondary">IP:</Text>
                  <br />
                  <Text>{selectedSession.ip || "-"}</Text>
                </Col>
                <Col span={12}>
                  <Text type="secondary">Mesaj Sayısı:</Text>
                  <br />
                  <Tag color="blue">{selectedSession.messageCount}</Tag>
                </Col>
              </Row>
            </Card>

            {/* Mesajlar */}
            <div
              style={{
                maxHeight: 400,
                overflowY: "auto",
                background: "#f5f5f5",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <List
                dataSource={[...selectedSession.messages].sort(
                  (a, b) =>
                    new Date(a.timestamp).getTime() -
                    new Date(b.timestamp).getTime()
                )}
                renderItem={(msg, index) => (
                  <List.Item
                    key={index}
                    style={{
                      padding: "8px 0",
                      border: "none",
                      display: "flex",
                      flexDirection: msg.role === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    {/* Avatar */}
                    <Avatar
                      size={32}
                      style={{
                        backgroundColor:
                          msg.role === "user" ? "#1890ff" : "#52c41a",
                        flexShrink: 0,
                      }}
                      icon={
                        msg.role === "user" ? (
                          <UserOutlined />
                        ) : (
                          <MessageOutlined />
                        )
                      }
                    />

                    {/* Mesaj İçeriği */}
                    <div
                      style={{
                        maxWidth: "75%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {/* İsim Etiketi */}
                      <Text
                        type="secondary"
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          paddingLeft: msg.role === "user" ? 0 : 4,
                          paddingRight: msg.role === "user" ? 4 : 0,
                          textAlign: msg.role === "user" ? "right" : "left",
                        }}
                      >
                        {msg.role === "user" ? "Ziyaretçi" : "Mira"}
                      </Text>

                      {/* Mesaj Balonu */}
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: 12,
                          background: msg.role === "user" ? "#1890ff" : "#fff",
                          color: msg.role === "user" ? "#fff" : "#000",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                          border:
                            msg.role === "assistant"
                              ? "1px solid #e8e8e8"
                              : "none",
                        }}
                      >
                        <Text
                          style={{
                            color: msg.role === "user" ? "#fff" : "#000",
                            whiteSpace: "pre-wrap",
                            display: "block",
                          }}
                        >
                          {msg.content}
                        </Text>
                        {msg.recommendedProducts &&
                          msg.recommendedProducts.length > 0 && (
                            <div style={{ marginTop: 8 }}>
                              {msg.recommendedProducts.map((p) => (
                                <Tag key={p.id} color="gold" style={{ marginBottom: 4 }}>
                                  {p.name}
                                </Tag>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Zaman */}
                      <Text
                        style={{
                          fontSize: 10,
                          color: "#999",
                          paddingLeft: msg.role === "user" ? 0 : 4,
                          paddingRight: msg.role === "user" ? 4 : 0,
                          textAlign: msg.role === "user" ? "right" : "left",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ChatSessionsPage;

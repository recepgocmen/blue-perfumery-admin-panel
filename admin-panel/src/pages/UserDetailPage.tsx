import React from "react";
import { useParams } from "react-router";
import { Card, Typography, Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <Space style={{ marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => window.history.back()}
        >
          Back to Users
        </Button>
      </Space>

      <Title level={2}>User Details</Title>

      <Card>
        <Title level={4}>User ID: {id}</Title>
        <Paragraph>
          This is a placeholder for the user detail page. Here you would display
          detailed information about the user, including:
        </Paragraph>
        <ul>
          <li>User profile information</li>
          <li>Contact details</li>
          <li>Role and permissions</li>
          <li>Activity history</li>
          <li>Edit and manage actions</li>
        </ul>
      </Card>
    </div>
  );
};

import React from "react";
import {
  Table,
  Card,
  Space,
  Button,
  Grid,
  Typography,
  Row,
  Col,
  Tooltip,
} from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableProps, ColumnType } from "antd/es/table";

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;

// Define action type with proper typing
export interface TableAction<T> {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: (record: T) => void;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  danger?: boolean;
  disabled?: (record: T) => boolean;
}

interface ResponsiveTableProps<T extends Record<string, unknown>>
  extends Omit<TableProps<T>, "scroll"> {
  /** Custom mobile card renderer */
  mobileCardRender?: (record: T, index: number) => React.ReactNode;
  /** Whether to show actions column */
  showActions?: boolean;
  /** Custom actions for each row */
  actions?: TableAction<T>[];
  /** Table title for accessibility */
  tableTitle?: string;
  /** Additional table description for screen readers */
  tableDescription?: string;
}

export function ResponsiveTable<T extends Record<string, unknown>>({
  columns = [],
  dataSource = [],
  mobileCardRender,
  showActions = false,
  actions = [],
  tableTitle,
  tableDescription,
  pagination,
  loading,
  ...props
}: ResponsiveTableProps<T>) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Default actions if none provided but showActions is true
  const defaultActions: TableAction<T>[] = [
    {
      key: "view",
      icon: <EyeOutlined />,
      label: "View",
      onClick: (record: T) => console.log("View", record),
      type: "default",
    },
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit",
      onClick: (record: T) => console.log("Edit", record),
      type: "primary",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      onClick: (record: T) => console.log("Delete", record),
      type: "text",
      danger: true,
    },
  ];

  const tableActions = actions.length > 0 ? actions : defaultActions;

  // Add actions column if showActions is true
  const enhancedColumns: ColumnType<T>[] = showActions
    ? [
        ...columns,
        {
          title: "Actions",
          key: "actions",
          width: isMobile ? 80 : 150,
          fixed: "right",
          render: (_, record) => (
            <Space size="small">
              {tableActions.map((action) => {
                const isDisabled = action.disabled
                  ? action.disabled(record)
                  : false;

                return (
                  <Tooltip key={action.key} title={action.label}>
                    <Button
                      type={action.type}
                      danger={action.danger}
                      disabled={isDisabled}
                      icon={action.icon}
                      size="small"
                      onClick={() => action.onClick(record)}
                      aria-label={`${action.label} item`}
                    >
                      {!isMobile && action.label}
                    </Button>
                  </Tooltip>
                );
              })}
            </Space>
          ),
        },
      ]
    : columns;

  // Default mobile card renderer
  const defaultMobileCardRender = (record: T, index: number) => {
    // Get the first few columns for mobile display
    const displayColumns = columns.slice(0, 3) as ColumnType<T>[];

    return (
      <Card
        key={String(record.key || record.id || index)}
        size="small"
        style={{ marginBottom: 12 }}
        bodyStyle={{ padding: 16 }}
        role="article"
        aria-label={`Item ${index + 1}`}
      >
        <Row align="middle" gutter={[12, 8]}>
          <Col flex="auto">
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              {displayColumns.map((col, colIndex) => {
                if (!col.dataIndex) return null;

                const value = record[col.dataIndex as keyof T];
                const displayValue = col.render
                  ? col.render(value, record, index)
                  : String(value || "");

                return (
                  <div key={colIndex}>
                    <Text
                      strong={colIndex === 0}
                      type={colIndex > 0 ? "secondary" : undefined}
                      style={{ fontSize: colIndex === 0 ? 16 : 14 }}
                    >
                      {typeof displayValue === "string" ||
                      typeof displayValue === "number"
                        ? displayValue
                        : "[Complex value]"}
                    </Text>
                  </div>
                );
              })}
            </Space>
          </Col>

          {/* Actions on mobile */}
          {showActions && (
            <Col flex="none">
              <Space>
                {tableActions.slice(0, 2).map((action) => (
                  <Button
                    key={action.key}
                    type={action.type}
                    danger={action.danger}
                    disabled={action.disabled ? action.disabled(record) : false}
                    icon={action.icon}
                    size="small"
                    onClick={() => action.onClick(record)}
                    aria-label={`${action.label} item`}
                  />
                ))}
              </Space>
            </Col>
          )}
        </Row>
      </Card>
    );
  };

  // Mobile view - render cards
  if (isMobile) {
    return (
      <div role="region" aria-label={tableTitle || "Data table"}>
        {tableTitle && (
          <Title level={4} style={{ marginBottom: 16 }}>
            {tableTitle}
          </Title>
        )}

        {tableDescription && (
          <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
            {tableDescription}
          </Text>
        )}

        <div role="list" aria-label="Table data as cards">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} loading style={{ marginBottom: 12 }} />
              ))
            : dataSource.map((record, index) =>
                mobileCardRender
                  ? mobileCardRender(record, index)
                  : defaultMobileCardRender(record, index)
              )}
        </div>

        {/* Mobile pagination */}
        {pagination && dataSource.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 16 }}>
            {typeof pagination === "object" ? (
              <div style={{ fontSize: 12, color: "#666" }}>
                {pagination.current && pagination.total && (
                  <Text type="secondary">
                    Page {pagination.current} of{" "}
                    {Math.ceil(pagination.total / (pagination.pageSize || 10))}
                  </Text>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // Desktop view - render table
  return (
    <div role="region" aria-label={tableTitle || "Data table"}>
      {tableTitle && (
        <Title level={4} style={{ marginBottom: 16 }}>
          {tableTitle}
        </Title>
      )}

      {tableDescription && (
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          {tableDescription}
        </Text>
      )}

      <Table
        {...props}
        columns={enhancedColumns}
        dataSource={dataSource}
        loading={loading}
        pagination={pagination}
        scroll={{
          x: "max-content",
          scrollToFirstRowOnChange: true,
        }}
        size={screens.lg ? "middle" : "small"}
        // Accessibility attributes
        aria-label={tableTitle || "Data table"}
        aria-describedby={tableDescription ? "table-description" : undefined}
        // Ensure proper keyboard navigation
        onRow={(record, index) => ({
          tabIndex: 0,
          role: "row",
          "aria-rowindex": (index || 0) + 2, // +2 because header is row 1
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              // Handle row selection or default action
              if (showActions && tableActions.length > 0) {
                e.preventDefault();
                tableActions[0].onClick(record);
              }
            }
          },
          ...props.onRow?.(record, index),
        })}
      />

      {tableDescription && (
        <div id="table-description" style={{ display: "none" }}>
          {tableDescription}
        </div>
      )}
    </div>
  );
}

export default ResponsiveTable;

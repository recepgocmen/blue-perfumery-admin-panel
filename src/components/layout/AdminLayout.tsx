import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import {
  Layout,
  Menu,
  Button,
  theme,
  Avatar,
  Dropdown,
  Space,
  Drawer,
  Grid,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    path: "/",
  },
  {
    key: "products",
    icon: <ShoppingOutlined />,
    label: "Products",
    path: "/products",
  },
  {
    key: "users",
    icon: <UserOutlined />,
    label: "Users",
    path: "/users",
  },
  {
    key: "chat-sessions",
    icon: <MessageOutlined />,
    label: "Chat Sessions",
    path: "/chat-sessions",
  },
];

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const screens = useBreakpoint();

  // Mobile-first responsive behavior
  const isMobile = !screens.md;

  // Effect to handle responsive behavior
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setMobileDrawerOpen(false);
    }
  }, [isMobile]);

  // Skip to main content for keyboard users
  const skipToMain = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    }
  };

  // Get selected menu key based on current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path.startsWith("/products")) return "products";
    if (path.startsWith("/users")) return "users";
    if (path.startsWith("/chat-sessions")) return "chat-sessions";
    return "dashboard";
  };

  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
    // Close mobile drawer when menu item is clicked
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, item: MenuItem) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMenuClick(item);
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  const siderContent = (
    <>
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: token.colorPrimary,
            fontSize: collapsed ? "18px" : "20px",
            fontWeight: 600,
          }}
          aria-label="Admin Panel Logo"
        >
          {collapsed ? "BP" : "Blue Perfumery Admin"}
        </h1>
      </div>
      <nav role="navigation" aria-label="Main navigation">
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          style={{ border: "none" }}
          items={menuItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item),
            onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, item),
            role: "menuitem",
            tabIndex: 0,
            "aria-label": `Navigate to ${item.label}`,
          }))}
        />
      </nav>
    </>
  );

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          skipToMain();
        }}
        style={{
          position: "absolute",
          left: "-9999px",
          zIndex: 9999,
          padding: "8px 16px",
          backgroundColor: token.colorPrimary,
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
        }}
        onFocus={(e) => {
          e.target.style.left = "16px";
          e.target.style.top = "16px";
        }}
        onBlur={(e) => {
          e.target.style.left = "-9999px";
        }}
      >
        Skip to main content
      </a>

      <Layout style={{ minHeight: "100vh" }}>
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={280}
            collapsedWidth={80}
            style={{
              background: token.colorBgContainer,
              borderRight: `1px solid ${token.colorBorder}`,
            }}
            role="complementary"
            aria-label="Sidebar navigation"
          >
            {siderContent}
          </Sider>
        )}

        {/* Mobile Drawer */}
        <Drawer
          title="Navigation"
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          bodyStyle={{ padding: 0 }}
          width={280}
          style={{ display: isMobile ? "block" : "none" }}
        >
          {siderContent}
        </Drawer>

        <Layout>
          <Header
            style={{
              padding: "0 16px",
              background: token.colorBgContainer,
              borderBottom: `1px solid ${token.colorBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
            role="banner"
          >
            <Button
              type="text"
              icon={
                isMobile ? (
                  <MenuUnfoldOutlined />
                ) : collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerOpen(!mobileDrawerOpen);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
              aria-label={
                isMobile
                  ? "Open navigation menu"
                  : collapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
              }
              aria-expanded={isMobile ? mobileDrawerOpen : !collapsed}
            />

            <Space>
              <Dropdown
                menu={{
                  items: userMenuItems,
                  onClick: (info) => {
                    if (info.key === "logout") {
                      // Handle logout
                      console.log("Logout clicked");
                    }
                  },
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button
                  type="text"
                  style={{
                    cursor: "pointer",
                    height: "auto",
                    padding: "8px 12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  aria-label="User menu"
                  aria-haspopup="menu"
                >
                  <Avatar
                    size={32}
                    style={{ backgroundColor: token.colorPrimary }}
                    icon={<UserOutlined />}
                  />
                  {!isMobile && <span>Admin User</span>}
                </Button>
              </Dropdown>
            </Space>
          </Header>
          <Content
            id="main-content"
            tabIndex={-1}
            style={{
              margin: screens.xs ? "8px" : "16px",
              padding: screens.xs ? "12px" : "16px",
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              minHeight: "calc(100vh - 112px)",
              outline: "none",
            }}
            role="main"
            aria-label="Main content"
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

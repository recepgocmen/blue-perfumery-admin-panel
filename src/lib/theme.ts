import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

export const theme: ThemeConfig = {
  token: {
    // Seed tokens - primary colors and basic design values
    colorPrimary: "#1677ff", // Primary blue color
    colorSuccess: "#52c41a", // Success green
    colorWarning: "#faad14", // Warning orange
    colorError: "#ff4d4f", // Error red
    colorInfo: "#1677ff", // Info blue

    // Typography
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,

    // Spacing
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,

    // Border
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,

    // Layout
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f5f5f5",
    colorBgElevated: "#ffffff",
  },
  components: {
    Layout: {
      headerBg: "#ffffff", // Light header background
      headerHeight: 64,
      siderBg: "#ffffff", // Light sidebar background
      triggerBg: "#f5f5f5",
      triggerColor: "#000",
    },
    Menu: {
      itemBg: "#ffffff",
      itemSelectedBg: "#e6f4ff",
      itemHoverBg: "#f5f5f5",
      itemSelectedColor: "#1677ff",
    },
    Table: {
      headerBg: "#fafafa",
      rowHoverBg: "#f5f5f5",
    },
    Button: {
      borderRadius: 6,
    },
    Card: {
      borderRadiusLG: 8,
    },
  },
};

// Extended theme for different contexts
export const lightTheme: ThemeConfig = {
  ...theme,
  token: {
    ...theme.token,
    colorBgContainer: "#ffffff",
    colorBgLayout: "#f0f2f5",
  },
};

export const darkTheme: ThemeConfig = {
  ...theme,
  algorithm: antdTheme.darkAlgorithm,
  token: {
    ...theme.token,
    colorBgContainer: "#141414",
    colorBgLayout: "#000000",
  },
  components: {
    ...theme.components,
    Layout: {
      ...theme.components?.Layout,
      headerBg: "#141414",
      siderBg: "#141414",
    },
  },
};

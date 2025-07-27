import type { ThemeConfig } from "antd";
import { theme as antdTheme } from "antd";

// Responsive breakpoints (matching Ant Design standard)
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

// Accessibility-focused color palette with WCAG AA compliant contrast ratios
export const accessibleColors = {
  // Primary colors with proper contrast
  primary: "#1677ff",
  primaryHover: "#4096ff",
  primaryActive: "#0958d9",
  primaryBg: "#e6f4ff",
  primaryBorder: "#91caff",
  primaryText: "#ffffff",

  // Status colors with accessibility in mind
  success: "#52c41a",
  successBg: "#f6ffed",
  warning: "#faad14",
  warningBg: "#fffbe6",
  error: "#ff4d4f",
  errorBg: "#fff2f0",
  info: "#1677ff",
  infoBg: "#e6f4ff",

  // Neutral colors for better readability
  textPrimary: "#262626",
  textSecondary: "#595959",
  textTertiary: "#8c8c8c",
  textQuaternary: "#bfbfbf",
  textDisabled: "#00000040",

  // Background colors
  bgPrimary: "#ffffff",
  bgSecondary: "#fafafa",
  bgTertiary: "#f5f5f5",
  bgDisabled: "#f5f5f5",

  // Border colors
  borderPrimary: "#d9d9d9",
  borderSecondary: "#f0f0f0",
  borderLight: "#f5f5f5",
};

// Responsive spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

// Typography scale for responsive design
export const typography = {
  fontSizeBase: 14,
  fontSizeSM: 12,
  fontSizeLG: 16,
  fontSizeXL: 20,
  fontSizeHeading1: 38,
  fontSizeHeading2: 30,
  fontSizeHeading3: 24,
  fontSizeHeading4: 20,
  fontSizeHeading5: 16,
  lineHeightBase: 1.5714,
  lineHeightLG: 1.5,
  lineHeightSM: 1.66,
};

export const theme: ThemeConfig = {
  token: {
    // Primary colors
    colorPrimary: accessibleColors.primary,
    colorPrimaryHover: accessibleColors.primaryHover,
    colorPrimaryActive: accessibleColors.primaryActive,
    colorPrimaryBg: accessibleColors.primaryBg,
    colorPrimaryBorder: accessibleColors.primaryBorder,

    // Status colors
    colorSuccess: accessibleColors.success,
    colorWarning: accessibleColors.warning,
    colorError: accessibleColors.error,
    colorInfo: accessibleColors.info,

    // Typography
    fontSize: typography.fontSizeBase,
    fontSizeSM: typography.fontSizeSM,
    fontSizeLG: typography.fontSizeLG,
    fontSizeXL: typography.fontSizeXL,
    fontSizeHeading1: typography.fontSizeHeading1,
    fontSizeHeading2: typography.fontSizeHeading2,
    fontSizeHeading3: typography.fontSizeHeading3,
    fontSizeHeading4: typography.fontSizeHeading4,
    fontSizeHeading5: typography.fontSizeHeading5,
    lineHeight: typography.lineHeightBase,
    lineHeightLG: typography.lineHeightLG,
    lineHeightSM: typography.lineHeightSM,

    // Responsive spacing
    padding: spacing.lg,
    paddingXS: spacing.xs,
    paddingSM: spacing.sm,
    paddingLG: spacing.xl,
    paddingXL: spacing.xxl,
    margin: spacing.lg,
    marginXS: spacing.xs,
    marginSM: spacing.sm,
    marginLG: spacing.xl,
    marginXL: spacing.xxl,

    // Border radius
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // Layout colors
    colorBgContainer: accessibleColors.bgPrimary,
    colorBgLayout: accessibleColors.bgTertiary,
    colorBgElevated: accessibleColors.bgPrimary,
    colorBorder: accessibleColors.borderPrimary,
    colorBorderSecondary: accessibleColors.borderSecondary,

    // Text colors with proper contrast
    colorText: accessibleColors.textPrimary,
    colorTextSecondary: accessibleColors.textSecondary,
    colorTextTertiary: accessibleColors.textTertiary,
    colorTextQuaternary: accessibleColors.textQuaternary,

    // Focus and interaction colors
    colorPrimaryBorderHover: accessibleColors.primaryHover,
    colorPrimaryTextHover: accessibleColors.primaryHover,

    // Screen size tokens for responsive behavior
    screenXS: breakpoints.xs,
    screenSM: breakpoints.sm,
    screenMD: breakpoints.md,
    screenLG: breakpoints.lg,
    screenXL: breakpoints.xl,
    screenXXL: breakpoints.xxl,
  },
  components: {
    Layout: {
      headerBg: accessibleColors.bgPrimary,
      headerHeight: 64,
      headerPadding: `0 ${spacing.lg}px`,
      siderBg: accessibleColors.bgPrimary,
      triggerBg: accessibleColors.bgSecondary,
      triggerColor: accessibleColors.textPrimary,
    },
    Menu: {
      itemBg: accessibleColors.bgPrimary,
      itemSelectedBg: accessibleColors.primaryBg,
      itemHoverBg: accessibleColors.bgSecondary,
      itemSelectedColor: accessibleColors.primary,
      itemColor: accessibleColors.textPrimary,
      iconSize: 16,
      fontSize: typography.fontSizeBase,
      itemPaddingInline: spacing.lg,
      itemMarginInline: spacing.xs,
      itemBorderRadius: 6,
    },
    Table: {
      headerBg: accessibleColors.bgSecondary,
      rowHoverBg: accessibleColors.bgSecondary,
      borderColor: accessibleColors.borderSecondary,
      headerColor: accessibleColors.textPrimary,
      fontSize: typography.fontSizeBase,
      cellPaddingBlock: spacing.md,
      cellPaddingInline: spacing.lg,
    },
    Button: {
      borderRadius: 6,
      controlHeight: 40,
      fontSize: typography.fontSizeBase,
      paddingInline: spacing.lg,
      primaryShadow: "0 2px 0 rgba(5, 145, 255, 0.1)",
      // Ensure proper focus styles for accessibility
      colorPrimaryBorderHover: accessibleColors.primaryHover,
      colorPrimaryTextHover: accessibleColors.primaryHover,
    },
    Card: {
      borderRadiusLG: 8,
      paddingLG: spacing.xl,
      fontSize: typography.fontSizeBase,
      headerBg: "transparent",
      headerFontSize: typography.fontSizeLG,
      headerFontSizeSM: typography.fontSizeBase,
      boxShadowTertiary:
        "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    },
    Form: {
      labelFontSize: typography.fontSizeBase,
      labelColor: accessibleColors.textPrimary,
      labelRequiredMarkColor: accessibleColors.error,
      itemMarginBottom: spacing.xl,
    },
    Input: {
      controlHeight: 40,
      fontSize: typography.fontSizeBase,
      borderRadius: 6,
      paddingInline: spacing.md,
      // Ensure proper focus styles
      activeBorderColor: accessibleColors.primary,
      hoverBorderColor: accessibleColors.primaryBorder,
    },
    Select: {
      controlHeight: 40,
      fontSize: typography.fontSizeBase,
      borderRadius: 6,
      // Ensure proper focus styles
      optionSelectedBg: accessibleColors.primaryBg,
      optionActiveBg: accessibleColors.bgSecondary,
    },
    Pagination: {
      fontSize: typography.fontSizeBase,
      itemActiveBg: accessibleColors.primary,
      itemSize: 32,
    },
    Alert: {
      fontSize: typography.fontSizeBase,
      borderRadiusLG: 8,
      paddingContentHorizontalLG: spacing.lg,
      paddingContentVerticalLG: spacing.md,
    },
    Modal: {
      borderRadiusLG: 8,
      fontSize: typography.fontSizeBase,
      titleFontSize: typography.fontSizeLG,
      contentBg: accessibleColors.bgPrimary,
      headerBg: accessibleColors.bgPrimary,
    },
    Dropdown: {
      borderRadiusLG: 8,
      fontSize: typography.fontSizeBase,
      controlItemBgHover: accessibleColors.bgSecondary,
      controlItemBgActive: accessibleColors.primaryBg,
    },
    Tooltip: {
      borderRadius: 6,
      fontSize: typography.fontSizeSM,
      colorBgSpotlight: "rgba(0, 0, 0, 0.85)",
    },
    // Focus styles for better accessibility
    Anchor: {
      colorPrimary: accessibleColors.primary,
      colorPrimaryHover: accessibleColors.primaryHover,
    },
  },
};

// Extended theme for different contexts
export const lightTheme: ThemeConfig = {
  ...theme,
  token: {
    ...theme.token,
    colorBgContainer: accessibleColors.bgPrimary,
    colorBgLayout: accessibleColors.bgTertiary,
  },
};

export const darkTheme: ThemeConfig = {
  ...theme,
  algorithm: antdTheme.darkAlgorithm,
  token: {
    ...theme.token,
    colorBgContainer: "#141414",
    colorBgLayout: "#000000",
    colorText: "#ffffff",
    colorTextSecondary: "#a6a6a6",
    colorTextTertiary: "#737373",
  },
  components: {
    ...theme.components,
    Layout: {
      ...theme.components?.Layout,
      headerBg: "#141414",
      siderBg: "#141414",
    },
    Menu: {
      ...theme.components?.Menu,
      itemBg: "#141414",
      itemSelectedBg: "#1f1f1f",
      itemHoverBg: "#262626",
      itemColor: "#ffffff",
    },
    Table: {
      ...theme.components?.Table,
      headerBg: "#262626",
      rowHoverBg: "#262626",
      headerColor: "#ffffff",
    },
  },
};

// Responsive utility functions
export const getResponsiveValue = <T>(
  value: T | Partial<Record<keyof typeof breakpoints, T>>,
  screenSize: keyof typeof breakpoints = "md"
): T => {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const responsiveValue = value as Partial<
      Record<keyof typeof breakpoints, T>
    >;
    return (
      responsiveValue[screenSize] ??
      responsiveValue.md ??
      Object.values(responsiveValue)[0]
    );
  }
  return value as T;
};

// Accessibility helpers
export const getFocusStyle = (color: string = accessibleColors.primary) => ({
  outline: `2px solid ${color}`,
  outlineOffset: "2px",
});

// High contrast theme for accessibility
export const highContrastTheme: ThemeConfig = {
  ...theme,
  token: {
    ...theme.token,
    colorPrimary: "#0000ff",
    colorSuccess: "#008000",
    colorWarning: "#ff8c00",
    colorError: "#ff0000",
    colorText: "#000000",
    colorBgContainer: "#ffffff",
    colorBorder: "#000000",
  },
  components: {
    ...theme.components,
    Button: {
      ...theme.components?.Button,
      colorBorder: "#000000",
    },
    Input: {
      ...theme.components?.Input,
      colorBorder: "#000000",
    },
  },
};

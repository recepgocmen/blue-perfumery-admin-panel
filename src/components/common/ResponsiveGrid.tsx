import React from "react";
import { Row, Col, Grid } from "antd";
import type { RowProps } from "antd";
import { breakpoints, getResponsiveValue } from "../../lib/theme";

const { useBreakpoint } = Grid;

interface ResponsiveColSize {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  xxl?: number;
}

interface ResponsiveGridProps extends Omit<RowProps, "gutter"> {
  /** Children components to render in grid */
  children: React.ReactNode;
  /** Responsive column sizes */
  colSizes?: ResponsiveColSize;
  /** Responsive gutter between columns */
  gutter?: number | [number, number] | ResponsiveColSize;
  /** Minimum column width in pixels */
  minColWidth?: number;
  /** Maximum columns per row */
  maxCols?: number;
}

interface ResponsiveCardGridProps extends ResponsiveGridProps {
  /** Whether to maintain equal height cards */
  equalHeight?: boolean;
  /** Card spacing */
  cardSpacing?: number;
}

// Default responsive column sizes following mobile-first approach
const defaultColSizes: ResponsiveColSize = {
  xs: 24, // 1 column on extra small screens
  sm: 12, // 2 columns on small screens
  md: 8, // 3 columns on medium screens
  lg: 6, // 4 columns on large screens
  xl: 6, // 4 columns on extra large screens
  xxl: 4, // 6 columns on extra extra large screens
};

// Helper function to calculate optimal column sizes based on content
const calculateOptimalColumns = (
  childrenCount: number,
  screenSize: keyof typeof breakpoints,
  maxCols?: number
): number => {
  const screenBreakpoint = breakpoints[screenSize];

  // Base column calculation based on screen size
  let optimalCols;
  if (screenBreakpoint <= breakpoints.xs) {
    optimalCols = 1;
  } else if (screenBreakpoint <= breakpoints.sm) {
    optimalCols = Math.min(2, childrenCount);
  } else if (screenBreakpoint <= breakpoints.md) {
    optimalCols = Math.min(3, childrenCount);
  } else if (screenBreakpoint <= breakpoints.lg) {
    optimalCols = Math.min(4, childrenCount);
  } else {
    optimalCols = Math.min(6, childrenCount);
  }

  // Apply max columns constraint
  if (maxCols) {
    optimalCols = Math.min(optimalCols, maxCols);
  }

  return optimalCols;
};

/**
 * ResponsiveGrid - A responsive grid component that adapts to screen sizes
 */
export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  colSizes = defaultColSizes,
  gutter = [16, 16],
  minColWidth = 200,
  maxCols,
  ...rowProps
}) => {
  const screens = useBreakpoint();
  const childrenArray = React.Children.toArray(children);

  // Determine current screen size
  const currentScreen =
    (Object.keys(screens)
      .filter((screen) => screens[screen as keyof typeof screens])
      .pop() as keyof typeof breakpoints) || "xs";

  // Calculate responsive gutter
  const responsiveGutter =
    typeof gutter === "object" && !Array.isArray(gutter)
      ? getResponsiveValue(gutter, currentScreen)
      : gutter;

  // Calculate optimal column span
  const optimalCols = calculateOptimalColumns(
    childrenArray.length,
    currentScreen,
    maxCols
  );
  const colSpan = Math.floor(24 / optimalCols);

  return (
    <Row
      gutter={responsiveGutter}
      {...rowProps}
      role="list"
      aria-label="Responsive grid"
    >
      {childrenArray.map((child, index) => {
        // Use provided colSizes or calculated optimal span
        const responsiveColSizes = colSizes || { [currentScreen]: colSpan };

        return (
          <Col
            key={index}
            {...responsiveColSizes}
            style={{ minWidth: minColWidth }}
            role="listitem"
          >
            {child}
          </Col>
        );
      })}
    </Row>
  );
};

/**
 * ResponsiveCardGrid - Specialized grid for card layouts with enhanced features
 */
export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  children,
  equalHeight = false,
  cardSpacing = 16,
  ...gridProps
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <ResponsiveGrid {...gridProps} gutter={[cardSpacing, cardSpacing]}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          style={{
            height: equalHeight ? "100%" : "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {child}
        </div>
      ))}
    </ResponsiveGrid>
  );
};

/**
 * StatsGrid - Specialized grid for statistics/metrics cards
 */
export const StatsGrid: React.FC<{
  children: React.ReactNode;
  gutter?: number | [number, number];
}> = ({ children, gutter = [16, 16] }) => {
  const statsColSizes: ResponsiveColSize = {
    xs: 24, // 1 column on mobile
    sm: 12, // 2 columns on small
    md: 12, // 2 columns on medium
    lg: 6, // 4 columns on large
    xl: 6, // 4 columns on xl
    xxl: 6, // 4 columns on xxl
  };

  return (
    <ResponsiveGrid
      colSizes={statsColSizes}
      gutter={gutter}
      role="list"
      aria-label="Statistics grid"
    >
      {children}
    </ResponsiveGrid>
  );
};

/**
 * Hook to get responsive grid information
 */

export default ResponsiveGrid;

import React, { useEffect } from "react";
import { Button, Typography } from "antd";

const { Text } = Typography;

/**
 * Screen Reader Only component - hides content visually but keeps it accessible
 */
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <span
    style={{
      position: "absolute",
      width: "1px",
      height: "1px",
      padding: 0,
      margin: "-1px",
      overflow: "hidden",
      clip: "rect(0, 0, 0, 0)",
      whiteSpace: "nowrap",
      border: 0,
    }}
  >
    {children}
  </span>
);

/**
 * Visually Hidden component with option to show on focus
 */
export const VisuallyHidden: React.FC<{
  children: React.ReactNode;
  showOnFocus?: boolean;
}> = ({ children, showOnFocus = false }) => (
  <span
    style={{
      position: "absolute",
      left: showOnFocus ? undefined : "-9999px",
      width: showOnFocus ? "auto" : "1px",
      height: showOnFocus ? "auto" : "1px",
      overflow: showOnFocus ? "visible" : "hidden",
    }}
    onFocus={(e) => {
      if (showOnFocus) {
        e.currentTarget.style.position = "static";
        e.currentTarget.style.left = "auto";
        e.currentTarget.style.width = "auto";
        e.currentTarget.style.height = "auto";
      }
    }}
    onBlur={(e) => {
      if (showOnFocus) {
        e.currentTarget.style.position = "absolute";
        e.currentTarget.style.left = "-9999px";
        e.currentTarget.style.width = "1px";
        e.currentTarget.style.height = "1px";
      }
    }}
  >
    {children}
  </span>
);

/**
 * Live Announcer for dynamic content changes
 */
interface LiveAnnouncerProps {
  message: string;
  priority?: "polite" | "assertive";
  clearAfter?: number; // milliseconds
}

export const LiveAnnouncer: React.FC<LiveAnnouncerProps> = ({
  message,
  priority = "polite",
  clearAfter = 5000,
}) => {
  const [currentMessage, setCurrentMessage] = React.useState(message);

  useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter && message) {
      const timer = setTimeout(() => {
        setCurrentMessage("");
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [message, clearAfter]);

  if (!currentMessage) return null;

  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
      }}
    >
      {currentMessage}
    </div>
  );
};

// Hook moved to src/hooks/useAccessibility.ts

/**
 * Keyboard Navigation Helper
 */
interface KeyboardNavProps {
  children: React.ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
}

export const KeyboardNav: React.FC<KeyboardNavProps> = ({
  children,
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Escape":
        onEscape?.();
        break;
      case "Enter":
        onEnter?.();
        break;
      case "ArrowUp":
        e.preventDefault();
        onArrowUp?.();
        break;
      case "ArrowDown":
        e.preventDefault();
        onArrowDown?.();
        break;
      case "ArrowLeft":
        e.preventDefault();
        onArrowLeft?.();
        break;
      case "ArrowRight":
        e.preventDefault();
        onArrowRight?.();
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown} style={{ outline: "none" }}>
      {children}
    </div>
  );
};

// Hook moved to src/hooks/useAccessibility.ts

/**
 * Error Boundary with accessibility features
 */
interface AccessibleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class AccessibleErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  AccessibleErrorBoundaryState
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): AccessibleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      "Accessibility Error Boundary caught an error:",
      error,
      errorInfo
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              padding: "20px",
              border: "1px solid #ff4d4f",
              borderRadius: "6px",
              backgroundColor: "#fff2f0",
            }}
          >
            <Typography.Title level={4} style={{ color: "#ff4d4f" }}>
              Something went wrong
            </Typography.Title>
            <Text type="secondary">
              An error occurred while loading this section. Please try
              refreshing the page.
            </Text>
            <div style={{ marginTop: "16px" }}>
              <Button
                type="primary"
                onClick={() => window.location.reload()}
                aria-label="Reload page to recover from error"
              >
                Reload Page
              </Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Hooks moved to src/hooks/useAccessibility.ts

// All exports are named exports to support Fast Refresh

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import { queryClient } from "./lib/query-client";
import { theme } from "./lib/theme";
import { router } from "./lib/router";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;

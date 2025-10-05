/**
 * API Client Configuration
 * Axios instance with interceptors for centralized API calls
 */

import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Get API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available (for future JWT implementation)
    const token = localStorage.getItem("auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`
      );
    }

    return config;
  },
  (error: AxiosError) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status;
      const message =
        (error.response.data as { error?: string })?.error || error.message;

      console.error(`❌ API Error [${status}]:`, message);

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("auth_token");
          // window.location.href = '/login'; // Uncomment when auth is implemented
          break;
        case 403:
          console.error(
            "Forbidden: You do not have permission to access this resource"
          );
          break;
        case 404:
          console.error("Not Found: The requested resource does not exist");
          break;
        case 500:
          console.error("Server Error: Something went wrong on the server");
          break;
        default:
          console.error("An error occurred:", message);
      }
    } else if (error.request) {
      console.error("❌ No response received from server");
      console.error("Check if backend is running on:", API_URL);
    } else {
      console.error("❌ Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Export API URL for reference
export { API_URL };

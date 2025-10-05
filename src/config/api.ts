import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

// API Base URL from environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if you implement auth later
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - redirect to login if you have auth
          console.error("Unauthorized access");
          break;
        case 403:
          // Forbidden
          console.error("Forbidden access");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Internal server error");
          break;
        default:
          console.error("API Error:", error.response.data);
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("No response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      error?: string;
      message?: string;
    }>;
    return (
      axiosError.response?.data?.error ||
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An error occurred"
    );
  }
  return "An unexpected error occurred";
};

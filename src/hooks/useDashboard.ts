import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../services/api";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["getDashboardStats"],
    queryFn: () => dashboardApi.getStats().then((response) => response.data),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

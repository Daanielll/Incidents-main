import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IncidentType } from "../types/IncidentType";

export function useIncidentData(pageSize: number, pageIndex: number) {
  const incidents = useQuery<{ incidents: IncidentType[]; count: number }>({
    queryKey: ["incidents", pageIndex, pageSize],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3500/incidents`, {
        params: { limit: pageSize, page: pageIndex },
      });
      return data;
    },
  });
  return incidents;
}
export function useIncidentDataById(incId: number) {
  const incidents = useQuery<IncidentType>({
    queryKey: ["incidents", incId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3500/incidents/${incId}`
      );
      return data;
    },
  });
  return incidents;
}

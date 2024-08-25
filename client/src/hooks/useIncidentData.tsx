import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IncidentType } from "../types/IncidentType";
import useSearchQuery from "./useSearchQuery";

export function useIncidentData() {
  const searchParams = useSearchQuery();
  const incidents = useQuery<{ incidents: IncidentType[]; count: number }>({
    queryKey: ["incidents", searchParams],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:3500/incidents`, {
        params: { ...searchParams },
      });
      data.incidents.forEach((inc: IncidentType) => {
        inc.start_date = new Date(inc.start_date);
        inc.end_date = inc.end_date ? new Date(inc.end_date) : null;
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
      data.start_date = new Date(data.start_date);
      data.end_date = data.end_date ? new Date(data.end_date) : null;
      return data;
    },
  });
  return incidents;
}

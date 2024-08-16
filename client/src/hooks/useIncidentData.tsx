import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IncidentType } from "../types/IncidentType";

export function useIncidentData(incId?: number) {
  const incidents = useQuery<IncidentType>({
    queryKey: ["incidents", incId],
    queryFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3500/incidents/${incId ? incId : ""}`
      );
      return data;
    },
  });
  return incidents;
}

import { useQuery } from "@tanstack/react-query";
import useSearchQuery from "../useSearchQuery";
import { IncidentType } from "../../types/IncidentType";
import { fetchAllIncidents, fetchIncidentById } from "../../services/api";

const useIncidentData = () => {
  const searchParams = useSearchQuery();
  const incidents = useQuery<{ incidents: IncidentType[]; count: number }>({
    queryKey: ["incidents", searchParams],
    queryFn: () => fetchAllIncidents(searchParams),
  });
  return incidents;
};
const useIncidentDataById = (incId: number) => {
  const incidents = useQuery<IncidentType>({
    queryKey: ["incidents", incId],
    queryFn: () => fetchIncidentById(incId),
  });
  return incidents;
};

export { useIncidentData, useIncidentDataById };

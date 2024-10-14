import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchQuery from "../useSearchQuery";
import { IncidentType } from "../../types/IncidentType";
import {
  createIncident,
  deleteIncident,
  editIncident,
  fetchAllIncidents,
  fetchIncidentById,
  handleError,
} from "../../services/api";
import { toast } from "sonner";

// Hook to fetch all incidents
const useIncidentData = () => {
  const searchParams = useSearchQuery();
  const incidents = useQuery<{ incidents: IncidentType[]; count: number }>({
    queryKey: ["incidents", searchParams],
    queryFn: () => fetchAllIncidents(searchParams),
  });
  return incidents;
};

// Hook to fetch one incident by ID
const useIncidentDataById = (incId: number) => {
  const incidents = useQuery<IncidentType>({
    queryKey: ["incidents", incId],
    queryFn: () => fetchIncidentById(incId),
  });
  return incidents;
};

// Hook to delete an incident
export function useDeleteIncident() {
  const { mutateAsync } = useMutation({
    mutationFn: deleteIncident,
    onError: handleError,
    onSuccess: () => {
      toastAndInvalidate("אירוע נמחק בהצלחה");
    },
  });
  return mutateAsync;
}

// Hook to update an incident
const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: editIncident,
    onError: handleError,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["incidents", data.incident.id],
      });
      toastAndInvalidate("אירוע התעדכן בהצלחה");
    },
  });
  return mutateAsync;
};

// Hook to create a new incident
const useNewIncident = () => {
  const { mutateAsync } = useMutation({
    mutationFn: createIncident,
    onError: handleError,
    onSuccess: () => toastAndInvalidate("אירוע נוצר בהצלחה"),
  });
  return mutateAsync;
};

// Function to toast and invalidate queries on success
function toastAndInvalidate(text: String) {
  const searchParams = useSearchQuery();
  const queryClient = useQueryClient();

  queryClient.invalidateQueries({
    queryKey: ["incidents", searchParams],
  });

  toast.success(text, {
    position: "top-center",
    className: "toast-rtl",
  });
}
export {
  useIncidentData,
  useIncidentDataById,
  useUpdateIncident,
  useNewIncident,
};

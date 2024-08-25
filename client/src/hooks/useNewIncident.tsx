import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useSearchQuery from "./useSearchQuery";

export function useNewIncident() {
  const searchParams = useSearchQuery();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (incident: any) => {
      const response = await axios.post(
        "http://localhost:3500/incidents",
        incident,
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error, {
          position: "top-center",
          richColors: true,
          className: "toast-rtl",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["incidents", searchParams],
      });

      toast.success("אירוע נוצר בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
    },
  });
  return mutateAsync;
}

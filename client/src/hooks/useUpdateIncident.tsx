import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useSearchQuery from "./useSearchQuery";

export function useUpdateIncident() {
  const searchParams = useSearchQuery();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({ changes, id }: { changes: Object; id: number }) => {
      const response = await axios.patch(
        `http://localhost:3500/incidents/${id}`,
        changes,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["incidents", searchParams],
      });
      queryClient.invalidateQueries({
        queryKey: ["incidents", data.incident.id],
      });
      toast.success("אירוע עודכן בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
    },
  });
  return mutateAsync;
}

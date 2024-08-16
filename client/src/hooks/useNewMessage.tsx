import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export function useNewMessage(incidentId: number) {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (message: string) => {
      const response = await axios.post(
        `http://localhost:3500/incidents/activity/${incidentId}`,
        { message },
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["incidents", incidentId] });
      toast.success("עדכון נשלח בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
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
  });
  return mutateAsync;
}

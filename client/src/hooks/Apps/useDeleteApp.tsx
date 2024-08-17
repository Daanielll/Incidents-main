import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useDeleteApp() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(`http://localhost:3500/apps/${id}`, {
        withCredentials: true,
      });

      return response.data;
    },
    onError: () => {
      toast.error("מערכת לא נמחקה", {
        position: "top-center",
        richColors: true,
        className: "toast-rtl",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApps"] });
      toast.success("מערכת נמחקה בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
    },
  });
  return mutateAsync;
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { AppType } from "../../types/AppType";

export function useNewApp() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (app: AppType) => {
      const response = await axios.post("http://localhost:3500/apps", app, {
        withCredentials: true,
      });
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
      queryClient.invalidateQueries({ queryKey: ["allApps"] });
      toast.success("מערכת נוצרה בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
    },
  });
  return mutateAsync;
}

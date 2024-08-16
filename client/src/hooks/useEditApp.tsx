import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppOptional } from "../types/App";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export function useEditApp() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async ({
      changes,
      id,
    }: {
      changes: AppOptional;
      id: number;
    }) => {
      const response = await axios.patch(
        `http://localhost:3500/apps/${id}`,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApps"] });
      toast.success("מערכת עודכנה בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
    },
  });
  return mutateAsync;
}

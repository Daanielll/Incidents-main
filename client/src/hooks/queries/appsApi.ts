import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { AppType } from "../../types/AppType";
import {
  createApp,
  deleteApp,
  editApp,
  fetchAllApps,
} from "../../services/api";
import { toast } from "sonner";
import { AxiosError } from "axios";

// Hook to fetch all apps
function useAllApps(): UseQueryResult<AppType[]> {
  return useQuery<AppType[], Error>({
    queryKey: ["allApps"],
    queryFn: fetchAllApps,
  });
}

// Hook to delete an app
function useDeleteApp() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: deleteApp,
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

// Hook to edit an app
function useEditApp() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: editApp,
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

// Hook to create an app
function useNewApp() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createApp,
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

export { useAllApps, useDeleteApp, useEditApp, useNewApp };

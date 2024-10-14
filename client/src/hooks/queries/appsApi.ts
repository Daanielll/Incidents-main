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
  handleError,
} from "../../services/api";
import { toast } from "sonner";

// Hook to fetch all apps
function useAllApps(): UseQueryResult<AppType[]> {
  return useQuery<AppType[], Error>({
    queryKey: ["allApps"],
    queryFn: fetchAllApps,
  });
}

// Hook to delete an app
function useDeleteApp() {
  const toastAndInvalidate = useToastAndInvalidate();

  const { mutateAsync } = useMutation({
    mutationFn: deleteApp,
    onError: handleError,
    onSuccess: () => toastAndInvalidate("מערכת נמחקה בהצלחה"),
  });
  return mutateAsync;
}

// Hook to edit an app
function useEditApp() {
  const toastAndInvalidate = useToastAndInvalidate();
  const { mutateAsync } = useMutation({
    mutationFn: editApp,
    onError: handleError,
    onSuccess: () => toastAndInvalidate("מערכת עודכנה בהצלחה"),
  });
  return mutateAsync;
}

// Hook to create an app
function useNewApp() {
  const toastAndInvalidate = useToastAndInvalidate();
  const { mutateAsync } = useMutation({
    mutationFn: createApp,
    onError: handleError,
    onSuccess: () => toastAndInvalidate("מערכת נוצרה בהצלחה"),
  });
  return mutateAsync;
}

// Function to toast and invalidate queries on success
function useToastAndInvalidate() {
  const queryClient = useQueryClient();
  return (text: string) => {
    queryClient.invalidateQueries({ queryKey: ["allApps"] });
    toast.success(text, {
      position: "top-center",
      className: "toast-rtl",
    });
  };
}

export { useAllApps, useDeleteApp, useEditApp, useNewApp };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export function useUpdateIncident() {
  const [searchParams, setSearchParms] = useSearchParams();
  const pagination = {
    pageSize: Number(searchParams.get("size")) || 10,
    pageIndex: Number(searchParams.get("page")) || 0,
  };
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
        queryKey: ["incidents", pagination.pageIndex, pagination.pageSize],
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

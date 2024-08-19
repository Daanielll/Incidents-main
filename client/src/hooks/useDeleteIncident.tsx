import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function useDeleteIncident() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParms] = useSearchParams();
  const pagination = {
    pageSize: Number(searchParams.get("size")) || 10,
    pageIndex: Number(searchParams.get("page")) || 1,
  };
  const { mutateAsync } = useMutation({
    mutationFn: async (id: number) => {
      const response = await axios.delete(
        `http://localhost:3500/incidents/${id}`,
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
        queryKey: ["incidents", pagination.pageIndex, pagination.pageSize],
      });
      toast.success("מערכת נמחקה בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
    },
  });
  return mutateAsync;
}

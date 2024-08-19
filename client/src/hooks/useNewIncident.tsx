import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";

export function useNewIncident() {
  const [searchParams, setSearchParms] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const pagination = {
    pageSize: Number(searchParams.get("size")) || 10,
    pageIndex: Number(searchParams.get("page")) || 0,
  };
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
        queryKey: ["incidents", pagination.pageIndex, pagination.pageSize],
      });
      navigate(`/incidents?${queryParams.toString()}`);

      toast.success("אירוע נוצר בהצלחה", {
        position: "top-center",
        className: "toast-rtl",
      });
    },
  });
  return mutateAsync;
}

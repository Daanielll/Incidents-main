import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { UserType } from "../../types/UserType";
export interface LoginCredentials {
  id: number;
  password: string;
}
export const useUser = () => {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery<UserType | null>({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await axios.get<UserType | null>(
        "http://localhost:3500/users/auth",
        {
          withCredentials: true,
        }
      );
      return response.data;
    },
    retry: false,
  });

  const login = useMutation<UserType, Error, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await axios.post(
        "http://localhost:3500/users/auth",
        credentials,
        { withCredentials: true }
      );
      return response.data;
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["userData"], data);
      toast.success("שלום מתוקים", {
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

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
  };
};

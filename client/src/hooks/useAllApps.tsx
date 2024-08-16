import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { AppType } from "../types/AppType";

/**
 * Custom hook to fetch all apps from the server.
 *
 * @returns {UseQueryResult<App[]>} The result of the query, containing the data and loading state.
 */
export function useAllApps(): UseQueryResult<AppType[]> {
  return useQuery<AppType[], Error>({
    queryKey: ["allApps"],
    queryFn: async (): Promise<AppType[]> => {
      const { data } = await axios.get<AppType[]>("http://localhost:3500/apps");
      return data;
    },
  });
}

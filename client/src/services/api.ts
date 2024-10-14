import axios from "axios";
import { AppType } from "../types/AppType";
import { IncidentType } from "../types/IncidentType";
import { toast } from "sonner";

const apiClient = axios.create({
  baseURL: "http://localhost:3500",
});

// App API
const fetchAllApps = async () => {
  const { data } = await apiClient.get<AppType[]>("/apps");
  return data;
};

const deleteApp = async (id: number) => {
  const { data } = await apiClient.delete(`/apps/${id}`, {
    withCredentials: true,
  });
  return data;
};

const editApp = async ({
  changes,
  id,
}: {
  changes: Partial<AppType>;
  id: number;
}) => {
  const { data } = await apiClient.patch(`/apps/${id}`, changes, {
    withCredentials: true,
  });
  return data;
};

const createApp = async (app: AppType) => {
  const { data } = await apiClient.post<AppType>("/apps", app, {
    withCredentials: true,
  });
  return data;
};

// Incident API
const fetchAllIncidents = async (searchParams: { [k: string]: string }) => {
  const { data } = await apiClient.get("/incidents", {
    params: { ...searchParams },
  });
  data.incidents.forEach((inc: IncidentType) => {
    inc.start_date = new Date(inc.start_date);
    inc.end_date = inc.end_date ? new Date(inc.end_date) : null;
  });
  return data;
};

const fetchIncidentById = async (incId: number) => {
  const { data } = await apiClient.get(`/incidents/${incId}`);
  data.start_date = new Date(data.start_date);
  data.end_date = data.end_date ? new Date(data.end_date) : null;
  data.updated_at = new Date(data.updated_at);
  return data;
};

const deleteIncident = async (id: number) => {
  const { data } = await apiClient.delete(`incidents/${id}`, {
    withCredentials: true,
  });
  return data;
};

const editIncident = async ({
  changes,
  id,
}: {
  changes: Object;
  id: number;
}) => {
  const { data } = await apiClient.patch(`/incidents/${id}`, changes, {
    withCredentials: true,
  });
  return data;
};

const createIncident = async (incident: Object) => {
  const { data } = await apiClient.post("/incidents", incident, {
    withCredentials: true,
  });
  return data;
};

// Handle error toast
const handleError = (error: Error) => {
  {
    if (error instanceof axios.AxiosError) {
      toast.error(error.response?.data.error || error.message, {
        position: "top-center",
        richColors: true,
        className: "toast-rtl",
      });
    }
  }
};
export {
  fetchAllApps,
  deleteApp,
  editApp,
  createApp,
  fetchAllIncidents,
  fetchIncidentById,
  deleteIncident,
  editIncident,
  handleError,
  createIncident,
};

import axios from "axios";
import { AppType } from "../types/AppType";
import { IncidentType } from "../types/IncidentType";

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

export {
  fetchAllApps,
  deleteApp,
  editApp,
  createApp,
  fetchAllIncidents,
  fetchIncidentById,
};

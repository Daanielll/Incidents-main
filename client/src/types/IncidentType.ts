import { AppType } from "./AppType";
import {
  EnvEnum,
  ImpactEnum,
  PlatformEnum,
  ReporterEnum,
  SiteEnum,
  StatusEnum,
} from "./Enums";

export interface IncidentType {
  title: string;
  description: string;
  technical_impact: keyof typeof ImpactEnum | null;
  operational_impact: string;
  monitored: boolean;
  start_date: Date;
  end_date?: Date | null;
  status: keyof typeof StatusEnum | null;
  opened_by?: { name: string };
  updated_at?: Date;
  updated_by?: { name: string };
  IncidentApp: { app: AppType }[];
  IncidentImpact: { app: AppType }[];
  env?: keyof typeof EnvEnum | null;
  id?: number;
  omer_sent: boolean;
  opened_by_id?: number;
  platform?: keyof typeof PlatformEnum | null;
  reported_by: keyof typeof ReporterEnum | null;
  site?: keyof typeof SiteEnum | null;
  snow_ticket?: string;
}

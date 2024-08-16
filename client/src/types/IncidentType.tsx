import { AppType } from "./AppType";

export enum SiteEnum {
  FIRST = "ראשון",
  SECOND = "שני",
  OTHER = "אחר",
}

export enum PlatformEnum {
  OPENSHIFT = "Openshift",
  ORACLE = "Oracle",
  MAINFRAME = "Mainframe",
}
export enum StatusEnum {
  ONGOING = "בטיפול",
  AWAITING_ANSWER = "מחכה לתשובה",
  RESOLVED = "טופל",
}
export enum envEnum {
  RED = "Red",
  BLACK = "Black",
  OTHER = "אחר",
}

export interface IncidentType {
  title: string;
  description: string;
  technical_impact: string;
  operational_impact: string;
  monitored: boolean;
  start_date: Date;
  end_date?: Date;
  status: "ONGOING" | "AWAITING_ANSWER" | "RESOLVED";
  opened_by: { first_name: string; last_name: string };
  IncidentApp: { app: AppType }[];
  IncidentImpact: { app: AppType }[];
  IncidentActivity: {
    message: string;
    message_date: string;
    sent_by: { first_name: string; last_name: string };
  }[];
  env: "RED" | "BLACK" | "OTHER";
  id: number;
  omer_sent: false;
  opened_by_id: number;
  platform: "OPENSHIFT" | "ORACLE" | "MAINFRAME";
  reported_by: string;
  site: "FIRST" | "SECOND" | "OTHER";
  snow_ticket?: string;
}

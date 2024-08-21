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
export enum ReporterEnum {
  KAPAT = 'קפ"ט',
  CLIENT = "לקוח",
  MONITORED = "ניטור",
}

export enum ImpactEnum {
  SHUTDOWN = "השבתה",
  PARTIAL_SHUTDOWN = "השבתה חלקית",
  FEATURE_SHUTDOWN = "השבתת יכולת",
  BACKUP_NONE = "ירידה משרידות",
  SLOW = "איטיות",
  SLOW_SHUTDOWN = "איטיות עד כדי השבתה",
  JITTER = "ריצודים",
  DATA_TRANSMISSION = "פער בתעבורת מידע",
  NONE = "אין",
}

export interface IncidentType {
  title: string;
  description: string;
  technical_impact: keyof typeof ImpactEnum | null;
  operational_impact: string;
  monitored: boolean;
  start_date: string | Date;
  end_date?: string;
  status: keyof typeof StatusEnum | null;
  opened_by?: { first_name: string; last_name: string };
  IncidentApp: { app: AppType }[];
  IncidentImpact: { app: AppType }[];
  IncidentActivity?: {
    message: string;
    message_date: string;
    sent_by: { first_name: string; last_name: string };
  }[];
  env: keyof typeof envEnum | null;
  id?: number;
  omer_sent: boolean;
  opened_by_id?: number;
  platform: keyof typeof PlatformEnum | null;
  reported_by: keyof typeof ReporterEnum | null;
  site: keyof typeof SiteEnum | null;
  snow_ticket?: string;
  jira_ticket?: string;
}

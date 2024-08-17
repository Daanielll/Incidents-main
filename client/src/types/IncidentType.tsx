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
  technical_impact: keyof typeof ImpactEnum;
  operational_impact: string;
  monitored: boolean;
  start_date: Date;
  end_date?: Date;
  status: keyof typeof StatusEnum;
  opened_by: { first_name: string; last_name: string };
  IncidentApp: { app: AppType }[];
  IncidentImpact: { app: AppType }[];
  IncidentActivity: {
    message: string;
    message_date: string;
    sent_by: { first_name: string; last_name: string };
  }[];
  env: keyof typeof envEnum;
  id: number;
  omer_sent: false;
  opened_by_id?: number;
  platform: keyof typeof PlatformEnum;
  reported_by: keyof typeof ReporterEnum;
  site: keyof typeof SiteEnum;
  snow_ticket?: string;
}

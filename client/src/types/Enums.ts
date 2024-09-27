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
export enum EnvEnum {
  RED = "Red",
  BLACK = "Black",
  OTHER = "אחר",
}
export enum ReporterEnum {
  KAPAT = 'קפ"ט',
  CLIENT = "לקוח",
  MONITORED = "ניטור",
}
export enum RecoveryEnum {
  AVAILABLE = "DR זמין",
  DISABLED = "DR לא פעיל",
  NONE = "אין",
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

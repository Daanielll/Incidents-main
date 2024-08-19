const siteSettings = [
  { value: null, name: "בחר אתר" },
  { value: "FIRST", name: "ראשון" },
  { value: "SECOND", name: "שני" },
  { value: "OTHER", name: "אחר" },
];
const recoverySettings = [
  { value: null, name: "בחר שרידות" },
  { value: "AVAILABLE", name: "DR זמין" },
  { value: "DISABLED", name: "DR לא פעיל" },
  { value: "NONE", name: "אין" },
];
const envSettings = [
  { value: null, name: "בחר סביבה" },
  { value: "RED", name: "Red" },
  { value: "BLACK", name: "Black" },
  { value: "YELLOW", name: "Yellow" },
];
const paltformSettings = [
  { value: null, name: "בחר פלטפורמה" },
  { value: "ORACLE", name: "Oracle" },
  { value: "OPENSHIFT", name: "Openshift" },
  { value: "MAINFRAME", name: "Mainframe" },
];
const reporterSettings = [
  { value: null, name: "בחר מדווח" },
  { value: "CLIENT", name: "לקוח" },
  { value: "MONITORED", name: "ניטור" },
  { value: "KAPAT", name: 'קפ"ט' },
];
const impactSettings = [
  { value: null, name: "בחר משמעות טכנית" },
  { value: "SHUTDOWN", name: "השבתה" },
  { value: "PARTIAL_SHUTDOWN", name: "השבתה חלקית" },
  { value: "FEATURE_SHUTDOWN", name: "השבתת יכולת" },
  { value: "BACKUP_NONE", name: "ירידה משרידות" },
  { value: "SLOW", name: "איטיות" },
  { value: "SLOW_SHUTDOWN", name: "איטיות עד כדי השבתה" },
  { value: "JITTER", name: "ריצודים" },
  { value: "DATA_TRANSMISSION", name: "פער בתעבורת מידע" },
  { value: "NONE", name: "אין" },
];
const statusSettings = [
  { value: null, name: "בחר סטטוס" },
  { value: "RESOLVED", name: "טופל" },
  { value: "AWAITING_ANSWER", name: "מחכה לתשובה" },
  { value: "ONGOING", name: "בטיפול" },
];

export default {
  siteSettings,
  recoverySettings,
  envSettings,
  paltformSettings,
  reporterSettings,
  impactSettings,
  statusSettings,
};

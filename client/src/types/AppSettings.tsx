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

export { siteSettings, recoverySettings, envSettings, paltformSettings };

import {
  EnvEnum,
  ImpactEnum,
  PlatformEnum,
  RecoveryEnum,
  ReporterEnum,
  SiteEnum,
  StatusEnum,
} from "./Enums";

const siteSettings = SettingsValues("בחר אתר", SiteEnum);
const envSettings = SettingsValues("בחר סביבה", EnvEnum);
const platformSettings = SettingsValues("בחר סביבה", PlatformEnum);
const recoverySettings = SettingsValues("בחר שרידות", RecoveryEnum);
const reporterSettings = SettingsValues("בחר מדווח", ReporterEnum);
const impactSettings = SettingsValues("בחר משמעות טכנית", ImpactEnum);
const statusSettings = SettingsValues("בחר סטטוס", StatusEnum);

function SettingsValues(nullValue: string, enumObject: object) {
  const entries = Object.entries(enumObject).map(([key, name]) => ({
    value: key,
    name,
  }));
  return [{ value: null, name: nullValue }, ...entries];
}
export default {
  siteSettings,
  recoverySettings,
  envSettings,
  platformSettings,
  reporterSettings,
  impactSettings,
  statusSettings,
};

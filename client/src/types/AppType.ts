import { EnvEnum, PlatformEnum, RecoveryEnum, SiteEnum } from "./Enums";

export interface AppType {
  description?: string | null;
  env?: keyof typeof EnvEnum | null;
  id?: number;
  main_site?: keyof typeof SiteEnum | null;
  name: string;
  operational_impact?: string | null;
  platform?: keyof typeof PlatformEnum | null;
  recovery?: keyof typeof RecoveryEnum | null;
}

export interface AppType {
  description?: string | null;
  env?: "RED" | "BLACK" | "OTHER" | null;
  id?: number;
  main_site?: "FIRST" | "SECOND" | "OTHER" | null;
  name: string;
  operational_impact?: string | null;
  platform?: string | null;
  recovery?: string | null;
}

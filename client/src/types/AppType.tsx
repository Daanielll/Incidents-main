export interface AppType {
  description?: string;
  env?: "RED" | "BLACK" | "OTHER";
  id: number;
  main_site?: "FIRST" | "SECOND" | "OTHER";
  name: string;
  operational_impact?: string;
  platform?: string;
  recovery?: string;
}

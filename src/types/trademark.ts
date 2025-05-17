import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface DashboardItemTemplate {
  title: string;
  amount?: number;
  packages?: string;
  repImage: string | StaticImport;
  repImageAlt: string;
}

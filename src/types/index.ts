import type { LucideIcon } from "lucide-react";

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface SupplyChainNode {
  id: string;
  title: string;
  Icon: LucideIcon;
  details: string;
  data: string;
  chartData?: ChartDataPoint[];
  chartTitle?: string;
  chartUnit?: string;
}

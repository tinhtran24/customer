export interface ParamsResetDashboard {
  isSaleNull?: boolean;
  isSourceNull?: boolean;
  isDateNull?: boolean;
}

export interface FilterValuesDashboard {
  from?: Date | null;
  to?: Date | null;
  year?: number | null;
  sale?: string | null;
  source?: string | null;
}

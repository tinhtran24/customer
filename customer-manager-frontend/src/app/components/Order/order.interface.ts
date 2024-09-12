export interface ParamsReset {
  isCustomerNameNull?: boolean;
  isSaleNull?: boolean;
  isSourceNull?: boolean;
  isDateNull?: boolean;
}

export interface FilterValues {
  from: Date | null;
  to: Date | null;
  customerName?: string | null;
  sale?: string | null;
  source?: string | null;
}

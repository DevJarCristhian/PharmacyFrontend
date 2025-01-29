export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface GetCategory {
  value: number;
  label: string;
}

export interface Get {
  id?: number;
  description: string;
  maintenanceId: number;
  category: string;
  status: number;
}

export interface Store {
  id?: number;
  description: string;
  maintenanceId?: number | null;
  status: boolean;
}

export interface StoreCategory {
  id?: number;
  description: string;
}

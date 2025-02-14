export interface Params {
  // page: number;
  // perPage: number;
  search?: string | null;
}

export interface GetMessage {
  id?: number;
  description: string;
  maintenanceId: number;
  category: string;
  status: number;
}

export interface GetContact {
  id?: number;
  description: string;
  maintenanceId: number;
  category: string;
  status: number;
}

export interface GetPatient {
  id?: number;
  description: string;
  maintenanceId: number;
  category: string;
  status: number;
}

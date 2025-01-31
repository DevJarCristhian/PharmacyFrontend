export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  name: string;
  description: string;
  longDescription: string;
  observation: string;
  receive: string;
  condition: number;
  status: number;
  unitMeasure: number;
}

export interface Store {
  id?: number;
  description: string;
  permissions: number[];
}
export interface Permission {
  id: number;
  description: string;
  parent: number;
}

export interface Permissions {
  id: number;
  description: string;
  parent: number | null;
  children: Permissions[];
}

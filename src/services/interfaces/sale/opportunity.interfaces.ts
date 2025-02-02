export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  documentNumber: string;
  patientFullName: string;
  farmacyName: string;
  productName: string;
  invoiceSerie: string;
  invoiceNumber: string;
  quantity: number | string;
  invoiceDate: string;
  dateUpdated: string;
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

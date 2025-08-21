export interface Params {
  page: number;
  perPage: number;
  country?: number | null;
  search?: string | null;
}

export interface Get {
  id?: string;
  chainName: string;
  departmentName: string;
  branch: string;
  phone: string;
  address: string;
  email: string;
  municipality: string;
}

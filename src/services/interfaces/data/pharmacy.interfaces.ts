export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  chainName: string;
  departmentName: string;
  branch: string;
  phone: string;
  address: string;
  email: string;
  municipality: string;
}

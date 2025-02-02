export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  departmentName: string;
  countryName: string;
  city: string;
  name: string;
  address: string;
  date: string;
  updatedAt: string;
}

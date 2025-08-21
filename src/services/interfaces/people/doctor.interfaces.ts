export interface Params {
  page: number;
  perPage: number;
  country?: number | null;
  search?: string | null;
  department?: number | null;
  city?: number | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface Get {
  id?: string;
  departmentName: string;
  countryName: string;
  city: string;
  name: string;
  address: string;
  date: string;
  updatedAt: string;
}

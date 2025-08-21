export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  country?: number | null;
}

export interface Get {
  id?: number;
  name: string;
  country: number;
  countryName: number[];
  date: string;
  updatedAt: string;
}

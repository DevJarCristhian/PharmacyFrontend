export interface Params {
  page: number;
  perPage: number;
  country?: number | null;
  search?: string | null;
}

export interface Get {
  id?: string;
  chain: string;
  countryName: string;
}

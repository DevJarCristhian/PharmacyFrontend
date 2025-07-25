export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface Get {
  id?: string;
  chain: string;
  countryName: string;
}

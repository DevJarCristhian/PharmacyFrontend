export interface Params {
  page: number;
  perPage: number;
  country?: number | null;
  search?: string | null;
}

export interface Get {
  id?: string;
  chainId: string;
  chainName: string;
  productName: string;
  countryName: string;
  currencyId: string;
  price: string;
  status: number;
}

export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface Get {
  id?: string;
  chainName: string;
  productName: string;
  countryName: string;
  currencyId: string;
  price: string;
  status: number;
}

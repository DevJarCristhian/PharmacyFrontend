export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: string;
  name: string;
  address: string;
  date: string;
  updatedAt: string;
}

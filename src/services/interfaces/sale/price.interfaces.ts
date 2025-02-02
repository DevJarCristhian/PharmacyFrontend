export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  description: string;
  permissions: number[];
  created_at?: Date;
  updated_at?: Date;
}

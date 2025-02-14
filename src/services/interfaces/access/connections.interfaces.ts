export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface Get {
  id?: number;
  name: string;
  status: boolean;
}

export interface Store {
  id?: number;
  name: string;
}

export interface UpdateConnection {
  id?: number;
  qrcode: string;
  status: boolean;
}

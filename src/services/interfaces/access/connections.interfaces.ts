export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface Get {
  id?: number;
  name: string;
  status: boolean;
  battery: string;
  qrcode: string;
  createdAt?: Date;
}

export interface Store {
  id?: number;
  name: string;
  battery: string;
}

export interface UpdateConnection {
  id?: number;
  qrcode: string;
  status: boolean;
}

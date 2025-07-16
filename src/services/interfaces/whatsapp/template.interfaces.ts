export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface Get {
  id?: number;
  name: string;
  message: string;
  type: number;
  contentType: number;
  file: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Store {
  id?: number;
  name: string;
  message: string;
  type: number;
  contentType: number;
  file: string | null;
}
export interface Permission {
  id: number;
  description: string;
  parent: number;
}

export interface Permissions {
  id: number;
  description: string;
  parent: number | null;
  children: Permissions[];
}

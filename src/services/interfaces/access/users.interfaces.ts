export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

interface Role {
  id: number;
  description: string;
}

export interface Get {
  id?: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  status: boolean;
  whatsappId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Store {
  id?: number;
  name: string;
  email: string;
  password?: string | null;
  roleId: number | null;
  status: boolean;
  whatsappId?: number;
}

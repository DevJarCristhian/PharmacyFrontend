export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  status?: string | null;
}

export interface Get {
  id?: number;
  departmentName: string;
  countryName: string;
  fullName: string;
  gender: number | string;
  address: string;
  email: string;
  phone: string;
  birthDate: string;
  documentNumber: string;
  enrollmentDate: string;
}

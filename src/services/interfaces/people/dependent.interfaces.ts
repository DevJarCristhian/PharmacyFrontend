export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
  gender?: number | null;
  department?: number | null;
  birthDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
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

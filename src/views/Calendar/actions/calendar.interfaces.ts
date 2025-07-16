export interface Params {
  page: number;
  perPage: number;
  search?: string | null;
}

export interface Get {
  id?: number;
  name: string;
  country: number;
  countryName: number[];
  date: string;
  updatedAt: string;
}

export interface Store {
  id?: number;
  title: string;
  startDate: string;
  endDate: string;
  timeStart: string;
  timeEnd: string | null;
  category: string;
  description: string;
  templateId: number | null;
  patients: {
    id?: number;
    patientId: string;
    namePatient: string;
    phone: string;
  }[];
}

export interface PatientSend {
  id?: number;
  patientId: string;
  namePatient: string;
  phone: string;
  status: string;
}

export interface GetPatient {
  id: string;
  documentNumber: string;
  name: string;
  gender: string;
  phone: string;
  birthDate: string;
  age: string;
  selected: boolean;
}

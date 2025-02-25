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
  id?: string;
  departmentName: string;
  countryName: string;
  fullName: string;
  address: string;
  email: string;
  gender: number;
  phone: string;
  documentType: string;
  documentNumber: string;
  birthDate: string;
  enrollmentDate: string;
}

export interface GetPatient {
  // patientInformation: string;
  programStartDate: string;
  doctorName: string;
  institutionName: string;
  medicationConsumption: string;
  // emailSending: number;
  // whatsappSending: number;
  // physicalMailSending: number;
  verified: string;
  gender: number;
  quantityRedemptions: string;
  // operatorId: string;
  civilStatus: number;
  patientStatus: number;
  patientType: number;

  contactName: string;
  description: string;
  dateUpdated: string;
}

export interface Update {
  gender: number;
  civilStatus: number | null;
  patientStatus: number | null;
  patientType: number | null;
  contactName: string;
  description: string;
}
